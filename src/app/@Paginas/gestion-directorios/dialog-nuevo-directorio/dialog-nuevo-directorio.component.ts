import {Component, Inject, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Pais} from '../../../modelos/pais';
import {GenericoService} from '../../../servicios/generico.service';
import {ToastrService} from 'ngx-toastr';
import {AdjuntoDTO} from '../../../modelos/adjunto-dto';
import {Recurso} from '../../../modelos/recurso';
import {Subdominio} from '../../../modelos/Subdominio';
import {Constants} from '../../../common/constants';
import {LenguajeService} from '../../../servicios/lenguaje.service';
import {Directorio} from '../../../modelos/directorio';

@Component({
  selector: 'app-dialog-nuevo-directorio',
  templateUrl: './dialog-nuevo-directorio.component.html',
  styleUrls: ['./dialog-nuevo-directorio.component.scss']
})
export class DialogNuevoDirectorioComponent implements OnInit {

  directorio: Directorio;
  formRegistro: FormGroup;
  paises: Array<Pais>;
  categorias: Array<Subdominio>;
  enlacesAnexos: Array<string> = [];
  imagenesAnexos: Array<string> = [];
  imagenesBase64: Array<AdjuntoDTO> = [];
  errorPeso = false;
  errorTipo = false;
  editar = false;
  imagenesParaBorrar: Array<any> = [];
  recursosActuales = 0;
  submit = false;
  idioma: string;
  textos: any = null;

  anexosBase64: Array<AdjuntoDTO> = [];
  errorNumArchivoAnexo = false;
  errorPesoAnexo = false;
  errorTipoAnexo = false;
  errorNumArchivoImagenes = false;
  errorPesoImagenes = false;
  errorTipoImagenes = false;

  anexosParaBorrar: Array<any> = [];
  enlacesParaBorrar: Array<any> = [];

  recursosActualesAnexo = 0;
  recursosActualesEnlace = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private genericoService: GenericoService,
    private dialogRef: MatDialogRef<DialogNuevoDirectorioComponent>,
    private toastrService: ToastrService,
    private lenguajeService: LenguajeService,
  ) {
  }

  ngOnInit(): void {

    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {

      this.idioma = data;

      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(this.idioma).subscribe(texts => {
          this.textos = texts;
        },
        () => {
          this.toastrService.error(this.textos?.mensajes ? this.textos?.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });

    this.directorio = this.data.directorio;

    if (this.directorio) {
      this.editar = true;
      const dir: Directorio = this.data.directorio;
      this.formRegistro = new FormGroup({
        id: new FormControl(dir.id),
        agencia: new FormControl(dir.agencia, [Validators.required, Validators.pattern(Constants.PATTERN_WHITE_SPACE)]),
        contacto: new FormControl(dir.contacto, [Validators.pattern(Constants.PATTERN_WHITE_SPACE)]),
        cargo: new FormControl(dir.cargo, [Validators.pattern(Constants.PATTERN_WHITE_SPACE)]),
        direccion: new FormControl(dir.direccion, [Validators.pattern(Constants.PATTERN_WHITE_SPACE)]),
        ciudad: new FormControl(dir.ciudad, [Validators.pattern(Constants.PATTERN_WHITE_SPACE)]),
        estado: new FormControl(dir.estado, [Validators.pattern(Constants.PATTERN_WHITE_SPACE)]),
        tel: new FormControl(dir.telefono, [Validators.pattern(Constants.PATTERN_WHITE_SPACE)]),
        fax: new FormControl(dir.fax, [Validators.pattern(Constants.PATTERN_WHITE_SPACE)]),
        email: new FormControl(dir.email, [Validators.pattern(Constants.PATTERN_EMAIL)]),
        codPostal: new FormControl(dir.codigoPostal, [Validators.pattern(Constants.PATTERN_WHITE_SPACE)]),
        pais: new FormControl(dir.pais ? dir.pais.id : '', [Validators.required]),
        categoria: new FormControl(dir.categoryId.id, [Validators.required]),
        enlaces: new FormControl(),
        anexos: new FormControl(),
        imagenes: new FormControl()
      });
      this.getEnlaces(this.data.directorio.recursos);
    } else {
      this.formRegistro = new FormGroup({
        id: new FormControl(0),
        agencia: new FormControl('', [Validators.required, Validators.pattern(Constants.PATTERN_WHITE_SPACE)]),
        contacto: new FormControl('', [Validators.required, Validators.pattern(Constants.PATTERN_WHITE_SPACE)]),
        cargo: new FormControl('', [Validators.pattern(Constants.PATTERN_WHITE_SPACE)]),
        direccion: new FormControl('', [Validators.pattern(Constants.PATTERN_WHITE_SPACE)]),
        ciudad: new FormControl('', [Validators.pattern(Constants.PATTERN_WHITE_SPACE)]),
        estado: new FormControl('', [Validators.pattern(Constants.PATTERN_WHITE_SPACE)]),
        tel: new FormControl('', [Validators.pattern(Constants.PATTERN_WHITE_SPACE)]),
        fax: new FormControl('', [Validators.pattern(Constants.PATTERN_WHITE_SPACE)]),
        email: new FormControl('', [Validators.required, Validators.pattern(Constants.PATTERN_EMAIL)]),
        website: new FormControl('', [Validators.pattern(Constants.PATTERN_WHITE_SPACE)]),
        codPostal: new FormControl('', [Validators.pattern(Constants.PATTERN_WHITE_SPACE)]),
        pais: new FormControl('', [Validators.required]),
        categoria: new FormControl('', [Validators.required]),
        enlaces: new FormControl(),
        anexos: new FormControl(),
        imagenes: new FormControl()
      });
    }

    this.paises = this.data.paises;
    this.categorias = this.data.categorias;
  }

  get agencia(): AbstractControl {
    return this.formRegistro.get('agencia');
  }

  get contacto(): AbstractControl {
    return this.formRegistro.get('contacto');
  }

  get pais(): AbstractControl {
    return this.formRegistro.get('pais');
  }

  get cargo(): AbstractControl {
    return this.formRegistro.get('cargo');
  }

  get direccion(): AbstractControl {
    return this.formRegistro.get('direccion');
  }

  get estado(): AbstractControl {
    return this.formRegistro.get('estado');
  }

  get ciudad(): AbstractControl {
    return this.formRegistro.get('ciudad');
  }

  get codPostal(): AbstractControl {
    return this.formRegistro.get('codPostal');
  }

  get tel(): AbstractControl {
    return this.formRegistro.get('tel');
  }

  get website(): AbstractControl {
    return this.formRegistro.get('website');
  }

  get email(): AbstractControl {
    return this.formRegistro.get('email');
  }

  get fax(): AbstractControl {
    return this.formRegistro.get('fax');
  }

  get categoria(): AbstractControl {
    return this.formRegistro.get('categoria');
  }

  get enlaces(): AbstractControl {
    return this.formRegistro.get('enlaces');
  }

  get anexos(): AbstractControl {
    return this.formRegistro.get('anexos');
  }

  get imagenes(): AbstractControl {
    return this.formRegistro.get('imagenes');
  }

  guardarDirectorio(): void {
    this.submit = true;
    if (this.formRegistro.valid) {

      const body = {
        id: this.formRegistro.value.id ? this.formRegistro.value.id : null,
        agencia: this.formRegistro.value.agencia,
        contacto: this.formRegistro.value.contacto,
        cargo: this.formRegistro.value.cargo,
        direccion: this.formRegistro.value.direccion,
        estado: this.formRegistro.value.estado,
        ciudad: this.formRegistro.value.ciudad,
        codigoPostal: this.formRegistro.value.codPostal,
        telefono: this.formRegistro.value.tel,
        fax: this.formRegistro.value.fax,
        email: this.formRegistro.value.email,
        pais: {id: this.formRegistro.value.pais},
        categoryId: this.formRegistro.value.categoria === '' ? null : {id: this.formRegistro.value.categoria},
        enlaces: this.enlacesAnexos,
        archivos: this.anexosBase64.concat(this.imagenesBase64),
        eliminar: this.editar ? this.enlacesParaBorrar.concat(this.anexosParaBorrar.concat(this.imagenesParaBorrar)) : []
      };
      if (this.editar) {
        this.genericoService.put(body, Constants.PATH_EDITAR_DIRECTORIO).subscribe(
          res => {
            if (res.message === '200') {
              this.dialogRef.close(true);
              // this.toastrService.success(this.textos?.mensajes ? this.textos?.mensajes?.MENSAJE_TX_OK : Constants.MENSAJE_TX_OK);
            }
          }, () => {
            this.toastrService.error(this.textos?.mensajes ? this.textos?.mensajes?.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
          });
      } else {
        this.genericoService.post(body, Constants.PATH_CREAR_DIRECTORIO).subscribe(
          res => {
            if (res.message === '200') {
              this.dialogRef.close(true);
              // this.toastrService.success(this.textos?.mensajes ? this.textos?.mensajes?.MENSAJE_TX_OK : Constants.MENSAJE_TX_OK);
            } else {
              this.toastrService.error(this.textos?.mensajes ? this.textos?.mensajes?.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
            }
          }, () => {
            this.toastrService.error(this.textos?.mensajes ? this.textos?.mensajes?.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
          });
      }
    }
  }

  agregarEnlaceBorrar(enlace: any): void {
    this.enlacesParaBorrar.push(enlace.id);
    const index = this.directorio.recursos.findIndex(r => r.id === enlace.id);
    this.directorio.recursos.splice(index, 1);
  }

  getEnlaces(recurso: Array<Recurso>): Array<Recurso> {
    const rec = recurso.filter(r => r.resourceTypeId.description === 'Enlaces');
    this.recursosActualesEnlace = rec.length;
    return rec;
  }

  agregarEnlace(enlace: string): void {
    this.enlacesAnexos.push(enlace);
    this.enlaces.setValue('');
  }

  removeEnlace(enlace): void {
    const index = this.enlacesAnexos.findIndex(e => e === enlace);
    this.enlacesAnexos.splice(index, 1);
  }

  agregarImagenBorrar(imagen: any): void {
    this.imagenesParaBorrar.push(imagen.id);
    const index = this.directorio.recursos.findIndex(r => r.id === imagen.id);
    this.directorio.recursos.splice(index, 1);
    this.recursosActuales = this.directorio.recursos.length;
  }

  getImagenes(recurso: Array<Recurso>): Array<Recurso> {
    const rec = recurso.filter(
      r => r.resourceTypeId.description === 'Imagenes'
    );
    this.recursosActuales = rec.length;
    return rec;
  }

  removeImagen(imagen: AdjuntoDTO): void {
    const index = this.imagenesBase64.findIndex(
      e => e.nombre === imagen.nombre
    );
    this.imagenesBase64.splice(index, 1);
    if (this.imagenesBase64.length > 5) {
      this.toastrService.error(this.textos ? this.textos.NUMERO_MAXIMO_ARCHIVO_5 : Constants.NUMERO_MAXIMO_ARCHIVO_5);
      this.errorNumArchivoImagenes = true;
    } else {
      this.errorNumArchivoImagenes = false;
    }
  }

  agregarAnexoBorrar(anexo: any): void {
    this.anexosParaBorrar.push(anexo.id);
    const index = this.directorio.recursos.findIndex(r => r.id === anexo.id);
    this.directorio.recursos.splice(index, 1);
    this.recursosActualesAnexo = this.directorio.recursos.length;
  }

  getAnexos(recurso: Array<Recurso>): Array<Recurso> {
    const rec = recurso.filter(r => r.resourceTypeId.description === 'Anexos');
    this.recursosActualesAnexo = rec.length;
    return rec;
  }

  removeAnexo(anexo: AdjuntoDTO): void {
    const index = this.anexosBase64.findIndex(e => e.nombre === anexo.nombre);
    this.anexosBase64.splice(index, 1);
    if (this.anexosBase64.length > 10) {
      this.toastrService.error(this.textos ? this.textos.NUMERO_MAXIMO_ARCHIVO_10 : Constants.NUMERO_MAXIMO_ARCHIVO_10);
      this.errorNumArchivoAnexo = true;
    } else {
      this.errorNumArchivoAnexo = false;
    }
  }

  onFileChange(fileInput): void {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const maxSize = 5000000;

      if (
        fileInput.target.files.length +
        (this.recursosActuales + this.imagenesBase64.length) >
        5
      ) {
        this.toastrService.error(this.textos ? this.textos.NUMERO_MAXIMO_ARCHIVO_5 : Constants.NUMERO_MAXIMO_ARCHIVO_5);
        this.errorNumArchivoImagenes = true;
      } else {
        this.errorNumArchivoImagenes = false;
      }
      for (const file of fileInput.target.files) {
        if (!Constants.tiposImagenesValidas.includes(file.type)) {
          this.toastrService.error(this.textos?.mensajes
            ? this.textos?.mensajes.FORMATO_IMAGEN_INVALIDO : Constants.FORMATO_IMAGEN_INVALIDO);
          this.errorTipoImagenes = true;
          return;
        } else {
          this.errorTipoImagenes = false;
        }
      }
      for (const file of fileInput.target.files) {
        if (file.size > maxSize) {
          this.toastrService.error(this.textos ? this.textos.TAMANO_SUPERADO : Constants.TAMANO_SUPERADO);
          this.errorPesoImagenes = true;
          return;
        } else {
          this.errorPesoImagenes = false;
        }
      }
      for (const file of fileInput.target.files) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.imagenesBase64.push({
            base64: String(reader.result).trim(),
            extension: file.type,
            nombre: file.name,
            tipo: 'Imagenes'
          });
        };
      }
    }
  }

  onFileChangeAnexo(fileInput): void {

    const formatos = Constants.tiposImagenesValidas.concat(
      Constants.tipoArchivosValidos
    );

    if (fileInput.target.files && fileInput.target.files[0]) {
      const maxSize = 5000000;
      if (fileInput.target.files.length + (this.recursosActualesAnexo + this.anexosBase64.length) > 10) {
        this.toastrService.error(this.textos ? this.textos.NUMERO_MAXIMO_ARCHIVO_10 : Constants.NUMERO_MAXIMO_ARCHIVO_10);
        this.errorNumArchivoAnexo = true;
      } else {
        this.errorNumArchivoAnexo = false;
      }

      for (const file of fileInput.target.files) {
        if (!formatos.includes(file.type)) {
          this.toastrService.error(this.textos ? this.textos.FORMATO_DOCUMENTOS_INVALIDO : Constants.FORMATO_DOCUMENTOS_INVALIDO);
          this.errorTipoAnexo = true;
          return;
        } else {
          this.errorTipoAnexo = false;
        }
      }
      for (const file of fileInput.target.files) {
        if (file.size > maxSize) {
          this.toastrService.error(this.textos ? this.textos.TAMANO_SUPERADO : Constants.TAMANO_SUPERADO);
          this.errorPesoAnexo = true;
          return;
        } else {
          this.errorPesoAnexo = false;
        }
      }

      for (const file of fileInput.target.files) {
        const reader = new FileReader();
        reader.onload = () => {
          this.anexosBase64.push({
            base64: String(reader.result).trim(),
            extension: file.type,
            nombre: file.name,
            tipo: 'Anexos'
          });
        };
        reader.readAsDataURL(file);
      }
    }
  }

}

