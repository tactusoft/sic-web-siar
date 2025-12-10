import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {GenericoService} from '../../servicios/generico.service';
import {PaginationInstance} from 'ngx-pagination';
import {Pais} from '../../modelos/pais';
import {MatOption} from '@angular/material/core/option';
import {Cantidades} from '../../modelos/cantidades';
import {MatDialog} from '@angular/material/dialog';

import {Dominio} from '../../modelos/dominio';
import {Subdominio} from '../../modelos/Subdominio';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {Constants} from '../../common/constants';
import {LenguajeService} from '../../servicios/lenguaje.service';
import {PaisesService} from 'src/app/servicios/paises.service';
import {DialogEliminarDirectorioComponent} from './dialog-eliminar-directorio/dialog-eliminar-directorio.component';
import {DialogNuevoDirectorioComponent} from './dialog-nuevo-directorio/dialog-nuevo-directorio.component';
import {Directorio} from '../../modelos/directorio';
import {Router} from '@angular/router';


@Component({
  selector: 'app-gestion-directorios',
  templateUrl: './gestion-directorios.component.html',
  styleUrls: ['./gestion-directorios.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GestionDirectoriosComponent implements OnInit {
  paisesListIdioma: any = [];
  panelOpenState = false;
  administrar = false;
  today = Date.now;
  registrosEncontrados = 0;
  buscarEstado: FormControl;
  cantidadPais: Array<Cantidades> = [];
  nRegistros = 20;
  page = 0;
  directorios: Array<Directorio>;
  pais = 0;
  idCategoria = 0;
  estados = [];
  resolucionAnterior = window.screen.width;
  textos: any = null;
  idioma: number;

  // Filtro
  formFiltroEventos: FormGroup;
  paisesList: Array<Pais> = [];
  categoriasList: Array<Dominio> = [];
  categorias: Array<Subdominio> = [];
  paisFiltro = 0;
  estadoFiltro = 0;
  filtroPais = new FormControl('');
  filteredPais: Observable<Pais[]>;
  paisesList2: Pais[] = [];
  paisSeleted: Array<Pais> = [];
  eventosCargados = false;

  consultar = true;

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
  ) {
  }

  ngOnInit(): void {

    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      this.idioma = this.lenguajeService.devolverIntIdioma(data);

      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
          this.textos = texts;
        },
        () => {
          this.toast.error(this.textos?.mensajes ? this.textos?.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
    this.consultar = this.router.url === 'consultarDirectorios';
    this.administrar = !!(localStorage.getItem('usuario') && localStorage.getItem('token') && (this.router.url === '/gestionDirectorios'));
    this.buscarEstado = new FormControl('');
    this.registrosPantallaGrande();
    this.getDirectorios(this.pais, this.page, this.idCategoria, this.nRegistros);
    this.consultarPaises();
    this.consultarCategorias();
    this.construirFiltros();
    this.paisesService.listaPaises.subscribe(cambio => {
      if (cambio) {
        this.paisesListIdioma = this.paisesService.listadoPaises;
        this.consultarCategorias();
      }
    });
    this.paisesListIdioma = this.paisesService.listadoPaises;
  }

  private registrosPantallaGrande(): void {

    this.nRegistros = 20;

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
      this.getDirectorios(this.paisFiltro, 0, this.estadoFiltro, this.nRegistros);
    });

    this.formFiltroEventos.get('estado').valueChanges.subscribe(data => {
      this.estados = [data];
      this.estadoFiltro = data;
      this.page = 0;
      this.getDirectorios(this.paisFiltro, this.page, this.estadoFiltro, this.nRegistros);
    });
  }

  openDialogNuevo(): void {
    const dialogRef = this.dialog.open(DialogNuevoDirectorioComponent, {
      data: {
        directorio: null,
        titulo: 'Agregar nuevo directorio',
        paises: this.paisesList,
        categorias: this.categorias
      },
      width: '80%'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.toast.success(this.textos?.gestion_dir ? this.textos?.gestion_dir.msjGuardado : Constants.MENSAJE_TX_OK);
        this.getDirectorios(this.pais, this.page, this.idCategoria, this.nRegistros);
      }
    });
  }

  openDialogEditar(directorio: Directorio): void {
    const dialogRef = this.dialog.open(DialogNuevoDirectorioComponent, {
      data: {
        directorio,
        titulo: '',
        paises: this.paisesList,
        categorias: this.categorias
      },
      width: '75%'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.toast.success(this.textos?.gestion_dir ? this.textos?.gestion_dir.msjEditado : Constants.MENSAJE_TX_OK);
        this.getDirectorios(this.pais, this.page, this.idCategoria, this.nRegistros);
      }
    });
  }

  openDialogEliminar(directorio: Directorio): void {
    const dialogRef = this.dialog.open(DialogEliminarDirectorioComponent, {
      data: {
        directorio
      },
      width: '50%'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.toast.success(this.textos?.gestion_dir ? this.textos?.gestion_dir.msjEliminado : Constants.MENSAJE_TX_OK);
        this.getDirectorios(this.pais, this.page, this.idCategoria, this.nRegistros);
      }
    });
  }

  getDirectorios(pais: number, pagina: number, idDirectorio: number, registros: number): void {
    this.eventosCargados = true;
    const url = `${Constants.PATH_GET_DIRECTORIOS}?pais=${pais}&page=${pagina}&idCategoria=${idDirectorio}&size=${registros}`;
    this.genericoService.get(url).subscribe(res => {

      this.directorios = [];
      this.registrosEncontrados = 0;
      this.configGrupos.currentPage = 1;
      this.configGrupos.totalItems = 0;

      if (res.message === '200' && res.data !== null) {
        this.directorios = res.data.directorios;
        this.registrosEncontrados = res.data.totalItems;
        this.configGrupos.currentPage = res.data.currentPage + 1;
        this.configGrupos.totalItems = res.data.totalItems;
      }

    });
  }

  pageChanged($event): void {
    this.page = $event;
    this.getDirectorios(this.pais, this.page - 1, this.idCategoria, this.nRegistros);
  }

  optionCategoria(idCategoria: number, option: MatOption): string {
    if (this.categorias.some(p => p.id === idCategoria)) {
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
    const url = `${Constants.PATH_LISTAR_DOMINIO_NOMBRE_LANG}?nombre=Categoría directorio&idioma=${this.idioma}`;
    this.genericoService.get(url).subscribe(res => {
      this.categoriasList = res.data.dominio;
      this.categorias = this.categoriasList[0].subDominio
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
