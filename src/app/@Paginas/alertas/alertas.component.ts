import { Component, HostListener, OnInit } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { GenericoService } from '../../servicios/generico.service';
import { Alerta } from '../../modelos/alerta';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogAlertaComponent } from './dialog-alerta/dialog-alerta.component';
import { Constants } from '../../common/constants';
import { Idioma } from '../../modelos/idioma';
import { Dominio } from '../../modelos/dominio';
import { LenguajeService } from '../../servicios/lenguaje.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Pais } from '../../modelos/pais';
import { Proveedor } from 'src/app/modelos/proveedor';


@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.scss']
})
export class AlertasComponent implements OnInit {
  regionValue;
  paisNotificanteValue;
  paisOrigenValue;
  nivelRiesgoValue;
  idiomaValue;
  tipoMedidaValue;
  riesgoValue;
  proveedorValue;
  categoriaValue;

  alertas: Array<Alerta> = [];
  alerta: Alerta;
  idAlerta: string;
  size = 18;
  page = 0;
  public configPaginador: PaginationInstance = {
    id: 'custom',
    itemsPerPage: this.size,
    currentPage: 0,
    totalItems: 0
  };
  regionesList: any[] = [];
  paisesOrigenList: Array<Pais> = [];
  paisesNotificanteList: Array<Pais> = [];

  riesgosList: Array<Dominio> = [];
  nivelRiesgosList: Array<Dominio> = [];
  idiomasList: Array<Idioma> = [];
  tipoMedidaList: Array<Dominio> = [];
  proveedoresList: Array<Proveedor> = [];
  categoriasList: Array<Dominio> = [];
  verFiltro: boolean;
  verPalabraClave: boolean;
  stringFiltro = '';

  formFiltroAlertas: FormGroup;
  formFiltroPalabraClave: FormGroup;

  idiomaLogin = localStorage.getItem('idioma');
  resolucionAnterior = window.screen.width;

  mostrarPaginador: boolean;
  idioma: number;
  textos: any;
  textosMensajes: any;

  constructor(
    private genericoService: GenericoService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private lenguajeService: LenguajeService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {

  }

  ngOnInit(): void {
    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      this.idioma = this.lenguajeService.devolverIntIdioma(data);
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
        this.textos = texts;
        this.textosMensajes = texts?.mensajes;
        this.obtenerListasRecursos();
      }, () => {
        this.toastr.error(this.textosMensajes ? this.textosMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
      });
    });
    this.verFiltro = false;
    this.verPalabraClave = true;
    this.formFiltroAlertas = this.formBuilder.group({
      region: new FormControl(),
      paisNotificante: new FormControl(),
      paisOrigen: new FormControl(),
      nivelRiesgo: new FormControl(),
      idioma: new FormControl(),
      tipoMedida: new FormControl(),
      riesgo: new FormControl(),
      proveedor: new FormControl(),
      categoria: new FormControl()
    });

    this.route.queryParams.subscribe(params => {
      this.idAlerta = params.idAlerta;
      if (this.idAlerta) {
        this.getAlertaPorId(this.idAlerta);
      }
    });
    this.registrosPantallaGrande();
    this.getAlertas(0, this.size, '');
    this.cargarPaisNotificante({ value: '0' });
    this.consultarIdiomas();
    this.obtenerListasRecursos();
  }

  obtenerListasRecursos(): void {
    this.consultarPais();
    this.consultarRiesgos();
    this.consultarNivelRiesgos();
    this.consultarTipoMedida();
    this.consultarProveedores();
    this.consultarCategorias();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.obtenerResolucionPantalla();
  }

  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(): void {
    this.obtenerResolucionPantalla();
  }

  private obtenerResolucionPantalla(): void {
    if ((window.screen.width <= 991 && this.resolucionAnterior > 991) || (window.screen.width > 991 && this.resolucionAnterior <= 991)
      || (window.screen.width < 1200 && this.resolucionAnterior >= 1200)
      || (window.screen.width >= 1200 && this.resolucionAnterior < 1200)) {
      this.ngOnInit();
    }
    this.resolucionAnterior = window.screen.width;
  }

  private registrosPantallaGrande(): void {
    if (window.screen.width <= 991) {
      this.size = 10;
    } else if (window.screen.width < 1200) {
      this.size = 15;
    } else {
      this.size = 18;
    }
    this.configPaginador.itemsPerPage = this.size;
  }

  openDialog(alerta: Alerta): void {
    const dialogRef = this.dialog.open(DialogAlertaComponent, {
      data: {
        alerta
      },
      panelClass: 'mat-detalle-alerta',
      maxWidth: 'unset'
    });

    dialogRef.afterClosed();
  }

  getAlertas(page: number, size: number, txtBuscar: any): void {
    // ajustar filtro pais region search
    const url = `/alerta/listarAlerta?page=${page}&pais=0&region=&search=${txtBuscar}&size=${size}&lang=${this.idioma}`;
    this.genericoService.get(url).subscribe(
      res => {
        if (res.message === '200') {
          this.mostrarPaginador = true;
          this.alertas = res.data.Alertas;
          this.configPaginador.totalItems = res.data.totalItems;
        } else {
          this.mostrarPaginador = false;
          this.alertas = [];
          this.configPaginador.totalItems = 0;
          this.toastr.info(this.textosMensajes ? this.textosMensajes.MENSAJE_NO_DATA : Constants.MENSAJE_NO_DATA);
          this.toastr.error(this.textosMensajes ? this.textosMensajes.MENSAJE_NO_DATA : Constants.MENSAJE_NO_DATA);
        }
      }, error => {
        console.error(error);
        this.toastr.error(this.textosMensajes ? this.textosMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
      }
    );
  }

  getAlertaPorId(id: string): void {
    // ajustar filtro pais region search
    const url = `/alerta/detalleAlerta?id=${id}`;
    this.genericoService.get(url).subscribe(
      res => {
        if (res.message === '200') {
          if (res.data.length > 0) {
            this.alerta = res.data[0];
            this.openDialog(this.alerta);
          } else {
            this.toastr.error(this.textosMensajes ? this.textosMensajes.MENSAJE_NO_DATA : Constants.MENSAJE_NO_DATA);
          }
        } else {
          this.toastr.error(this.textosMensajes ? this.textosMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        }
      }, error => {
        console.error(error);
        this.toastr.error(this.textosMensajes ? this.textosMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
      }
    );
  }

  pageChanged($event, txtBuscar: any): void {
    this.configPaginador.currentPage = $event;
    this.page = $event;
    if (this.verPalabraClave) {
      txtBuscar = (txtBuscar) ? txtBuscar : '';
      this.getAlertas(this.page - 1, this.configPaginador.itemsPerPage, txtBuscar);
    } else {
      this.buscarFiltro(this.page - 1, this.configPaginador.itemsPerPage, this.paisNotificanteValue, this.paisOrigenValue,
        this.nivelRiesgoValue, this.idiomaValue, this.tipoMedidaValue, this.riesgoValue, this.proveedorValue, this.categoriaValue);
    }
  }

  consultarPais(): void {
    const url = `${Constants.PATH_LISTAR_PAIS_LANG}?pais=0&lang=${this.idioma}`;
    this.genericoService.get(url).subscribe(res => {
      res.data.sort((f, s) => {
        const a = f.nombre.toUpperCase().trim();
        const b = s.nombre.toUpperCase().trim();
        return a < b ? -1 : a > b ? 1 : 0;
      });
      this.paisesOrigenList = res.data;
    });
  }

  consultarIdiomas(): void {
    const url = Constants.PATH_LISTAR_IDIOMAS; // `/idioma/listarIdioma?page=0&size=100`;
    this.genericoService.get(url).subscribe(res => {
      res.data.sort((f, s) => {
        const a = f.descripcion.toUpperCase().trim();
        const b = s.descripcion.toUpperCase().trim();

        return a < b ? -1 : a > b ? 1 : 0;
      });
      this.idiomasList = res.data;
    });
  }

  consultarRiesgos(): void {
    const url = `${Constants.PATH_LISTAR_DOMINIO_NOMBRE_LANG}?nombre=Riesgos&idioma=${this.idioma}`;
    this.genericoService.get(url).subscribe(res => {
      res.data.dominio[0].subDominio.sort(this.subDominioSort);
      this.riesgosList = res.data.dominio;
    });
  }

  consultarNivelRiesgos(): void {
    const url = `${Constants.PATH_LISTAR_DOMINIO_NOMBRE_LANG}?nombre=Nivel%20de%20Riesgo&idioma=${this.idioma}`;
    this.genericoService.get(url).subscribe(res => {
      res.data.dominio[0].subDominio.sort(this.subDominioSort);
      this.nivelRiesgosList = res.data.dominio;
    });
  }

  consultarTipoMedida(): void {
    const url = `${Constants.PATH_LISTAR_DOMINIO_NOMBRE_LANG}?nombre=Tipo%20de%20Medida&idioma=${this.idioma}`;
    this.genericoService.get(url).subscribe(res => {
      res.data.dominio[0].subDominio.sort(this.subDominioSort);
      this.tipoMedidaList = res.data.dominio;
    });
  }

  consultarProveedores(): void {
    const url = `/proveedor/listar?page=0&size=100`;
    this.genericoService.get(url).subscribe(res => {
      this.proveedoresList = res.data.result;
      this.proveedoresList.sort((a, b) => {
        if (a.title > b.title) {
          return 1;
        }
        if (a.title < b.title) {
          return -1;
        }
        return 0;
      });
    });
  }

  consultarCategorias(): void {
    const url = `${Constants.PATH_LISTAR_DOMINIO_NOMBRE_LANG}?nombre=Categoria&idioma=${this.idioma}`;
    this.genericoService.get(url).subscribe(res => {
      res.data.dominio[0].subDominio.sort(this.subDominioSort);
      this.categoriasList = res.data.dominio;
    });
  }

  mostrarFiltro(): void {
    this.verFiltro = true;
    this.verPalabraClave = false;
  }

  mostrarPalabraClave(): void {
    this.verFiltro = false;
    this.verPalabraClave = true;
  }

  cargarPaisNotificante(event: any): void {
    const region = event.value === '0' ? 'all' : this.regionesList[event.value - 1];
    const url = `/pais/filtrarPaises?region=${region}`;
    this.genericoService.get(url).subscribe(res => {
      res.data.sort((f, s) => {
        const a = f.nombre.toUpperCase().trim();
        const b = s.nombre.toUpperCase().trim();
        return a < b ? -1 : a > b ? 1 : 0;
      });
      this.paisesNotificanteList = res.data;
    });
  }

  buscarFiltro(
    page: number,
    size: number,
    paisNotificante: string,
    paisOrigen: string,
    nivelRiesgo: string,
    idioma: string,
    tipoMedida: string,
    riesgo: string,
    proveedor: string,
    categoria: string
  ): void {
    const region = this.regionValue && this.regionValue > 0 ? this.regionesList[this.regionValue - 1] : '';
    paisNotificante = (paisNotificante) ? paisNotificante : '';
    paisOrigen = (paisOrigen) ? paisOrigen : '';
    nivelRiesgo = (nivelRiesgo) ? nivelRiesgo : '';
    idioma = (idioma) ? idioma : '';
    tipoMedida = (tipoMedida) ? tipoMedida : '';
    riesgo = (riesgo) ? riesgo : '';
    proveedor = (proveedor) ? proveedor : '';
    categoria = (categoria) ? categoria : '';
    const url = `/alerta/filtrarAlertaRegion?region=${region}&idCountry=${paisNotificante}&productOriginCountryId=${paisOrigen}&nivelRiesgo=${nivelRiesgo}&riesgo=${riesgo}&contentLanguageId=${idioma}&measureTypeId=${tipoMedida}&providerId=${proveedor}&categoryId=${categoria}&page=${page}&size=${size}`;
    this.genericoService.get(url).subscribe(
      res => {
        if (res.message === '200') {
          this.alertas = res.data.Alertas;
          this.configPaginador.totalItems = res.data.totalItems;
        } else {
          this.alertas = [];
          this.configPaginador.totalItems = 0;
          this.toastr.info(this.textosMensajes ? this.textosMensajes.MENSAJE_NO_DATA : Constants.MENSAJE_NO_DATA);
        }
      }, error => {
        console.error(error);
        this.toastr.error(this.textosMensajes ? this.textosMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
      }
    );
  }

  buscarAlertasFiltro(page: number, size: number, paisNotificante: string, paisOrigen: string, nivelRiesgo: string,
                      idioma: string, tipoMedida: string, riesgo: string, proveedor: string, categoria: string): void {
    this.configPaginador.currentPage = 0;
    this.buscarFiltro(page, size, paisNotificante, paisOrigen, nivelRiesgo, idioma, tipoMedida, riesgo, proveedor, categoria);
  }

  limpiarFiltro(): void {
    this.regionValue = 0;
    this.paisNotificanteValue = 0;
    this.paisOrigenValue = 0;
    this.nivelRiesgoValue = 0;
    this.idiomaValue = 0;
    this.tipoMedidaValue = 0;
    this.riesgoValue = 0;
    this.proveedorValue = 0;
    this.categoriaValue = 0;
    this.stringFiltro = '';
    this.getAlertas(0, this.size, '');
  }

  subDominioSort(f, s): number {
    const a = f.description.toUpperCase().trim();
    const b = s.description.toUpperCase().trim();

    return a < b ? -1 : a > b ? 1 : 0;
  }

  limpiarBusquedaPorPalabra(inputPalabraClave: HTMLInputElement): void {
    inputPalabraClave.value = '';
    this.stringFiltro = '';
    this.configPaginador.currentPage = 0;
    this.getAlertas(0, 20, '');
  }
  getAlertasFiltro(txtBuscar: string): void {
    this.configPaginador.currentPage = 0;
    this.getAlertas(0, this.configPaginador.itemsPerPage, txtBuscar);
  }

  nombreIdiomaTraduccion(descripcion: string): any {
    try {
      if (this.textos?.idiomas) {
        return this.textos.idiomas[descripcion.trim()];
      } else {
        return descripcion;
      }
    } catch {
      return descripcion;
    }
  }
}
