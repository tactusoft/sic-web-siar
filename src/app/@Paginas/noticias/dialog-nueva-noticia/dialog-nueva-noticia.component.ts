import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { AdjuntoDTO } from '../../../modelos/adjunto-dto';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogNuevoUsuarioComponent } from '../../admin-usuarios/dialog-nuevo-usuario/dialog-nuevo-usuario.component';
import { Pais } from '../../../modelos/pais';
import { Noticia } from '../../../modelos/noticia';
import { Recurso } from '../../../modelos/recurso';
import { CabeceraService } from '../../../servicios/cabecera.service';
import {LenguajeService} from '../../../servicios/lenguaje.service';
import {GenericoService} from '../../../servicios/generico.service';
import {Constants} from '../../../common/constants';

@Component({
  selector: 'app-dialog-nueva-noticia',
  templateUrl: './dialog-nueva-noticia.component.html',
  styleUrls: ['./dialog-nueva-noticia.component.scss']
})
export class DialogNuevaNoticiaComponent implements OnInit {
  nuevaNoticiaInfo: any = null;
  noticia: Noticia;
  formRegistro: FormGroup;
  paises: Array<Pais>;
  enlacesUrl: Array<string> = [];
  imagenesBase64: Array<AdjuntoDTO> = [];
  anexosBase64: Array<AdjuntoDTO> = [];
  errorNumArchivoAnexo = false;
  errorPesoAnexo = false;
  errorTipoAnexo = false;
  errorNumArchivoImagenes = false;
  errorPesoImagenes = false;
  errorTipoImagenes = false;
  editar = false;
  imagenesParaBorrar: Array<any> = [];
  anexosParaBorrar: Array<any> = [];
  enlacesParaBorrar: Array<any> = [];
  recursosActuales = 0;
  recursosActualesAnexo = 0;
  recursosActualesEnlace = 0;
  tituloFormulario: string;
  idioma: number;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private genericoService: GenericoService,
    private dialogRef: MatDialogRef<DialogNuevoUsuarioComponent>,
    private toastrService: ToastrService,
    private cabeceraService: CabeceraService,
    private lenguajeService: LenguajeService,
  ) {}

  ngOnInit(): void {
    this.cabeceraService.closeMenu.emit(true);
    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      this.idioma = this.lenguajeService.devolverIntIdioma(data);
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
          this.nuevaNoticiaInfo = texts;
        },
        () => {
          this.toastrService.error(this.nuevaNoticiaInfo ? this.nuevaNoticiaInfo.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
    this.noticia = this.data.noticia;
    this.tituloFormulario = this.data.titulo;
    if (this.noticia) {
      const paisesGuardados: Array<any> = [];
      this.noticia.pais.forEach(item => {
        paisesGuardados.push(item.id);
      });
      this.editar = true;
      this.formRegistro = new FormGroup({
        id: new FormControl(this.noticia.id),
        titulo: new FormControl(this.noticia.titulo, Validators.required),
        resumen: new FormControl(this.noticia.resumen, Validators.required),
        fechaPublicacion: new FormControl(
          new Date(this.noticia.fecha).toISOString().slice(0, 10),
          Validators.required
        ),
        pais: new FormControl(paisesGuardados, Validators.required),
        enlaces: new FormControl(),
        anexos: new FormControl(),
        imagenes: new FormControl()
      });
    } else {
      const date = new Date();
      this.formRegistro = new FormGroup({
        id: new FormControl(0),
        titulo: new FormControl('', Validators.required),
        resumen: new FormControl('', Validators.required),
        fechaPublicacion: new FormControl(date, Validators.required),
        pais: new FormControl('', Validators.required),
        enlaces: new FormControl(''),
        anexos: new FormControl(),
        imagenes: new FormControl()
      });
    }
    this.consultarPais();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.formRegistro.controls[controlName].hasError(errorName);
  }

  consultarPais(): void {
    const url = `${Constants.PATH_LISTAR_PAIS_LANG}?pais=0&lang=${this.idioma}`;
    this.genericoService.get(url).subscribe(res => {
      this.paises = res.data;
    });
  }

  get titulo(): AbstractControl {
    return this.formRegistro.get('titulo');
  }
  get resumen(): AbstractControl {
    return this.formRegistro.get('resumen');
  }
  get fechaPublicacion(): AbstractControl {
    return this.formRegistro.get('fechaPublicacion');
  }
  get pais(): AbstractControl {
    return this.formRegistro.get('pais');
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

  agregarEnlaceBorrar(enlace: any): void {
    this.enlacesParaBorrar.push(enlace.id);
    const index = this.noticia.recursos.findIndex(r => r.id === enlace.id);
    this.noticia.recursos.splice(index, 1);
  }
  getEnlaces(recurso: Array<Recurso>): Array<Recurso> {
    const rec = recurso.filter(r => r.resourceTypeId.description === 'Enlaces');
    this.recursosActualesEnlace = rec.length;
    return rec;
  }

  agregarEnlace(enlace: string): void {
    this.enlacesUrl.push(enlace);
    this.enlaces.setValue('');
  }

  removeEnlace(enlace): void {
    const index = this.enlacesUrl.findIndex(e => e === enlace);
    this.enlacesUrl.splice(index, 1);
  }

  agregarImagenBorrar(imagen: any): void {
    this.imagenesParaBorrar.push(imagen.id);
    const index = this.noticia.recursos.findIndex(r => r.id === imagen.id);
    this.noticia.recursos.splice(index, 1);
    this.recursosActuales = this.noticia.recursos.length;
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
      this.toastrService.error(this.nuevaNoticiaInfo ? this.nuevaNoticiaInfo.NUMERO_MAXIMO_ARCHIVO_5 : Constants.NUMERO_MAXIMO_ARCHIVO_5);
      this.errorNumArchivoImagenes = true;
    } else {
      this.errorNumArchivoImagenes = false;
    }
  }

  agregarAnexoBorrar(anexo: any): void {
    this.anexosParaBorrar.push(anexo.id);
    const index = this.noticia.recursos.findIndex(r => r.id === anexo.id);
    this.noticia.recursos.splice(index, 1);
    this.recursosActualesAnexo = this.noticia.recursos.length;
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
      this.toastrService.error(this.nuevaNoticiaInfo ? this.nuevaNoticiaInfo.NUMERO_MAXIMO_ARCHIVO_10 : Constants.NUMERO_MAXIMO_ARCHIVO_10);
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
        this.toastrService.error(this.nuevaNoticiaInfo ? this.nuevaNoticiaInfo.NUMERO_MAXIMO_ARCHIVO_5 : Constants.NUMERO_MAXIMO_ARCHIVO_5);
        this.errorNumArchivoImagenes = true;
      } else {
        this.errorNumArchivoImagenes = false;
      }
      for (const file of fileInput.target.files) {
        if (!Constants.tiposImagenesValidas.includes(file.type)) {
          this.toastrService.error(this.nuevaNoticiaInfo?.mensajes
              ? this.nuevaNoticiaInfo?.mensajes.FORMATO_IMAGEN_INVALIDO : Constants.FORMATO_IMAGEN_INVALIDO);
          this.errorTipoImagenes = true;
          return;
        } else {
          this.errorTipoImagenes = false;
        }
      }
      for (const file of fileInput.target.files) {
        if (file.size > maxSize) {
          this.toastrService.error(this.nuevaNoticiaInfo ? this.nuevaNoticiaInfo.TAMANO_SUPERADO : Constants.TAMANO_SUPERADO);
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
      Constants.tiposDocumentosValidos
    );
    if (fileInput.target.files && fileInput.target.files[0]) {
      const maxSize = 5000000;
      if (
        fileInput.target.files.length +
        (this.recursosActualesAnexo + this.anexosBase64.length) >
        10
      ) {
        this.toastrService.error(this.nuevaNoticiaInfo
            ? this.nuevaNoticiaInfo.NUMERO_MAXIMO_ARCHIVO_10 : Constants.NUMERO_MAXIMO_ARCHIVO_10);
        this.errorNumArchivoAnexo = true;
      } else {
        this.errorNumArchivoAnexo = false;
      }
      for (const file of fileInput.target.files) {
        if (!formatos.includes(file.type)) {
          this.toastrService.error(this.nuevaNoticiaInfo
              ? this.nuevaNoticiaInfo.FORMATO_DOCUMENTOS_INVALIDO : Constants.FORMATO_DOCUMENTOS_INVALIDO);
          this.errorTipoAnexo = true;
          return;
        } else {
          this.errorTipoAnexo = false;
        }
      }
      for (const file of fileInput.target.files) {
        if (file.size > maxSize) {
          this.toastrService.error(this.nuevaNoticiaInfo
              ? this.nuevaNoticiaInfo.TAMANO_SUPERADO : Constants.TAMANO_SUPERADO);
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

  guardarNoticia(data: any): void {
    const body = {
      id: data.id ? data.id : null,
      titulo: data.titulo,
      resumen: data.resumen,
      fecha: data.fechaPublicacion,
      pais: data.pais,
      enlaces: this.enlacesUrl,
      archivos: this.anexosBase64.concat(this.imagenesBase64),
      eliminar: this.editar
        ? this.enlacesParaBorrar.concat(
          this.anexosParaBorrar.concat(this.imagenesParaBorrar)
        )
        : [],
      miniatura: ''
    };
    this.genericoService
      .post(body, '/noticias/guardarNoticia')
      .subscribe(res => {
        if (res.message === '200') {
          this.dialogRef.close(true);
        }
      });
  }

  paisEsVacio(value: any): boolean {
    if (value) {
      return false;
    } else {
      return true;
    }
  }
}
