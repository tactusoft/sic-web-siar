import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Noticia } from '../../modelos/noticia';
import { FiltroMes } from '../../modelos/filtro-mes';
import { FiltroPais } from '../../modelos/filtro-pais';
import { FiltroAno } from '../../modelos/filtro-ano';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { GenericoService } from '../../servicios/generico.service';
import { Constants } from '../../common/constants';
import { Utils } from '../../common/utils';
import { PaginationInstance } from 'ngx-pagination';
import { MatOption } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DialogNuevaNoticiaComponent } from './dialog-nueva-noticia/dialog-nueva-noticia.component';
import { DialogEliminarNoticiaComponent } from './dialog-eliminar-noticia/dialog-eliminar-noticia.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CabeceraService } from '../../servicios/cabecera.service';
import { LenguajeService } from '../../servicios/lenguaje.service';
import { PaisesService } from 'src/app/servicios/paises.service';


@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NoticiasComponent implements OnInit {
  noticiasInfo: any = null;
  paisesListIdioma: any = [];
  administrar = false;
  registrosEncontrados = 0;
  panelOpenState = false;
  mostrarFiltro = false;
  nRegistros = 12;
  page = 0;
  formFiltroNoticias: FormGroup;
  public configPaginador: PaginationInstance = {
    id: 'custom',
    itemsPerPage: this.nRegistros,
    currentPage: 0,
    totalItems: 0
  };
  meses = Constants.MESES;

  filtroMes = new FormControl();
  filtroAno = new FormControl();
  filtroPais = new FormControl();

  filteredPais: Observable<FiltroPais[]>;
  filteredMeses: Observable<FiltroMes[]>;
  filteredAno: Observable<FiltroAno[]>;

  paisesList: FiltroPais[] = [];
  mesList: FiltroMes[] = [];
  anoList: FiltroAno[] = [];

  paisSeleted: Array<FiltroPais> = [];
  anoSeleted: Array<FiltroAno> = [];
  mesSeleted: Array<FiltroMes> = [];

  noticias: Array<Noticia>;
  idTipoSeccion = 0;

  resolucionAnterior;

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.obtenerResolucionPantalla();
  }

  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(): void {
    this.obtenerResolucionPantalla();
  }

  constructor(private genericoService: GenericoService,
              private toast: ToastrService,
              private utils: Utils,
              public dialog: MatDialog,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private cabeceraService: CabeceraService,
              private lenguajeService: LenguajeService,
              private paisesService: PaisesService,
  ) { }

  ngOnInit(): void {
    this.registrosPantallaGrande();
    this.cabeceraService.closeMenu.emit(true);
    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
        this.noticiasInfo = texts;
      },
        () => {
          this.toast.error(this.noticiasInfo?.mensajes ? this.noticiasInfo?.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });

    this.idTipoSeccion = this.activatedRoute.snapshot.params.id;
    this.administrar = !!(localStorage.getItem('usuario') && localStorage.getItem('token') && (this.router.url === '/gestionNoticias'));
    this.getNoticias([], [], [], 0, this.nRegistros);
    this.getFiltro([], [], []);
    this.formFiltroNoticias = new FormGroup({
      pais: new FormControl(),
      ano: new FormControl(),
      mes: new FormControl()
    });
    this.formFiltroNoticias.get('pais').valueChanges.subscribe(data => {
      this.paisSeleted = data;
      this.mostrarFiltroNoticias();
      this.configPaginador.currentPage = 0;
      this.getNoticias(this.paisSeleted, this.anoSeleted, this.mesSeleted, 0, this.nRegistros);
    });
    this.formFiltroNoticias.get('ano').valueChanges.subscribe(data => {
      this.anoSeleted = data;
      this.mostrarFiltroNoticias();
      this.configPaginador.currentPage = 0;
      this.getNoticias(this.paisSeleted, this.anoSeleted, this.mesSeleted, 0, this.nRegistros);
    });
    this.formFiltroNoticias.get('mes').valueChanges.subscribe(data => {
      this.mesSeleted = data;
      this.mostrarFiltroNoticias();
      this.configPaginador.currentPage = 0;
      this.getNoticias(this.paisSeleted, this.anoSeleted, this.mesSeleted, 0, this.nRegistros);
    });
    this.paisesService.listaPaises.subscribe(cambio => {
      if (cambio){
        this.paisesListIdioma = this.paisesService.listadoPaises;
      }
    });
    this.paisesListIdioma = this.paisesService.listadoPaises;
  }
  private _filterMes(value: string): FiltroMes[] {
    const filterValue = this._normalizeValue(value);
    return this.mesList.filter(mes =>
      this._normalizeValue(mes.descripcion).includes(filterValue)
    );
  }
  private _filterAno(value: string): FiltroAno[] {
    const filterValue = this._normalizeValue(value);
    return this.anoList.filter(ano =>
      this._normalizeValue(ano.descripcion).includes(filterValue)
    );
  }
  private _filterPais(value: string): FiltroPais[] {
    const filterValue = this._normalizeValue(value);
    return this.paisesList.filter(pais =>
      this._normalizeValue(pais.descripcion).includes(filterValue)
    );
  }

  private _normalizeValue(value: string): string {
    value = value.toString();
    return value.toLowerCase().replace(/\s/g, '');
  }

  getNoticias(pais: Array<FiltroPais>, ano: Array<FiltroAno>, mes: Array<FiltroMes>, pagina: number, registros: number): void {
    const paises = pais.map(p => p.id);
    const anos = ano.map(p => p.descripcion);
    const meses = mes.map(p => p.descripcion);
    this.noticias = [];
    const url = `/noticias/listarNoticias?pais=${paises.toString()}&ano=${anos.toString()}&mes=${meses.toString()}&pagina=${pagina}&nRegistros=${registros}`;
    this.genericoService.get(url).subscribe(
      res => {
        if (res.message === '200') {
          this.noticias = res.data.noticias;
          this.noticias.sort((a, b) => b.fecha < a.fecha ? -1 : b.fecha > a.fecha ? 1 : 0);
          this.registrosEncontrados = res.data.totalItems;
          this.configPaginador.totalItems = this.registrosEncontrados;
        } else if (res.message === 'No se encontraron noticias') {
          this.noticias = [];
          this.registrosEncontrados = 0;
          this.configPaginador.totalItems = 0;
        } else {
          console.error(res.menssage);
        }
      },
      error => {
        console.error(error);
        const msj = this.noticiasInfo?.mensajes ? this.noticiasInfo?.mensajes?.MENSAJE_ERROR : Constants.MENSAJE_ERROR;
        this.toast.error(msj, '¡Error', {
          closeButton: true,
          titleClass: 'toast-tittle-error'
        });
      }
    );
  }

  removePais(item: FiltroPais): void {
    this.paisSeleted = this.paisSeleted.filter(fp => fp.id !== item.id);
    this.formFiltroNoticias.get('pais').setValue(this.paisSeleted);
  }
  removeAno(item: FiltroAno): void {
    const idx = this.anoSeleted.findIndex(
      a => a.descripcion === item.descripcion
    );
    this.anoSeleted.splice(idx);
    this.formFiltroNoticias.get('ano').setValue(this.anoSeleted);
  }
  removeMes(item: FiltroMes): void {
    const idx = this.mesSeleted.findIndex(
      m => m.descripcion === item.descripcion
    );
    this.mesSeleted.splice(idx);
    this.formFiltroNoticias.get('mes').setValue(this.mesSeleted);
  }

  optionPais(pais: FiltroPais, option: MatOption): string {
    if (this.paisSeleted.some(p => p.id === pais.id)) {
      return 'option-selected';
    }
    option.deselect();
    return '';
  }
  optionAno(ano: FiltroAno, option: MatOption): string {
    if (this.anoSeleted.some(a => a.descripcion === ano.descripcion)) {
      return 'option-selected';
    } else {
      option.deselect();
      return '';
    }
  }
  optionMes(mes: FiltroMes, option: MatOption): string {
    if (this.mesSeleted.some(m => m.descripcion === mes.descripcion)) {
      return 'option-selected';
    } else {
      option.deselect();
      return '';
    }
  }

  getFiltro(
    pais: Array<FiltroPais>,
    ano: Array<FiltroAno>,
    mes: Array<FiltroMes>
  ): void {
    const paises = pais.map(p => p.id);
    const anos = ano.map(a => a.descripcion);
    const meses = mes.map(m => m.descripcion);
    const url = `/noticias/filtro?pais=${paises.toString()}&ano=${anos.toString()}&mes=${meses.toString()}`;
    this.genericoService.get(url).subscribe(res => {
      if (res.message === '200') {
        this.paisesList = res.data.paises;
        this.paisesList.sort((a, b) => b.descripcion < a.descripcion ? 1 : b.descripcion > a.descripcion ? -1 : 0);
        this.anoList = res.data.anos;
        this.anoList.sort((a, b) => b.id > a.id ? 1 : b.id < a.id ? -1 : 0);
        this.mesList = res.data.meses;
        this.mesList.sort((a, b) => b.id < a.id ? 1 : b.id > a.id ? -1 : 0);
      }
      this.prepararFiltro();
    });
  }

  prepararFiltro(): void {
    this.filteredMeses = this.filtroMes.valueChanges.pipe(
      startWith(''),
      map(value => this._filterMes(value))
    );

    this.filteredAno = this.filtroAno.valueChanges.pipe(
      startWith(''),
      map(value => this._filterAno(value))
    );

    this.filteredPais = this.filtroPais.valueChanges.pipe(
      startWith(''),
      map(value => this._filterPais(value))
    );
  }

  limpiarFiltro(): void {
    this.mesSeleted = [];
    this.paisSeleted = [];
    this.anoSeleted = [];
    this.formFiltroNoticias.get('pais').setValue(this.paisSeleted);
    this.formFiltroNoticias.get('ano').setValue(this.anoSeleted);
    this.formFiltroNoticias.get('mes').setValue(this.mesSeleted);
    this.configPaginador.currentPage = 1;
    this.mostrarFiltro = false;
    this.getFiltro([], [], []);
  }
  pageChanged($event): void {
    this.configPaginador.currentPage = $event;
    this.page = $event;
    this.getNoticias(
      this.paisSeleted,
      this.anoSeleted,
      this.mesSeleted,
      this.page - 1,
      this.nRegistros
    );
  }

  getMes(idMes: number): string {
    const mes = this.utils.getMes(idMes);
    try {
      if (this.noticiasInfo?.generales) {
        return this.noticiasInfo.generales[mes[0].mes.trim()];
      } else {
        return mes[0].mes;
      }
    } catch {
      return mes[0].mes;
    }
  }

  getDescripcionPais(pais: any): string {
    try {
      return this.paisesListIdioma.find(item => item.id === pais.id).nombre.trim();
    } catch {
      return pais.descripcion.trim();
    }
  }

  mostrarFiltroNoticias(): any {
    if (
      this.anoSeleted.length === 0 &&
      this.mesSeleted.length === 0 &&
      this.paisSeleted.length === 0
    ) {
      this.mostrarFiltro = false;
    } else {
      this.mostrarFiltro = true;
    }
  }

  openDialogNuevo(): void {
    const dialogRef = this.dialog.open(DialogNuevaNoticiaComponent, {
      data: {
        noticia: null,
        titulo: this.noticiasInfo?.generales ? this.noticiasInfo?.mensajes?.agregar_item : 'Agregar nuevo ítem'
      },
      width: '80%'
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.toast.success(this.noticiasInfo?.mensajes ? this.noticiasInfo?.mensajes?.NOTICIA_GUARDADA_MSJ : 'Noticia guardada correctamente');
        this.getNoticias(
          this.paisSeleted,
          this.anoSeleted,
          this.anoSeleted,
          this.page,
          this.nRegistros
        );
      }
    });
  }

  showEditar(noticia): void {
    this.openDialogEditar(noticia);
  }

  showEliminar(noticia): void {
    this.openDialogEliminar(noticia);
  }

  mostrarOpciones(): boolean {
    if (this.administrar) {
      return true;
    } else {
      return false;
    }
  }

  openDialogEditar(noticia: Noticia): void {
    const dialogRef = this.dialog.open(DialogNuevaNoticiaComponent, {
      data: {
        noticia,
        titulo: this.noticiasInfo?.mensajes ? this.noticiasInfo?.mensajes?.NOTICIA_EDICION : 'Edición de noticia'
      },
      width: '80%'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.toast.success(this.noticiasInfo?.mensajes
          ? this.noticiasInfo?.mensajes?.NOTICIA_EDITADA_MSJ : 'Noticia editada correctamente');
        this.getNoticias(
          this.paisSeleted,
          this.anoSeleted,
          this.anoSeleted,
          this.page,
          this.nRegistros
        );
      }
    });
  }

  openDialogEliminar(noticia: Noticia): void {
    const dialogRef = this.dialog.open(DialogEliminarNoticiaComponent, {
      data: {
        noticia
      },
      width: '80%'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.toast.success(this.noticiasInfo?.mensajes ? this.noticiasInfo?.mensajes?.NOTICIA_ELIMINADA_MSJ : 'Noticia eliminada correctamente');
        this.getNoticias(this.paisSeleted, this.anoSeleted, this.anoSeleted, this.page, this.nRegistros);
      }
    });
  }

  private obtenerResolucionPantalla(): void {
    if ((window.screen.width <= 800 && this.resolucionAnterior > 800) ||
      (window.screen.width > 800 && this.resolucionAnterior <= 800)) {
      this.ngOnInit();
    }
    this.resolucionAnterior = window.screen.width;
  }

  private registrosPantallaGrande(): void {
    if (window.screen.width <= 800) {
      this.nRegistros = 8;
    } else {
      this.nRegistros = 12;
    }
    this.configPaginador.itemsPerPage = this.nRegistros;
  }
}
