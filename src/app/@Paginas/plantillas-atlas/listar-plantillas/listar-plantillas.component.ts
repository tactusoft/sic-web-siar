import {Component, OnInit} from '@angular/core';
import {Pais} from '../../../modelos/pais';
import {PaginationInstance} from 'ngx-pagination';
import {FormControl, FormGroup} from '@angular/forms';
import {LenguajeService} from '../../../servicios/lenguaje.service';
import {PaisesService} from '../../../servicios/paises.service';
import {ToastrService} from 'ngx-toastr';
import {Constants} from '../../../common/constants';
import {SubdomainDTO} from '../../../clases/subdomainDTO';
import {AtlasPlantilla} from '../../../modelos/atlasPlantilla';
import {Atlas} from '../../../modelos/atlas';
import {AtlasService} from '../../../servicios/atlas/atlas.service';
import {MatDialog} from '@angular/material/dialog';
import {CrearPlantillaComponent} from '../crear-plantilla/crear-plantilla.component';
import {EliminarPlantillaComponent} from '../eliminar-plantilla/eliminar-plantilla.component';

@Component({
  selector: 'app-listar-plantillas',
  templateUrl: './listar-plantillas.component.html',
  styleUrls: ['./listar-plantillas.component.scss']
})
export class ListarPlantillasComponent implements OnInit {

  page = 0;
  nRegistros = 20;
  public configPaginador: PaginationInstance = {
    id: 'custom',
    itemsPerPage: this.nRegistros,
    currentPage: this.page,
    totalItems: 0
  };

  buscarPais: FormControl;
  paisesList: Array<Pais> = [];
  paisesListIdioma: any = [];
  formFiltro: FormGroup;
  textos: any;
  idioma: number;
  filtro = '';

  plantillasOrdenadas: Array<AtlasPlantilla>;
  plantillas: Array<AtlasPlantilla>;
  plantillasById: Map<number, AtlasPlantilla>;
  atlas: Array<Atlas>;
  submit = false;
  mapIds: Map<number, number>;
  subdominios: Array<SubdomainDTO> = [];
  subdominiosById: Map<number, SubdomainDTO>;

  constructor(
    public dialog: MatDialog,
    private paisesService: PaisesService,
    private atlasService: AtlasService,
    private lenguajeService: LenguajeService,
    private toastrService: ToastrService
  ) {
  }

  ngOnInit(): void {

    this.lenguajeService.idiomaSubject.subscribe(data => {
      this.idioma = this.lenguajeService.devolverIntIdioma(data);
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
          this.textos = texts;
        },
        () => {
          this.toastrService.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });

      this.consultarSubdominios();

    });

    this.paisesService.listaPaises.subscribe(cambio => {
      if (cambio) {
        this.paisesListIdioma = this.paisesService.listadoPaises;
      }
    });
    this.paisesListIdioma = this.paisesService.listadoPaises;

    this.consultarPlantillas();

  }

  pageChanged($event): void {
    this.page = $event;
    this.configPaginador.currentPage = $event;
  }

  agregarPlantillaHijos(atlasPlantilla: AtlasPlantilla): void {

    this.plantillasOrdenadas.push(atlasPlantilla);
    const plantillasHijas = this.plantillas.filter(f => f.idPadre === atlasPlantilla.id);
    plantillasHijas.forEach((p) => {
      this.agregarPlantillaHijos(p);
    });

  }

  consultarSubdominios(): void {

    this.atlasService.consultarSubdominios(this.idioma).subscribe(res => {

      this.subdominios = [];

      if (res.message === '200') {
        this.subdominios = res.data.dominio[0].subDominio;

        this.subdominiosById = new Map<number, SubdomainDTO>();
        this.subdominios.forEach(value => {
          this.subdominiosById.set(value.id, value);
        });

        if (this.plantillasOrdenadas) {
          this.plantillasOrdenadas.forEach(p => p.subdominio.description = this.subdominiosById.get(p.subdominio.id).description);
        }
      }

    });

  }

  consultarPlantillas(): void {

    this.atlasService.consultarPlantillas(null).subscribe(res => {

      this.plantillas = [];
      this.plantillasOrdenadas = [];
      this.plantillasById = new Map<number, AtlasPlantilla>();

      if (res.message === '200' && res.data !== null) {
        this.plantillas = res.data.plantillas;
        this.plantillas.forEach(value => {
          this.plantillasById.set(value.id, value);
        });
      }

      const plantillasPadres = this.plantillas.filter(f => f.idPadre === null);

      plantillasPadres.forEach((value) => {
        this.agregarPlantillaHijos(value);
      });

    });

    this.consultarSubdominios();

  }

  getLabelTemplateLang(idSubdomain: number): string {

    if (this.subdominiosById.has(idSubdomain)) {
      return this.subdominiosById.get(idSubdomain).description;
    }

    return '';

  }

  openDialogCrear(): void {
    const dialogRef = this.dialog.open(CrearPlantillaComponent, {
      data: {
        plantillasById: this.plantillasById,
        plantillasOrdenadas: this.plantillasOrdenadas,
        plantilla: null,
        subdominiosById: this.subdominiosById
      },
      maxWidth: '1132px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.consultarPlantillas();
      }
    });
  }

  openDialogEditar(aPlantilla: AtlasPlantilla): void {

    const dialogRef = this.dialog.open(CrearPlantillaComponent, {
      data: {
        plantillasById: this.plantillasById,
        plantillasOrdenadas: this.plantillasOrdenadas,
        plantilla: aPlantilla,
        subdominiosById: this.subdominiosById
      },
      maxWidth: '1132px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.consultarPlantillas();
      }
    });
  }

  openDialogEliminar(aPlantilla: AtlasPlantilla): void {

    aPlantilla.subdominio.description = this.getLabelTemplateLang(aPlantilla.subdominio.id);

    const dialogRef = this.dialog.open(EliminarPlantillaComponent, {
      data: {
        plantilla: aPlantilla
      },
      maxWidth: '1132px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.consultarPlantillas();
      }
    });
  }


}
