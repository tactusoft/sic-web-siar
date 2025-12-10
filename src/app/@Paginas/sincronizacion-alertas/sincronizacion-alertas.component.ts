import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { GenericoService } from '../../servicios/generico.service';
import { TipoHomologacion } from '../../modelos/registro-homologacion';
import { DialogGestionSincronizacionComponent } from './dialog-gestion-sincronizacion/dialog-gestion-sincronizacion.component';
import { AlertaSincronizacion } from '../../modelos/alerta-sincronizacion';
import { MatPaginator } from '@angular/material/paginator';
import { Constants } from '../../common/constants';
import { LenguajeService } from '../../servicios/lenguaje.service';
import { ToastrService } from 'ngx-toastr';
import { PaisesService } from 'src/app/servicios/paises.service';

@Component({
  selector: 'app-sincronizacion-alertas',
  templateUrl: './sincronizacion-alertas.component.html',
  styleUrls: ['./sincronizacion-alertas.component.scss']
})

export class SincronizacionAlertasComponent implements OnInit {
  menuAlertasActivo = false;
  mostrarHomologaciones = false;
  alertaActual: AlertaSincronizacion;
  listaProblemasReportados = [];
  listaCategorias = [];
  listaPaises = [];
  buscadorPais = false;
  buscadorID = false;
  buscadorProducto = false;
  buscadorPublicante = false;
  buscadorPublicacion = false;
  idioma: string;
  textos: any = null;
  textosMensajes: any = null;
  errorFiltro = false;
  mostrarMapeos = true;

  displayedColumns: string[] = ['position', 'pais', 'fecha_sincronizacion', 'comentarios'];
  columnsAlerta: string[] = ['vista', 'pais', 'siarId', 'producto', 'publicante', 'publicacion'];
  dataSource = new MatTableDataSource<AlertaSincronizacion>([]);
  dataAlertas = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginatorAlertas: MatPaginator;


  constructor(private dialog: MatDialog,
              private toastr: ToastrService,
              private lenguajeService: LenguajeService,
              private paisesService: PaisesService,
              private genericoService: GenericoService) { }

  ngOnInit(): void {
    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      this.idioma = data;
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(this.idioma).subscribe(texts => {
        this.textos = texts;
        this.textosMensajes = texts?.mensajes;
      },
        () => {
          this.toastr.error(this.textosMensajes ? this.textosMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
    this.obtenerUltimaSincronizacion();
    this.dataAlertas.filterPredicate = this.CrearFiltrosAlertas();
  }

  private configurarControlesPaginador(paginator: MatPaginator): MatPaginator {
    paginator._intl.itemsPerPageLabel = this.textos?.sincronizacion_alertas?.paginador
      ? this.textos?.sincronizacion_alertas.paginador.items_pagina : 'Items por página';
    paginator._intl.nextPageLabel = this.textos?.sincronizacion_alertas?.paginador
      ? this.textos?.sincronizacion_alertas.paginador.pagina_siguiente : 'Siguiente';
    paginator._intl.previousPageLabel = this.textos?.sincronizacion_alertas?.paginador
      ? this.textos?.sincronizacion_alertas.paginador.pagina_anterior : 'Anterior';
    paginator._intl.lastPageLabel = this.textos?.sincronizacion_alertas?.paginador
      ? this.textos?.sincronizacion_alertas.paginador.pagina_final : 'Final';
    paginator._intl.firstPageLabel = this.textos?.sincronizacion_alertas?.paginador
      ? this.textos?.sincronizacion_alertas.paginador.pagina_inicial : 'Inicial';
    return paginator;
  }

  administrarSincronizacion(homologacion: any): void {
    const dialogRef = this.dialog.open(DialogGestionSincronizacionComponent, {
      panelClass: 'mat-dialog-gestion-sincronizacion',
      data: {
        nuevo: homologacion.nuevoRegistro,
        registro_ajuste: homologacion.registro,
        tipoRegistro: homologacion.tipoRegistro.toString()
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value === true) {
        this.mostrarMapeos = false;
        this.recargarTablas(homologacion.tipoRegistro.toString());
      }
    });
  }

  recargarTablas(tipoTablaHomolar: string): any {
    return new Promise(() => {
      setTimeout(() => {
        this.obtenerHomologaciones(tipoTablaHomolar).then(data => {
          if (tipoTablaHomolar === TipoHomologacion.TipoP) {
            this.listaPaises = data;
          } else {
            this.listaCategorias = data;
          }
          this.mostrarHomologaciones = true;
          this.mostrarMapeos = true;
        });
      }, 500);
    });
  }

  obtenerUltimaSincronizacion(): void {
    const urlSinc = `${Constants.PATH_GET_SINCRONIZACION}?filtro=0&page=0&size=10&fecha=`;
    this.genericoService.get(urlSinc).subscribe(respuesta => {
      if (respuesta.message === '200') {
        this.dataSource.data = respuesta.data;
      } else if (respuesta.message === '204') {
        this.dataSource.data = [];
      } else {
        console.error(respuesta.menssage);
        this.dataSource.data = [];
      }
    }, error => {
      console.error(error);
      this.toastr.error(this.textosMensajes ? this.textosMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR, '¡Error', {
        closeButton: true,
        titleClass: 'toast-tittle-error'
      });
      this.dataSource.data = [];
    });
  }

  sincronizarDatosHomologados(): void {
    this.menuAlertasActivo = false;
    this.mostrarHomologaciones = false;
    this.obtenerUltimaSincronizacion();
  }

  mostrarAlertas(): void {
    this.menuAlertasActivo = true;
    this.mostrarHomologaciones = false;
    this.obtenerAlertas();
  }

  cargarHomologaciones(alerta: AlertaSincronizacion): any {
    this.mostrarHomologaciones = false;
    this.cargarProblemasReportados(alerta);
    this.consultarHomologacionesGenericas();
  }

  consultarHomologacionesGenericas(): void {
    this.obtenerHomologaciones(TipoHomologacion.TipoP).then(data => {
      this.listaPaises = data;
      this.mostrarHomologaciones = true;
      this.mostrarMapeos = true;
    });
    this.obtenerHomologaciones(TipoHomologacion.TipoC).then(data => {
      this.listaCategorias = data;
      this.mostrarHomologaciones = true;
      this.mostrarMapeos = true;
    });
  }

  obtenerHomologaciones(tipo: string): Promise<any> {
    return new Promise((resolve) => {
      const urlSinc = `${Constants.PATH_GET_HOMOLOGACIONES}${tipo}`;
      this.genericoService.get(urlSinc).subscribe(respuesta => {
        if (respuesta.message === '200') {
          resolve(respuesta.data);
        } else if (respuesta.message === '204') {
          resolve([]);
        } else {
          console.error(respuesta.menssage);
          resolve([]);
        }
      }, error => {
        console.error(error);
        this.toastr.error(this.textosMensajes ? this.textosMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR, '¡Error', {
          closeButton: true,
          titleClass: 'toast-tittle-error'
        });
        resolve([]);
      });
    });
  }

  cargarProblemasReportados(alerta: AlertaSincronizacion): void {
    this.alertaActual = alerta;
    this.listaProblemasReportados = alerta.detalleLog;
  }

  obtenerAlertas(): void {
    const url = `${Constants.PATH_GET_SINCRONIZACION}?filtro=1&page=0&size=10&fecha=`;
    this.genericoService.get(url).subscribe(respuesta => {
      if (respuesta.message === '200') {
        this.dataAlertas.data = respuesta.data.Sincronizacion;
        setTimeout(() => {
          this.dataAlertas.paginator = this.configurarControlesPaginador(this.paginatorAlertas);
        });
      } else if (respuesta.message === '204') {
        this.dataAlertas.data = [];
      } else {
        console.error(respuesta.menssage);
        this.dataAlertas.data = [];
      }
    }, error => {
      console.error(error);
      this.toastr.error(this.textosMensajes ? this.textosMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR, '¡Error', {
        closeButton: true,
        titleClass: 'toast-tittle-error'
      });
      this.dataSource.data = [];
    });
  }

  resincronizarAlerta(idAlerta: number): void {
    const urlSinc = `${Constants.PATH_RESINC_ALERTAS}${idAlerta}`;
    this.genericoService.get(urlSinc).subscribe(respuesta => {
      if (respuesta.message === '200') {
        this.toastr.success(this.textosMensajes ? this.textosMensajes.MSJ_OPE_REALIZADA : Constants.MSJ_OPE_REALIZADA);
        window.location.reload();
      }
    }, error => {
      console.error(error);
      this.toastr.error(this.textosMensajes ? this.textosMensajes.MSJ_OPE_REALIZADA : Constants.MENSAJE_ERROR, '¡Error', {
        closeButton: true,
        titleClass: 'toast-tittle-error'
      });
      this.dataSource.data = [];
    });
  }

  /**
   * Filtros de columnas alertas
   */

  gestionarFiltroPais(): void {
    const valor = !this.buscadorPais;
    this.inactivarFiltros();
    this.buscadorPais = valor;
    this.dataAlertas.filter = '';
  }

  gestionarFiltroID(): void {
    const valor = !this.buscadorID;
    this.inactivarFiltros();
    this.buscadorID = valor;
    this.dataAlertas.filter = '';
  }

  gestionarFiltroProducto(): void {
    const valor = !this.buscadorProducto;
    this.inactivarFiltros();
    this.buscadorProducto = valor;
    this.dataAlertas.filter = '';
  }

  gestionarFiltroPublicante(): void {
    const valor = !this.buscadorPublicante;
    this.inactivarFiltros();
    this.buscadorPublicante = valor;
    this.dataAlertas.filter = '';
  }

  gestionarFiltroPublicacion(): void {
    const valor = !this.buscadorPublicacion;
    this.inactivarFiltros();
    this.buscadorPublicacion = valor;
    this.dataAlertas.filter = '';
  }

  filtrarAlertas(event: Event, columnaFiltro: string): void {
    try {
      const filterValue = (event.target as HTMLInputElement).value;
      const filtroBuscar: any = {
        columna: columnaFiltro,
        valor: filterValue.trim().toLowerCase()
      };
      this.dataAlertas.filter = filtroBuscar;
      if (this.errorFiltro) {
        this.errorFiltro = false;
        this.dataAlertas.filter = '';
      }
    } catch (error) {
      this.dataAlertas.filter = '';
      this.toastr.error(this.textosMensajes ? this.textosMensajes?.FILTRO_NO_SOPORTADO : Constants.FILTRO_NO_SOPORTADO);
    }
  }

  inactivarFiltros(): void {
    this.buscadorPais = false;
    this.buscadorID = false;
    this.buscadorProducto = false;
    this.buscadorPublicante = false;
    this.buscadorPublicacion = false;
  }

  CrearFiltrosAlertas(): any {
    return (data: any, filters: any) => {
      try {
        switch (filters.columna) {
          case this.columnsAlerta[1]: {
            return data.country.id.toString().includes(filters.valor);
          } case this.columnsAlerta[2]: {
            return data.id.toString().includes(filters.valor);
          } case this.columnsAlerta[3]: {
            return data.comment ? data.comment.trim().toLowerCase().toString().includes(filters.valor) : false;
          } case this.columnsAlerta[4]: {
            return data.country.nombre.trim().toLowerCase().toString().includes(filters.valor);
          } case this.columnsAlerta[5]: {
            let filterValue = filters.valor;
            try {
              if (filterValue.length === 10) {
                const format = new Date(Number(filterValue.split('/')[2]),
                  Number(filterValue.split('/')[1]) - 1, Number(filterValue.split('/')[0]), 0, 0, 0);
                filterValue = format.toISOString().slice(0, 10);
                return data.date.includes(filterValue);
              } else if (filterValue.length === 2 && !isNaN(Number(filterValue))) {
                return data.date.includes(`-${filterValue}`);
              } else if (filterValue.length === 5) {
                return data.date.includes(`-${filterValue.split('/')[1]}-${filterValue.split('/')[0]}`);
              } else if (filterValue.length === 0) {
                return true;
              } else {
                return true;
              }
            } catch (error) {
              if (!this.errorFiltro) {
                this.toastr.error(this.textosMensajes ? this.textosMensajes.FILTRO_NO_SOPORTADO : Constants.FILTRO_NO_SOPORTADO);
                this.errorFiltro = true;
              }
              return true;
            }
          } default: {
            return true;
          }
        }
      } catch {
        return true;
      }
    };
  }

  getDescripcionPais(pais: any): string {
    try {
      return this.paisesService.listadoPaises.find(item => item.id === pais.id).nombre.trim();
    } catch {
      return pais.nombre.trim();
    }
  }
}
