import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Constants} from '../../../common/constants';
import {Pais} from '../../../modelos/pais';
import {Rol} from '../../../modelos/rol';
import {Usuario} from 'src/app/modelos/usuario';
import {LenguajeService} from '../../../servicios/lenguaje.service';
import {ToastrService} from 'ngx-toastr';
import {AtlasPlantilla} from '../../../modelos/atlasPlantilla';
import {SubdomainDTO} from '../../../clases/subdomainDTO';
import {AtlasService} from '../../../servicios/atlas/atlas.service';
import {SubdomainLeng} from '../../../clases/subdomainLeng';
import {PlantillaAtlasDTO} from '../../../clases/plantillaAtlasDTO';

@Component({
  selector: 'app-crear-plantilla',
  templateUrl: './crear-plantilla.component.html',
  styleUrls: ['./crear-plantilla.component.scss']
})
export class CrearPlantillaComponent implements OnInit {
  formRegistro: FormGroup;
  paises: Array<Pais>;
  roles: Array<Rol>;
  buscarPais: FormControl;
  buscarRol: FormControl;
  formFiltro: FormGroup;
  submit = false;
  textos: any;
  usuario: Usuario;
  editar = false;
  plantillasOrdenadas: Array<AtlasPlantilla>;
  plantillas: Array<AtlasPlantilla>;
  plantilla: AtlasPlantilla;
  plantillasById: Map<number, AtlasPlantilla>;
  subdominios: Array<SubdomainDTO> = [];
  subdominiosById: Map<number, SubdomainDTO>;
  subdominiosLenByIdioma: Map<string, SubdomainLeng> = new Map<string, SubdomainLeng>();

  // @ts-ignore
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    // private genericoService: GenericoService,
    private lenguajeService: LenguajeService,
    private atlasService: AtlasService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CrearPlantillaComponent>
  ) {
  }

  ngOnInit(): void {

    this.lenguajeService.idiomaSubject.subscribe(data => {
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
          this.textos = texts;
        },
        () => {
          this.toastrService.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });

    this.formRegistro = this.formBuilder.group({});
    this.plantillasOrdenadas = this.data.plantillasOrdenadas;
    this.plantillasById = this.data.plantillasById;
    this.subdominiosById = this.data.subdominiosById;

    this.plantilla = this.data.plantilla;
    if (this.plantilla) {
      this.consultarSubdominiosLen();
    }

    this.builderForm();

  }

  builderForm(): void {

    if (!this.plantilla || true) {
      this.formRegistro = this.formBuilder.group({
        codigo: new FormControl('', Validators.required),
        enunciadoEsp: new FormControl('', Validators.required),
        enunciadoEng: new FormControl('', Validators.required),
        enunciadoPor: new FormControl('', Validators.required),
        enunciadoFra: new FormControl('', Validators.required),
        posicion: new FormControl('', [Validators.min(0), Validators.required, Validators.pattern(Constants.PATTERN_NUMBER)]),
        idPadre: new FormControl(''),
        tieneContenido: new FormControl(false),
        estado: new FormControl(true)
      });
    } else {
      console.log('ee', this.subdominiosLenByIdioma);
      this.formRegistro = this.formBuilder.group({
        codigo: new FormControl(this.plantilla.codigo, Validators.required),
        enunciadoEsp: new FormControl(this.subdominiosLenByIdioma.get(Constants.ID_IDIOMA_ESP).description, Validators.required),
        enunciadoEng: new FormControl(this.subdominiosLenByIdioma.get(Constants.ID_IDIOMA_ENG).description, Validators.required),
        enunciadoPor: new FormControl(this.subdominiosLenByIdioma.get(Constants.ID_IDIOMA_POR).description, Validators.required),
        enunciadoFra: new FormControl(this.subdominiosLenByIdioma.get(Constants.ID_IDIOMA_FRA).description, Validators.required),
        posicion: new FormControl(
          this.plantilla.posicion, [Validators.min(0), Validators.required, Validators.pattern(Constants.PATTERN_NUMBER)]),
        idPadre: new FormControl(this.plantilla.idPadre),
        estado: new FormControl(this.plantilla.estado === 'A'),
        tieneContenido: new FormControl(this.plantilla.tieneContenido)
      });
    }
  }


  get codigo(): any {
    return this.formRegistro.get('codigo');
  }

  get enunciadoEsp(): any {
    return this.formRegistro.get('enunciadoEsp');
  }

  get enunciadoEng(): any {
    return this.formRegistro.get('enunciadoEng');
  }

  get enunciadoPor(): any {
    return this.formRegistro.get('enunciadoPor');
  }

  get enunciadoFra(): any {
    return this.formRegistro.get('enunciadoFra');
  }

  get posicion(): any {
    return this.formRegistro.get('posicion');
  }

  get idPadre(): any {
    return this.formRegistro.get('idPadre');
  }

  get estado(): any {
    return this.formRegistro.get('estado');
  }

  get tieneContenido(): any {
    return this.formRegistro.get('tieneContenido');
  }

  guardar(): void {
    this.submit = true;
    if (this.formRegistro.valid) {

      const body: PlantillaAtlasDTO = {
        id: this.plantilla ? this.plantilla.id : null,
        codigo: this.codigo.value,
        idPadre: this.idPadre.value !== 0 ? this.idPadre.value : null,
        tieneContenido: this.tieneContenido.value,
        estado: this.estado.value ? 'A' : 'I',
        posicion: this.posicion.value,
        subdominio: this.plantilla ? this.plantilla.subdominio : null,
        enunciadoEsp: this.enunciadoEsp.value,
        enunciadoEng: this.enunciadoEng.value,
        enunciadoPor: this.enunciadoPor.value,
        enunciadoFra: this.enunciadoFra.value,
      };

      this.atlasService.guardarPlantilla(body).subscribe((res) => {
        if (res.message === '200') {
          this.toastrService.success(this.textos?.mensajes ? this.textos?.mensajes?.MENSAJE_TX_OK : Constants.MENSAJE_TX_OK);
          this.dialogRef.close(true);
        }
      }, () => {
        this.toastrService.error(this.textos?.mensajes ? this.textos?.mensajes?.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
      });

    }

  }

  getLabelTemplateLang(idSubdomain: number): string {

    if (this.subdominiosById.has(idSubdomain)) {
      return this.subdominiosById.get(idSubdomain).description;
    }

    return '';

  }

  consultarSubdominiosLen(): void {

    this.atlasService.consultarSubdominiosLeng(this.plantilla.subdominio.id).subscribe(res => {

      let subdominiosLen: Array<SubdomainLeng> = [];

      if (res.message === '200') {
        subdominiosLen = res.data.subdominiosLang;
        console.log('ddd', subdominiosLen);
        this.subdominiosLenByIdioma = new Map<string, SubdomainLeng>();

        subdominiosLen.forEach(value => {
          console.log('ddd');
          this.subdominiosLenByIdioma.set(value.lenguaje, value);
        });

        this.codigo.value = this.plantilla.codigo;
        this.idPadre.value = this.plantilla.idPadre;
        this.enunciadoEsp.value = this.subdominiosLenByIdioma.get(Constants.ID_IDIOMA_ESP).description;
        this.enunciadoEng.value = this.subdominiosLenByIdioma.get(Constants.ID_IDIOMA_ENG).description;
        this.enunciadoPor.value = this.subdominiosLenByIdioma.get(Constants.ID_IDIOMA_POR).description;
        this.enunciadoFra.value = this.subdominiosLenByIdioma.get(Constants.ID_IDIOMA_FRA).description;
        this.tieneContenido.value = this.plantilla.tieneContenido;
        this.estado.value = this.plantilla.estado === Constants.ESTADO_ACTIVO;
        this.posicion.value = this.plantilla.posicion;

      }

    });

  }

  validarDatos(): boolean {
    return this.subdominiosLenByIdioma ? this.subdominiosLenByIdioma.size > 0 : false;
  }

}
