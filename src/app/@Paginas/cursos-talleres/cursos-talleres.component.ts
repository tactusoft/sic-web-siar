import { Component, OnInit, HostListener } from '@angular/core';
import { GenericoService } from '../../servicios/generico.service';
import { CursosTalleres } from '../../modelos/cursos-talleres';
import { PaginationInstance } from 'ngx-pagination';
import { Pais } from '../../modelos/pais';
import { FormGroup, FormControl } from '@angular/forms';
import { Cantidades } from '../../modelos/cantidades';
import { MatOption } from '@angular/material/core/option';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { ModalGestionCursosComponent } from './tarjeta-curso/modal-gestion-cursos-talleres/modal-cursos-talleres.component';
import { CursosTalleresService } from './cursos-talleres.service';
import { Router } from '@angular/router';
import { Constants } from '../../common/constants';
import {LenguajeService} from '../../servicios/lenguaje.service';
import {CabeceraService} from '../../servicios/cabecera.service';
import { PaisesService } from 'src/app/servicios/paises.service';

@Component({
  selector: 'app-cursos-talleres',
  templateUrl: './cursos-talleres.component.html',
  styleUrls: ['./cursos-talleres.component.scss']
})
export class CursosTalleresComponent implements OnInit {
  cursosInfo: any = null;
  nRegistros = 8;
  totalRegistros = 0;
  page = 0;
  isAdmin = false;
  public configGrupos: PaginationInstance = {
    id: 'custom',
    itemsPerPage: this.nRegistros,
    currentPage: 0,
    totalItems: this.totalRegistros
  };
  showDetalle = false;
  cursosTalleres: Array<CursosTalleres> = [];
  cursoDetalle: CursosTalleres;
  paises = [];
  tipos = [];
  cantidadPais: Array<Cantidades> = [];
  cantidadTipo: Array<Cantidades> = [];
  buscarPais: FormControl;
  buscarTipo: FormControl;

  paisesList: Array<Pais> = [];
  tiposList: Array<any> = [];
  // tslint:disable-next-line:no-inferrable-types
  idTipoSecion = 0 ;
  formFiltro: FormGroup;
  formCursoTaller: FormGroup;
  iconoEditar = Constants.ICON_EDITAR_NEW;
  iconoEliminar = Constants.ICON_ELIMINAR_NEW;
  iconocargueFile = Constants.ICON_CARGAR_FILE;
  idioma: number;
  resolucionAnterior = window.screen.width;

  constructor(public dialog: MatDialog, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer,
              private genericoService: GenericoService, private toastr: ToastrService,
              private lenguajeService: LenguajeService,
              private paisesService: PaisesService,
              private cursosTalleresService: CursosTalleresService,
              private router: Router,
              private cabeceraService: CabeceraService) {
    iconRegistry.addSvgIcon('iconoEditar', sanitizer.bypassSecurityTrustResourceUrl(this.iconoEditar));
    iconRegistry.addSvgIcon('iconoEliminar', sanitizer.bypassSecurityTrustResourceUrl(this.iconoEliminar));
    iconRegistry.addSvgIcon('iconocargueFile', sanitizer.bypassSecurityTrustResourceUrl(this.iconocargueFile));
  }

  ngOnInit(): void {
    this.registrosPantallaGrande();
    this.cabeceraService.closeMenu.emit(true);

    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      this.idioma = this.lenguajeService.devolverIntIdioma(data);

      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
          this.cursosInfo = texts;
          this.consultarTipos();
        }, () => {
          this.toastr.error(this.cursosInfo?.mensajes ? this.cursosInfo.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
    this.cursosTalleresService.recargarCursosYTalleres.subscribe(() => {
      this.consultarPaises();
      this.consultarTipos();
      this.configGrupos.currentPage = this.page;
      this.page = this.page <= 0 ? 0 : this.page - 1;
      this.consultarCursos(this.page, this.nRegistros);
    });
    this.isAdmin = !!(localStorage.getItem('usuario') && localStorage.getItem('token') && (this.router.url === '/cursosTalleres'));
    this.idTipoSecion = this.isAdmin && (this.router.url !== '/cursosTalleres/seccion/1') ? 0 : 1;
    this.formCursoTaller = new FormGroup({
      documentos: new FormControl(),
      enlaces: new FormControl(['Enlace Prueba']),
      fechaFin: new FormControl(new Date()),
      fechaInicio: new FormControl(new Date()),
      fotos: new FormControl(),
      id: new FormControl(0),
      idPais: new FormControl(1),
      idTipo: new FormControl(51),
      lugar: new FormControl('Lugar'),
      nombre: new FormControl('Nombre Curso'),
      videos: new FormControl()
    });
    this.buscarPais = new FormControl('');
    this.buscarTipo = new FormControl('');

    this.formFiltro = new FormGroup({
      pais: new FormControl(),
      tipo: new FormControl()
    });
    this.formFiltro.get('pais').valueChanges.subscribe(data => {
      this.paises = data;
      this.page = 0;
      this.consultarCursos(this.page, this.nRegistros);
    });

    this.formFiltro.get('tipo').valueChanges.subscribe(data => {
      this.tipos = data;
      this.page = 0;
      this.consultarCursos(this.page, this.nRegistros);
    });
    this.consultarPaises();
    this.consultarTipos();
    this.consultarCursos(this.page, this.nRegistros);
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
    if ((window.screen.width <= 600 && this.resolucionAnterior > 600) || (window.screen.width > 600 && this.resolucionAnterior <= 600)) {
      this.ngOnInit();
    }
    this.resolucionAnterior = window.screen.width;
  }

  private registrosPantallaGrande(): void {
    if (window.screen.width <= 600) {
      this.nRegistros = 5;
    } else {
      this.nRegistros = 8;
    }
    this.configGrupos.itemsPerPage = this.nRegistros;
  }


  openDialogCrear(): void {

    const curso: CursosTalleres = new CursosTalleres();
    curso.comentarios = [];
    curso.country = { id: 0 };
    curso.endDate = new Date();
    curso.id = 0;
    curso.name = '';
    curso.place = '';
    curso.recursos = [];
    curso.startDate = new Date();
    curso.state = '';
    curso.type = { id: 0 };
    curso.enlaces = [];
    curso.multimedia = [];


    const dialogRef =
      this.dialog.open(ModalGestionCursosComponent, {
        width: '1112px',
        height: '80%',
        panelClass: 'my-dialog',
        data: { subdom: curso, cod: 1 }
      });
    dialogRef.afterClosed().subscribe(() => {
      this.consultarPaises();
      this.consultarTipos();
      this.consultarCursos(this.page, this.nRegistros);
    });
  }

  mostrar(filtro: string = '', campo: string): boolean {
    if (filtro.length > 0) {
      if (campo.toLowerCase().includes(filtro.toLowerCase())) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }
  consultarFiltroCantidades(paises: Array<number>, tipos: Array<number>): void {
    const url =
      `/cursosTalleres/cantidadesFiltro?&paises=${paises.toString()}&tipos=${tipos.toString()}`;
    this.genericoService.get(url).subscribe(res => {
      if (res.message === '200') {
        this.cantidadPais = res.data.cantidadPais;
        this.cantidadTipo = res.data.cantidadTipo;
      }
    });
  }
  consultarPaises(): void {
    const url = `${Constants.PATH_LISTAR_PAIS_LANG}?pais=0&lang=${this.idioma}`;
    this.genericoService.get(url).subscribe(res => {
      this.paisesList = res.data;
    });
  }
  getCantidadPais(idPais: number): number {
    const filtroCantidad: Array<Cantidades> = this.cantidadPais.filter(c => c.id === idPais);
    if (filtroCantidad.length > 0) {
      return filtroCantidad[0].cantidad;
    }
    return 0;
  }

  getCantidadTipo(idTipo: number): number {
    const filtroCantidad: Array<Cantidades> = this.cantidadTipo.filter(c => c.id === idTipo);
    if (filtroCantidad.length > 0) {
      return filtroCantidad[0].cantidad;
    }
    return 0;
  }
  consultarTipos(): void {
    const url = `${Constants.PATH_LISTAR_DOMINIO_NOMBRE_LANG}?nombre=${Constants.TIPO_CURSO_TALLER}&idioma=${this.idioma}`;
    this.genericoService.get(url).subscribe(res => {
      this.tiposList = res.data.dominio[0].subDominio;
    });
  }

  consultarCursos(page: number, size: number): void {

    this.cursosTalleres = [];
    // this.configGrupos.totalItems = 0;
    const url =
      `/cursosTalleres/listarCursos?page=${page}&paises=${this.paises.toString()}&size=${size}&tipos=${this.tipos.toString()}`;
    this.genericoService.get(url).subscribe(res => {
      if (res.message === '200') {
        this.cursosTalleres = res.data.cursos;
        this.configGrupos.currentPage = this.configGrupos.totalItems === res.data.totalItems ? this.configGrupos.currentPage : 1;
        this.configGrupos.totalItems = this.configGrupos.totalItems !== res.data.totalItems
          ? res.data.totalItems : this.configGrupos.totalItems;
        this.consultarFiltroCantidades(this.paises, this.tipos);
      } else if (res.message === '204') {
        this.toastr.info(this.cursosInfo?.mensajes ? this.cursosInfo.mensajes.MENSAJE_NO_DATA : Constants.MENSAJE_NO_DATA);
      } else {
        this.toastr.error(this.cursosInfo?.mensajes ? this.cursosInfo.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
      }
    },
      error => {
        console.error(error);
        this.toastr.error(this.cursosInfo?.mensajes ? this.cursosInfo.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
      });

  }
  abrirDetalle($event): void {
    this.showDetalle = true;
    this.cursoDetalle = $event;

  }
  pageChanged($event): void {
    this.page = $event;
    this.configGrupos.currentPage = this.page;
    this.consultarCursos(this.page - 1, this.nRegistros);
  }

  getPais(idPais: number): string {
    const pais = this.paisesList.filter(p => p.id === idPais);
    return pais[0].nombre;
  }
  getTipo(idTipo: number): string {
    const tipo = this.tiposList.filter(p => p.id === idTipo);
    return tipo[0].description;
  }

  removePais(idPais): void {
    const index = this.paises.findIndex(x => x === idPais);
    this.paises.splice(index);
    this.formFiltro.get('pais').setValue(this.paises);
  }
  removeTipo(idTipo): void {
    const index = this.tipos.findIndex(x => x === idTipo);
    this.tipos.splice(index);
    this.formFiltro.get('tipo').setValue(this.tipos);
  }
  optionPais(idPais: number, option: MatOption): string {
    if (this.paises.some(p => p === idPais)) {
      return 'option-selected';
    } else {
      option.deselect();
      return '';
    }
  }
  optionTipo(idTipo: number, option: MatOption): string {
    if (this.tipos.some(t => t === idTipo)) {
      return 'option-selected';
    } else {
      option.deselect();
      return '';
    }
  }
  limpiarFiltro(): void {
    this.formFiltro.get('pais').setValue([]);
    this.formFiltro.get('tipo').setValue([]);
    this.paises = [];
    this.tipos = [];
  }

  getDescripcionPais(pais: any): string {
    try {
      return this.paisesService.listadoPaises.find(item => item.id === pais.id).nombre.trim();
    } catch {
      return pais.nombre.trim();
    }
  }


}
