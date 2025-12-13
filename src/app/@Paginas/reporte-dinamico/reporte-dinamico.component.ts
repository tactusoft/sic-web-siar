import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PaginationInstance } from 'ngx-pagination';
import * as XLSX from 'xlsx';
import { GenericoService } from '../../servicios/generico.service';
import { LenguajeService } from '../../servicios/lenguaje.service';
import { ToastrService } from 'ngx-toastr';
import { Constants } from '../../common/constants';

interface AlertaReporte {
  Pais: string;
  Anio: number;
  Categoria: string;
  Alertas: number;
}

@Component({
  selector: 'app-reporte-dinamico',
  templateUrl: './reporte-dinamico.component.html',
  styleUrls: ['./reporte-dinamico.component.scss']
})
export class ReporteDinamicoComponent implements OnInit {

  // Datos
  alertas: Array<AlertaReporte> = [];
  alertasFiltradas: Array<AlertaReporte> = [];

  // Paginación
  page = 0;
  nRegistros = 10;
  public configPaginador: PaginationInstance = {
    id: 'custom',
    itemsPerPage: this.nRegistros,
    currentPage: this.page,
    totalItems: 0
  };

  // Filtros
  formFiltro!: FormGroup;
  buscarPais!: FormControl;
  buscarCategoria!: FormControl;
  buscarAnio!: FormControl;

  // Listas para filtros
  paisesDisponibles: Array<string> = [];
  categoriasDisponibles: Array<string> = [];
  aniosDisponibles: Array<number> = [];

  // Idioma
  textos: any = null;
  idioma = '';
  idiomaActual = 1;

  // Totales
  totalAlertas = 0;
  totalRegistros = 0;

  // Nombre archivo export
  fileName = 'reporte_alertas.xlsx';

  constructor(
    private lenguajeService: LenguajeService,
    private genericoService: GenericoService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    // Inicializar controles de búsqueda
    this.buscarPais = new FormControl('');
    this.buscarCategoria = new FormControl('');
    this.buscarAnio = new FormControl('');

    // Inicializar formulario de filtros
    this.formFiltro = new FormGroup({
      idPais: new FormControl('0'),
      idCategoria: new FormControl('0'),
      idAnio: new FormControl('0'),
      buscarTexto: new FormControl('')
    });

    // Suscribirse al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      this.idioma = data;
      this.idiomaActual = this.lenguajeService.devolverIntIdioma(data);

      // Cargar textos del idioma
      this.lenguajeService.getTranslationTexts(this.idioma).subscribe(
        texts => {
          this.textos = texts;
        },
        () => {
          this.toastrService.error(
            this.textos?.mensajes
              ? this.textos.mensajes.MENSAJE_ERROR
              : Constants.MENSAJE_ERROR
          );
        }
      );

      // Cargar datos
      this.consultarReporte();
    });

    // Suscribirse a cambios de filtros
    this.formFiltro.get('idPais')?.valueChanges.subscribe(() => {
      this.page = 0;
      this.aplicarFiltros();
    });

    this.formFiltro.get('idCategoria')?.valueChanges.subscribe(() => {
      this.page = 0;
      this.aplicarFiltros();
    });

    this.formFiltro.get('idAnio')?.valueChanges.subscribe(() => {
      this.page = 0;
      this.aplicarFiltros();
    });
  }

  consultarReporte(): void {
    const url = `/alerta/reporteAlertas?idLanguage=${this.idiomaActual}`;

    this.genericoService.get(url).subscribe(
      res => {
        if (res.message === '200') {
          this.alertas = res.data.map((item: any) => ({
            Pais: item.Pais,
            Anio: item.Año || item.Anio,
            Categoria: item.Categoria,
            Alertas: item.Alertas
          }));
          this.extraerFiltros();
          this.aplicarFiltros();
        } else if (res.message === '204') {
          this.toastrService.info(
            this.textos?.mensajes
              ? this.textos.mensajes.NO_DATA
              : Constants.MENSAJE_NO_DATA
          );
        } else {
          this.toastrService.error(
            this.textos?.mensajes
              ? this.textos.mensajes.MENSAJE_ERROR
              : Constants.MENSAJE_ERROR
          );
        }
      },
      error => {
        console.error(error);
        this.toastrService.error(
          this.textos?.mensajes
            ? this.textos.mensajes.MENSAJE_ERROR
            : Constants.MENSAJE_ERROR
        );
      }
    );
  }

  extraerFiltros(): void {
    // Extraer países únicos
    this.paisesDisponibles = [...new Set(this.alertas.map(a => a.Pais))]
      .sort((a, b) => a.localeCompare(b));

    // Extraer categorías únicas
    this.categoriasDisponibles = [...new Set(this.alertas.map(a => a.Categoria))]
      .sort((a, b) => a.localeCompare(b));

    // Extraer años únicos
    this.aniosDisponibles = [...new Set(this.alertas.map(a => a.Anio))]
      .sort((a, b) => b - a); // Descendente
  }

  aplicarFiltros(): void {
    const paisSeleccionado = this.formFiltro.get('idPais')?.value || '0';
    const categoriaSeleccionada = this.formFiltro.get('idCategoria')?.value || '0';
    const anioSeleccionado = this.formFiltro.get('idAnio')?.value || '0';
    const textoFiltro = (this.formFiltro.get('buscarTexto')?.value || '').toLowerCase();

    this.alertasFiltradas = this.alertas.filter(alerta => {
      const cumplePais = paisSeleccionado === '0' || alerta.Pais === paisSeleccionado;
      const cumpleCategoria = categoriaSeleccionada === '0' || alerta.Categoria === categoriaSeleccionada;
      const cumpleAnio = anioSeleccionado === '0' || alerta.Anio === parseInt(anioSeleccionado, 10);

      const cumpleTexto = textoFiltro === '' ||
        alerta.Pais.toLowerCase().includes(textoFiltro) ||
        alerta.Categoria.toLowerCase().includes(textoFiltro) ||
        alerta.Anio.toString().includes(textoFiltro);

      return cumplePais && cumpleCategoria && cumpleAnio && cumpleTexto;
    });

    // Actualizar totales
    this.totalRegistros = this.alertasFiltradas.length;
    this.totalAlertas = this.alertasFiltradas.reduce((sum, item) => sum + item.Alertas, 0);
    this.configPaginador.totalItems = this.totalRegistros;

    // Volver a primera página
    this.configPaginador.currentPage = 1;
  }

  onTextChange(texto: string): void {
    if (texto.length > 2 || texto.length === 0) {
      this.aplicarFiltros();
    }
  }

  limpiarFiltros(): void {
    this.formFiltro.patchValue({
      idPais: '0',
      idCategoria: '0',
      idAnio: '0',
      buscarTexto: ''
    });
    this.aplicarFiltros();
  }

  pageChanged(event: number): void {
    this.page = event;
    this.configPaginador.currentPage = event;
  }

  mostrar(filtro: string, campo: string): boolean {
    if (filtro.length > 0) {
      return campo.toLowerCase().includes(filtro.toLowerCase());
    }
    return true;
  }

  exportExcel(): void {
    // Preparar datos para exportar
    const datosExport = this.alertasFiltradas.map(item => ({
      País: item.Pais,
      Anio: item.Anio,
      Categoría: item.Categoria,
      'Número de Alertas': item.Alertas
    }));

    // Crear worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosExport);

    // Crear workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte Alertas');

    // Generar nombre con fecha
    const fecha = new Date().toISOString().split('T')[0];
    const nombreArchivo = `reporte_alertas_${fecha}.xlsx`;

    // Guardar archivo
    XLSX.writeFile(wb, nombreArchivo);

    this.toastrService.success(
      this.textos?.reporte_dinamico?.export_exitoso || 'Exportación exitosa'
    );
  }

  // Obtener resumen por país (para futuras funcionalidades)
  obtenerResumenPorPais(): any[] {
    const agrupado = this.alertasFiltradas.reduce((acc, item) => {
      if (!acc[item.Pais]) {
        acc[item.Pais] = 0;
      }
      acc[item.Pais] += item.Alertas;
      return acc;
    }, {} as any);

    return Object.keys(agrupado)
      .map(pais => ({ pais, total: agrupado[pais] }))
      .sort((a, b) => b.total - a.total);
  }

  // Obtener resumen por categoría (para futuras funcionalidades)
  obtenerResumenPorCategoria(): any[] {
    const agrupado = this.alertasFiltradas.reduce((acc, item) => {
      if (!acc[item.Categoria]) {
        acc[item.Categoria] = 0;
      }
      acc[item.Categoria] += item.Alertas;
      return acc;
    }, {} as any);

    return Object.keys(agrupado)
      .map(categoria => ({ categoria, total: agrupado[categoria] }))
      .sort((a, b) => b.total - a.total);
  }
}
