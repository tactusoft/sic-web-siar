import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Pais } from '../../../modelos/pais';
import { GenericoService } from '../../../servicios/generico.service';
import { DialogNuevoUsuarioComponent } from '../../admin-usuarios/dialog-nuevo-usuario/dialog-nuevo-usuario.component';
import { ToastrService } from 'ngx-toastr';
import { AdjuntoDTO } from '../../../modelos/adjunto-dto';
import { Evento } from '../../../modelos/evento';
import { Recurso } from '../../../modelos/recurso';
import { Subdominio } from '../../../modelos/Subdominio';
import { Constants } from '../../../common/constants';
import {LenguajeService} from '../../../servicios/lenguaje.service';

@Component({
  selector: 'app-dialog-nuevo-evento',
  templateUrl: './dialog-nuevo-evento.component.html',
  styleUrls: ['./dialog-nuevo-evento.component.scss']
})
export class DialogNuevoEventoComponent implements OnInit {

  evento: Evento;
  formRegistro: FormGroup;
  paises: Array<Pais>;
  categorias: Array<Subdominio>;
  tituloFormulario: string;
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private genericoService: GenericoService,
    private dialogRef: MatDialogRef<DialogNuevoUsuarioComponent>,
    private toastrService: ToastrService,
    private lenguajeService: LenguajeService,
  ) { }

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

    this.evento = this.data.evento;
    if (this.evento) {
      this.editar = true;
      const even: Evento = this.data.evento;
      this.formRegistro = new FormGroup({
        id: new FormControl(even.id),
        titulo: new FormControl(even.title, [Validators.required, Validators.pattern(Constants.PATTERN_WHITE_SPACE)]),
        resumen: new FormControl(even.summary, [Validators.required, Validators.pattern(Constants.PATTERN_WHITE_SPACE)]),
        pais: new FormControl(even.pais ? even.pais.id : '', [Validators.required]),
        lugar: new FormControl(even.place, [Validators.required, Validators.pattern(Constants.PATTERN_WHITE_SPACE)]),
        direccion: new FormControl(even.addres, [Validators.required, Validators.pattern(Constants.PATTERN_WHITE_SPACE)]),
        categoria: new FormControl(even.categoryId ? even.categoryId.id : '', Validators.required),
        enlaces: new FormControl(),
        fechaInicio: new FormControl({ value: this.obtenerFechaEdicionUTC(even.startDate), disabled: true }, [Validators.required]),
        fechaFin: new FormControl({ value: this.obtenerFechaEdicionUTC(even.endDate), disabled: true }, [Validators.required]),
        imagenes: new FormControl()
      });
      this.getEnlaces(this.data.evento.recursos);
    } else {
      this.formRegistro = new FormGroup({
        id: new FormControl(0),
        titulo: new FormControl('', [Validators.required, Validators.pattern(Constants.PATTERN_WHITE_SPACE)]),
        resumen: new FormControl('', [Validators.required, Validators.pattern(Constants.PATTERN_WHITE_SPACE)]),
        pais: new FormControl('', [Validators.required]),
        lugar: new FormControl('', [Validators.required, Validators.pattern(Constants.PATTERN_WHITE_SPACE)]),
        direccion: new FormControl('', [Validators.required, Validators.pattern(Constants.PATTERN_WHITE_SPACE)]),
        categoria: new FormControl('', Validators.required),
        enlaces: new FormControl(''),
        fechaInicio: new FormControl({ value: new Date().toISOString(), disabled: true }, [Validators.required]),
        fechaFin: new FormControl({ value: new Date().toISOString(), disabled: true }, [Validators.required]),
        imagenes: new FormControl()
      });
    }

    this.tituloFormulario = this.data.titulo;
    this.fechaInicio.valueChanges.subscribe(data => {
      const fIni = new Date(data);
      const fFin = new Date(this.fechaFin.value);
      if (fIni > fFin) {
        this.fechaFin.setValue(fIni);
      }
    });

    this.paises = this.data.paises;
    this.categorias = this.data.categorias;
  }
  get titulo(): AbstractControl {
    return this.formRegistro.get('titulo');
  }
  get resumen(): AbstractControl {
    return this.formRegistro.get('resumen');
  }
  get pais(): AbstractControl {
    return this.formRegistro.get('pais');
  }
  get lugar(): AbstractControl {
    return this.formRegistro.get('lugar');
  }
  get direccion(): AbstractControl {
    return this.formRegistro.get('direccion');
  }
  get enlaces(): AbstractControl {
    return this.formRegistro.get('enlaces');
  }
  get fechaInicio(): AbstractControl {
    return this.formRegistro.get('fechaInicio');
  }
  get fechaFin(): AbstractControl {
    return this.formRegistro.get('fechaFin');
  }
  get categoria(): AbstractControl {
    return this.formRegistro.get('categoria');
  }
  get imagenes(): AbstractControl {
    return this.formRegistro.get('imagenes');
  }

  guardarEvento(): void {
    this.submit = true;
    if (this.formRegistro.valid) {
      if (new Date(this.fechaFin.value) < new Date(this.fechaInicio.value)) {
        this.toastrService.error(this.textos?.mensajes ? this.textos?.mensajes.FECH_FIN_MENOR_FECH_INI : 'Fecha fin no puede ser menor a fecha inicio');
        return;
      }
      const body = {
        addres: this.formRegistro.value.direccion,
        category_id: this.formRegistro.value.categoria === '' ? null : this.formRegistro.value.categoria,
        countries_id: this.formRegistro.value.pais,
        endDate: new Date(this.fechaFin.value).toISOString().slice(0, 10),
        enlaces: this.enlacesAnexos,
        id: this.formRegistro.value.id,
        place: this.formRegistro.value.lugar,
        startDate: new Date(this.fechaInicio.value).toISOString().slice(0, 10),
        summary: this.formRegistro.value.resumen,
        title: this.formRegistro.value.titulo,
        imagenes: this.imagenesBase64,
        imagenesBorrar: this.imagenesParaBorrar
      };
      if (this.editar) {
        this.genericoService.put(body, '/gestion/eventos/editarEvento').subscribe(
          res => {
            if (res.message === '200') {
              this.dialogRef.close(true);
            }
          });
      } else {
        this.genericoService.post(body, '/gestion/eventos/guardarEvento').subscribe(
          res => {
            if (res.message === '200') {
              this.dialogRef.close(true);
            }
          });
      }
    }
  }

  agregarImagenBorrar(imagen: any): void {
    this.imagenesParaBorrar.push(imagen);
    const index = this.evento.recursos.findIndex(r => r.id === imagen.id);
    this.evento.recursos.splice(index, 1);
    this.recursosActuales = this.evento.recursos.length;
  }
  getEnlaces(recurso: Array<Recurso>): void {
    const enlaces = recurso.filter(r => r.resourceTypeId.description === 'Enlaces');
    enlaces.forEach(en => {
      this.enlacesAnexos.push(en.path);
    });
  }

  getImagenes(recurso: Array<Recurso>): Array<Recurso> {
    const rec = recurso.filter(r => r.resourceTypeId.description === 'Imagenes');
    this.recursosActuales = rec.length;
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
  removeImagen(imagen: AdjuntoDTO): void {
    const index = this.imagenesBase64.findIndex(e => e.nombre === imagen.nombre);
    this.imagenesBase64.splice(index, 1);
  }
  onFileChange(fileInput): void {
    if (fileInput.target.files && fileInput.target.files[0]) {

      const maxSize = 5000000;

      if ((fileInput.target.files.length + (this.recursosActuales + this.imagenesBase64.length)) > 5) {
        this.toastrService.error(this.textos?.mensajes ? this.textos?.mensajes.NUMERO_MAXIMO_ARCHIVO_5 : Constants.NUMERO_MAXIMO_ARCHIVO_5);
        this.imagenes.setValue('');
        return;
      }
      for (const file of fileInput.target.files) {
        if (file.type !== 'image/png'
          && file.type !== 'image/jpeg'
          && file.type !== 'image/gif') {
          this.toastrService.error(this.textos?.mensajes ? this.textos?.mensajes.ARCHIVO_FORMATO_INVALIDO : 'Archivo no cumple con formato válido');
          this.errorTipo = true;
          return;
        } else {
          this.errorTipo = false;
        }
      }
      for (const file of fileInput.target.files) {
        if (file.size > maxSize) {
          this.toastrService.error(this.textos?.mensajes ? this.textos?.mensajes.TAMANO_SUPERADO : 'Imagen supera el tamaño permitido');
          this.errorPeso = true;
          return;
        } else {
          this.errorPeso = false;
        }
      }
      for (const file of fileInput.target.files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagenesBase64.push({
            base64: e.target.result,
            extension: file.type,
            nombre: file.name
          });
        };
        reader.readAsDataURL(file);
      }
    }
  }

  obtenerFechaEdicionUTC(fecha): string {
    try {
      return new Date(Number(fecha.split('-')[0]), Number(fecha.split('-')[1]) - 1, Number(fecha.split('-')[2])).toISOString();
    } catch (error) {
      return new Date().toISOString();
    }
  }
}
