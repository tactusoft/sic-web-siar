import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Constants} from '../../../common/constants';
import {Pais} from '../../../modelos/pais';
import {Rol} from '../../../modelos/rol';
import {LenguajeService} from '../../../servicios/lenguaje.service';
import {ToastrService} from 'ngx-toastr';
import {AtlasPlantilla} from '../../../modelos/atlasPlantilla';
import {Atlas} from '../../../modelos/atlas';
import {PaisesService} from '../../../servicios/paises.service';
import {SubdomainDTO} from '../../../clases/subdomainDTO';
import {AtlasService} from '../../../servicios/atlas/atlas.service';
import {concatMap} from 'rxjs/operators';
import {Usuario} from '../../../modelos/usuario';
import {GenericoService} from '../../../servicios/generico.service';

@Component({
  selector: 'app-generar-formulario-atlas',
  templateUrl: './generar-formulario-atlas.component.html',
  styleUrls: ['./generar-formulario-atlas.component.scss']
})
export class GenerarFormularioAtlasComponent implements OnInit {

  @Input() idPais1: number;
  @Input() idPais2: number;
  @Input() readOnly: boolean;
  @Input() titulo: string;

  formRegistro: FormGroup;
  paises: Array<Pais>;
  roles: Array<Rol>;
  buscarPais: FormControl;
  buscarRol: FormControl;
  formFiltro: FormGroup;
  atlasPlantillas: Array<AtlasPlantilla>;
  plantillas: Array<AtlasPlantilla>;
  respuestasPorIdPlantilla: Map<number, string>;
  respuestasPorIdPlantillaPais2: Map<number, string>;
  atlas: Array<Atlas>;
  submit = false;
  textos: any;
  mapIds: Map<number, number>;
  paisesListIdioma: any = [];
  subdominios: Array<SubdomainDTO> = [];
  subdominiosById: Map<number, SubdomainDTO>;
  idioma: number;
  modoLectura = true;
  filtroPais = new FormControl();

  constructor(
    private paisesService: PaisesService,
    private atlasService: AtlasService,
    private genericoService: GenericoService,
    private lenguajeService: LenguajeService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {

    const user: Usuario = JSON.parse(localStorage.getItem('usuario'));
    this.modoLectura = (user === null || user.rol.id === Constants.ID_ROL_PAIS_R);

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

    this.paises = [];
    this.atlasPlantillas = [];

    this.paisesService.listaPaises.subscribe(cambio => {
      if (cambio) {
        this.paisesListIdioma = this.paisesService.listadoPaises;
      }
    });
    this.paisesListIdioma = this.paisesService.listadoPaises;

    this.formRegistro = this.formBuilder.group({
      pais1: new FormControl(this.idPais1 ? this.idPais1 : ''),
      pais2: new FormControl(this.idPais2 ? this.idPais2 : ''),
      controles: this.formBuilder.array([]),
      controlesPais2: this.formBuilder.array([]),
    });

    this.atlasService.consultarPlantillas(Constants.ESTADO_ACTIVO).pipe(concatMap((r) => {

      this.plantillas = r.data.plantillas;
      const plantillasPadres: AtlasPlantilla[] = this.plantillas.filter(f => f.idPadre === null);

      plantillasPadres.forEach((value) => {
        this.agregarPlantillaHijos(value);
      });

      this.mapIds = new Map<number, number>();
      this.atlasPlantillas.forEach((value) => {

        if (value.tieneContenido) {
          this.mapIds.set(value.id, this.controles.controls.length);
        }

        // tslint:disable-next-line:max-line-length
        this.controles.push(this.formBuilder.control(value.tieneContenido ? '' : -1));
        this.controlesPais2.push(this.formBuilder.control(value.tieneContenido ? '' : -1));

      });

      return this.atlasService.consultarAtlasRespuestas(this.idPais1);

    })).subscribe(res => {

      this.atlas = res.data !== null ? res.data.respuestas : [];

      this.respuestasPorIdPlantilla = new Map<number, string>();
      this.atlas.forEach((r) => this.respuestasPorIdPlantilla.set(r.idTemplate, r.contenido));
      this.builderFormRespuestas();

    });

    this.consultarPaises();
    // this.builderForm();
    this.cambioPais2();

  }

  agregarPlantillaHijos(atlasPlantilla: AtlasPlantilla): void {

    this.atlasPlantillas.push(atlasPlantilla);
    const plantillasHijas = this.plantillas.filter(f => f.idPadre === atlasPlantilla.id);
    plantillasHijas.forEach((p) => {
      this.agregarPlantillaHijos(p);
    });

  }

  builderFormRespuestas(): void {

    for (const i of this.respuestasPorIdPlantilla.keys()) {
      this.controles.controls[this.mapIds.get(i)].setValue(this.respuestasPorIdPlantilla.get(i));
    }

  }

  builderFormRespuestasPais2(): void {

    /*for (const i of this.controlesPais2.controls.keys()) {
      // his.controlesPais2.controls[i].setValue(this.readOnly ? '' : '');
    }*/

    for (const i of this.respuestasPorIdPlantillaPais2.keys()) {
      this.controlesPais2.controls[this.mapIds.get(i)].setValue(this.respuestasPorIdPlantillaPais2.get(i));
    }
  }

  get pais1(): AbstractControl {
    return this.formRegistro.get('pais1') as AbstractControl;
  }

  get pais2(): AbstractControl {
    return this.formRegistro.get('pais2') as AbstractControl;
  }

  get controles(): FormArray {
    return this.formRegistro.get('controles') as FormArray;
  }

  get controlesPais2(): FormArray {
    return this.formRegistro.get('controlesPais2') as FormArray;
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

      }

    });

  }

  consultarAtlas(): void {

  }

  getLabelTemplateLang(idSubdomain: number): string {

    if (this.subdominiosById.has(idSubdomain)) {
      return this.subdominiosById.get(idSubdomain).description;
    }

    return '';

  }

  cancelar(): void {

  }

  guardar(): void {
    this.submit = true;
    if (this.formRegistro.valid) {

      if (this.atlas === null || this.atlas.length === 0) {

        this.atlas = [];
        const iPais = this.paisesListIdioma.find(item => item.id === this.idPais1);

        this.mapIds.forEach((value, key) => {
          const iRespuesta = {
            id: null,
            idTemplate: key,
            pais: iPais,
            contenido: this.controles.controls[value].value
          };

          this.atlas.push(iRespuesta);

        });

      } else {

        for (const i of this.atlas.keys()) {
          this.atlas[i].contenido = this.controles.controls[this.mapIds.get(this.atlas[i].idTemplate)].value;
        }
      }

      this.atlasService.guardarAtlasRespuestas(this.atlas).subscribe((res) => {
        if (res.message === '200') {
          this.toastrService.success('Atlas guardado correctamente');
        }
      }, () => {
        this.toastrService.error('Error guardando atlas');
      });

    }

  }

  getDescripcionPais(pais: any): string {
    try {
      return this.paisesListIdioma.find(item => item.id === pais.id).nombre.trim();
    } catch {
      return pais.nombre.trim();
    }
  }

  consultarPaises(): any {
    const region = 'America';
    const url = `${Constants.PATH_LISTAR_PAIS_LANG}?pais=0&lang=${this.idioma}&region=${region}`;
    this.genericoService.get(url).subscribe(res => {
      if (res.data && res.success && res.message === '200' && res.status === 'OK') {
        res.data.sort((f, s) => {
          const a = f.nombre.toUpperCase().trim();
          const b = s.nombre.toUpperCase().trim();
          return a < b ? -1 : a > b ? 1 : 0;
        });
        this.paises = res.data;
      }
    });

  }

  cambioPais1(): void {
    this.idPais1 = this.pais1.value === '' ? 0 : this.pais1.value;
    let respuestasAtlas: Array<Atlas>;
    if (this.idPais1 !== 0) {
      this.atlasService.consultarAtlasRespuestas(this.idPais1).subscribe(r => {
        respuestasAtlas = r.data !== null ? r.data.respuestas : [];

        this.respuestasPorIdPlantilla = new Map<number, string>();
        respuestasAtlas.forEach((rs) => {
          this.respuestasPorIdPlantilla.set(rs.idTemplate, rs.contenido);
        });
        this.builderFormRespuestas();
      });
    }
  }

  cambioPais2(): void {
    this.idPais2 = this.pais2.value === '' ? 0 : this.pais2.value;
    let respuestasAtlas: Array<Atlas>;
    if (this.idPais2 !== 0) {
      this.atlasService.consultarAtlasRespuestas(this.idPais2).subscribe(r => {
        respuestasAtlas = r.data !== null ? r.data.respuestas : [];

        this.respuestasPorIdPlantillaPais2 = new Map<number, string>();
        respuestasAtlas.forEach((rs) => {
          this.respuestasPorIdPlantillaPais2.set(rs.idTemplate, rs.contenido);
        });
        this.builderFormRespuestasPais2();
      });
    }
  }

}

