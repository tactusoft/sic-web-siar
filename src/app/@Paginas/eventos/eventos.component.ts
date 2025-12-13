import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Evento } from '../../modelos/evento';
import { GenericoService } from '../../servicios/generico.service';
import { PaginationInstance } from 'ngx-pagination';
import { Pais } from '../../modelos/pais';
import { MatOption } from '@angular/material/core/option';
import { Cantidades } from '../../modelos/cantidades';
import { MatDialog } from '@angular/material/dialog';
import { EliminarEventoDialogComponent } from './eliminar-evento-dialog/eliminar-evento-dialog.component';
import { DialogNuevoEventoComponent } from './dialog-nuevo-evento/dialog-nuevo-evento.component';
import { Dominio } from '../../modelos/dominio';
import { Subdominio } from '../../modelos/Subdominio';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Constants } from '../../common/constants';
import {LenguajeService} from '../../servicios/lenguaje.service';
import { PaisesService } from 'src/app/servicios/paises.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EventosComponent implements OnInit {
  paisesListIdioma: any = [];
  panelOpenState = false;
  administrar = false;
  today = Date.now;
  registrosEncontrados = 0;
  buscarEstado: FormControl;
  cantidadPais: Array<Cantidades> = [];
  nRegistros = 20;
  page = 0;
  eventos: Array<Evento>;
  pais = 0;
  idEvento = 0;
  estados = [];
  resolucionAnterior = window.screen.width;
  textos: any = null;
  idioma: number;

  // Filtro
  formFiltroEventos: FormGroup;
  paisesList: Array<Pais> = [];
  categoriasList: Array<Dominio> = [];
  categoria: Array<Subdominio> = [];
  paisFiltro = 0;
  estadoFiltro = 0;
  filtroPais = new FormControl('');
  filteredPais: Observable<Pais[]>;
  paisesList2: Pais[] = [];
  paisSeleted: Array<Pais> = [];
  eventosCargados = false;

  estadosList = [
    {
      id: 0,
      descripcion: 'Todos'
    },
    {
      id: 1,
      descripcion: 'Pasados'
    },
    {
      id: 2,
      descripcion: 'Próximos'
    }
  ];

  public configGrupos: PaginationInstance = {
    id: 'custom',
    itemsPerPage: this.nRegistros,
    currentPage: 0,
    totalItems: 0
  };

  constructor(private genericoService: GenericoService,
              public dialog: MatDialog,
              private lenguajeService: LenguajeService,
              private paisesService: PaisesService,
              private router: Router,
              private toast: ToastrService
              ) { }

  ngOnInit(): void {

    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      this.idioma = this.lenguajeService.devolverIntIdioma(data);

      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
          this.textos = texts;

          this.estadosList[0].descripcion = texts.eventos.estados.todos;
          this.estadosList[1].descripcion = texts.eventos.estados.pasados;
          this.estadosList[2].descripcion = texts.eventos.estados.proximos;
        },
        () => {
          this.toast.error(this.textos?.mensajes ? this.textos?.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
    this.administrar = !!(localStorage.getItem('usuario') && localStorage.getItem('token') && (this.router.url === '/gestionEventos'));
    this.buscarEstado = new FormControl('');
    this.registrosPantallaGrande();
    this.getEventos(this.pais, this.page, this.idEvento, this.nRegistros);
    this.consultarPaises();
    this.consultarCategorias();
    this.construirFiltros();
    this.paisesService.listaPaises.subscribe(cambio => {
      if (cambio){
        this.paisesListIdioma = this.paisesService.listadoPaises;
        this.consultarCategorias();
      }
    });
    this.paisesListIdioma = this.paisesService.listadoPaises;
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
    || (window.screen.width < 1200 && this.resolucionAnterior >= 1200) || (window.screen.width >= 1200 && this.resolucionAnterior < 1200)) {
      this.ngOnInit();
    }
    this.resolucionAnterior = window.screen.width;
  }

  private registrosPantallaGrande(): void {
    if (window.screen.width <= 991) {
      this.nRegistros = 8;
    } else if (window.screen.width < 1200){
      this.nRegistros = 15;
    } else {
      this.nRegistros = 20;
    }
    this.configGrupos.itemsPerPage = this.nRegistros;
  }

  construirFiltros(): void {
    this.formFiltroEventos = new FormGroup({
      pais: new FormControl(),
      estado: new FormControl(),
    });
    this.formFiltroEventos.get('pais').valueChanges.subscribe(data => {
      this.paisSeleted = [data];
      this.paisFiltro = data.id;
      this.configGrupos.currentPage = 0;
      this.getEventos(this.paisFiltro, 0, this.estadoFiltro, this.nRegistros);
    });

    this.formFiltroEventos.get('estado').valueChanges.subscribe(data => {
      this.estados = [data];
      this.estadoFiltro = data;
      this.page = 0;
      this.getEventos(this.paisFiltro, this.page, this.estadoFiltro, this.nRegistros);
    });
  }

  openDialogEliminar(evento: Evento): void {
    const dialogRef = this.dialog.open(EliminarEventoDialogComponent, {
      data: {
        evento
      },
      width: '80%'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.toast.success(this.textos?.mensajes ? this.textos?.mensajes.EVENTO_ELIMINADO_MSJ : 'Evento eliminado correctamente');
        this.getEventos(this.pais, this.page, this.idEvento, this.nRegistros);
      }
    });
  }

  openDialogNuevo(): void {
    const dialogRef = this.dialog.open(DialogNuevoEventoComponent, {
      data: {
        evento: null,
        titulo: 'Agregar nuevo item',
        paises: this.paisesList,
        categorias: this.categoria
      },
      width: '80%'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.toast.success(this.textos?.mensajes ? this.textos?.mensajes.EVENTO_GUARDADO_MSJ : 'Evento guardado correctamente');
        this.getEventos(this.pais, this.page, this.idEvento, this.nRegistros);
      }
    });
  }

  openDialogEditar(evento: Evento): void {
    const dialogRef = this.dialog.open(DialogNuevoEventoComponent, {
      data: {
        evento,
        titulo: this.textos?.mensajes ? this.textos?.mensajes.EDICION_EVENTO_MSJ : 'Edición evento',
        paises: this.paisesList,
        categorias: this.categoria
      },
      width: '80%'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.toast.success(this.textos?.mensajes ? this.textos?.mensajes.EVENTO_EDITADO_MSJ : 'Evento editado correctamente');
        this.getEventos(this.pais, this.page, this.idEvento, this.nRegistros);
      }
    });
  }
  getCantidad(): void {
    this.genericoService.get('/evento/cantidadEvento')
      .subscribe(res => {
        this.cantidadPais = res.data.cantidadPais;
      });
  }
  getEventos(pais: number, pagina: number, idEvento: number, registros: number): void {
    this.eventosCargados = true;
    const url = `/evento/listarEvento?pais=${pais}&page=${pagina}&event=${idEvento}&size=${registros}&start=&end=`;
    this.genericoService.get(url).subscribe(res => {
      if (res.message === '200') {
        if (res.data !== null) {
          this.eventos = res.data.evento;
          this.eventos.sort((a, b) => b.creationDate
            ? b.creationDate < a.creationDate ? -1 : b.creationDate > a.creationDate ? 1 : 0
            : 0);
          this.registrosEncontrados = res.data.totalItems;
          this.configGrupos.currentPage = res.data.currentPage + 1;
          this.configGrupos.totalItems = res.data.totalItems;
          this.getCantidad();
        } else {
          this.eventos = [];
          this.registrosEncontrados = 0;
          this.configGrupos.currentPage = 1;
          this.configGrupos.totalItems = 0;
        }
      } else {
        this.eventos = [];
        this.registrosEncontrados = 0;
        this.configGrupos.currentPage = 1;
        this.configGrupos.totalItems = 0;
      }
    });
  }
  getCantidadPais(idPais: number): number {
    const filtroCantidad: Array<Cantidades> = this.cantidadPais.filter(c => c.id === idPais);
    if (filtroCantidad.length > 0) {
      return filtroCantidad[0].cantidad;
    }
    return 0;
  }

  limpiarFiltro(): void { }

  pageChanged($event): void {
    this.page = $event;
    this.getEventos(this.pais, this.page - 1, this.idEvento, this.nRegistros);
  }

  optionEstado(idEstado: number, option: MatOption): string {
    if (this.estados.some(p => p === idEstado)) {
      return 'option-selected';
    } else {
      option.deselect();
      return '';
    }
  }
  consultarPaises(): void {
    const url = `${Constants.PATH_LISTAR_PAIS_LANG}?pais=0&lang=${this.idioma}`;
    this.genericoService.get(url).subscribe(res => {
      this.paisesList = res.data;
      this.paisesList.sort((a, b) => b.nombre < a.nombre ? 1 : b.nombre > a.nombre ? -1 : 0);
      this.paisesList2 = this.paisesList;
      this.prepararFiltro();
    });
  }
  consultarCategorias(): void {
    const url = `${Constants.PATH_LISTAR_DOMINIO_NOMBRE_LANG}?nombre=Categoria Eventos&idioma=${this.idioma}`;
    this.genericoService.get(url).subscribe(res => {
      this.categoriasList = res.data.dominio;
      this.categoria = this.categoriasList[0].subDominio
        .sort((a, b) => b.description > a.description ? -1 : b.description > a.description ? 1 : 0);
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

  showEditar(evento): void {
    this.openDialogEditar(evento);
  }
  showEliminar(evento): void {
    this.openDialogEliminar(evento);
  }

  prepararFiltro(): void {
    this.filteredPais = this.filtroPais.valueChanges.pipe(
      startWith(''),
      map(value => this._filterPais(value))
    );
  }

  private _filterPais(value: string): Pais[] {
    const filterValue = this._normalizeValue(value);
    return this.paisesList2.filter(pais => this._normalizeValue(pais.nombre).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    value = value.toString();
    return value.toLowerCase().replace(/\s/g, '');
  }

  optionPais(pais: Pais, option: MatOption): string {
    if (this.paisSeleted.some(p => p.id === pais.id)) {
      return 'option-selected';
    }
    option.deselect();
    return '';
  }

  getDescripcionPais(pais: any): string {
    try {
      return this.paisesListIdioma.find(item => item.id === pais.id).nombre.trim();
    } catch {
      return pais.nombre.trim();
    }
  }

}
