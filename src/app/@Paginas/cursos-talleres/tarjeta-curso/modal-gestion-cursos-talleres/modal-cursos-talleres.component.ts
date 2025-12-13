import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { CursosTalleresService } from '../../cursos-talleres.service';
import {Constants} from '../../../../common/constants';
import {Pais} from '../../../../modelos/pais';
import {CursosTalleres, RecursosMultimedia} from '../../../../modelos/cursos-talleres';
import {LenguajeService} from '../../../../servicios/lenguaje.service';
import {CabeceraService} from '../../../../servicios/cabecera.service';
import {ModalGestionAlertasComponent} from '../../../gestion-alertas/modal-gestion-alertas/modal-gestion-alertas.component';
import {GenericoService} from '../../../../servicios/generico.service';
import {Recurso} from '../../../../modelos/recurso';


@Component({
  selector: 'app-modal-cursos-tallere',
  templateUrl: './modal-cursos-tallere.component.html',
  styleUrls: ['./modal-cursos-tallere.component.scss']
})


export class ModalGestionCursosComponent implements OnInit {

  /* Constantes */
  iconoEditar = Constants.ICON_EDITAR_NEW;
  iconoEliminar = Constants.ICON_ELIMINAR_NEW;
  iconoCargueFile = Constants.ICON_CARGAR_FILE;
  iconoCamara = Constants.ICON_CAMARA;
  iconoCamaraVideo = Constants.ICON_CAMARA_VIDEO;
  tipoEventos: any [];

  /* Variables */
  mCursos: any = null;
  @Output() cambio = new EventEmitter();
  curso: CursosTalleres;
  paisesList: Array<Pais> = [];
  fileToUpload: File = null;
  multimedia?: Array<RecursosMultimedia> = [];
  enlaces: string;
  req: any;
  campo: string;
  guardar = false;
  editDelete = false;
  editCreate = false;
  documentosCargados = [];
  imagenesCargadas = [];
  videosCargados = [];
  archivoBase64: string;
  enlacesList = [];
  idioma: number;

  constructor(private snackBar: MatSnackBar,
              private lenguajeService: LenguajeService,
              private cabeceraService: CabeceraService,
              public dialogRef: MatDialogRef<ModalGestionAlertasComponent>,
              private genericoService: GenericoService,
              public dialog: MatDialog,
              iconRegistry: MatIconRegistry,
              private toastr: ToastrService,
              sanitizer: DomSanitizer,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private cursosTalleresService: CursosTalleresService) {
    iconRegistry.addSvgIcon('iconoCamara', sanitizer.bypassSecurityTrustResourceUrl(this.iconoCamara));
    iconRegistry.addSvgIcon('iconoCamaraVideo', sanitizer.bypassSecurityTrustResourceUrl(this.iconoCamaraVideo));
    iconRegistry.addSvgIcon('iconoEditar', sanitizer.bypassSecurityTrustResourceUrl(this.iconoEditar));
    iconRegistry.addSvgIcon('iconoEliminar', sanitizer.bypassSecurityTrustResourceUrl(this.iconoEliminar));
    iconRegistry.addSvgIcon('iconoCargueFile', sanitizer.bypassSecurityTrustResourceUrl(this.iconoCargueFile));
    this.curso = data.subdom;
    this.editDelete = data.cod === 1;
    if (data.cod === 1) {
      this.editCreate = this.curso.name === '' ? true : false;
    }
    if (this.curso.recursos != null) {
      this.getEnlaces(this.curso.recursos);
    }
    this.curso.startDate = this.obtenerFechaUTC(new Date(this.curso.startDate));
    this.curso.endDate = this.obtenerFechaUTC(new Date(this.curso.endDate));
  }

  ngOnInit(): void {
    this.cabeceraService.closeMenu.emit(true);

    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      this.idioma = this.lenguajeService.devolverIntIdioma(data);
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
          this.mCursos = texts;
        },
        () => {
          this.toastr.error(this.mCursos?.mensajes ? this.mCursos.mensajes.MENSAJE_ERROR :  Constants.MENSAJE_ERROR);
        });
    });
    this.consultarPais();
    this.consultarTipos();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  consultarPais(): void {
    const url = `${Constants.PATH_LISTAR_PAIS_LANG}?pais=0&lang=${this.idioma}`;
    this.genericoService.get(url).subscribe(res => {
      if (res.data) {
        res.data.sort((f, s) => {
          const a = f.nombre.toUpperCase().trim();
          const b = s.nombre.toUpperCase().trim();

          return a < b ? -1 : a > b ? 1 : 0;
        });

        this.paisesList = res.data;
      }
    });
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  consultarTipos(): void {
    const url = `${Constants.PATH_LISTAR_DOMINIO_NOMBRE_LANG}?nombre=${Constants.TIPO_CURSO_TALLER}&idioma=${this.idioma}`;
    this.genericoService.get(url).subscribe(res => {
      this.tipoEventos = res.data.dominio[0].subDominio;
    });
  }

  guardarCursoTaller(): void {
    this.curso.enlaces = [];
    if (this.enlacesList.length > 0) {
      this.enlacesList.forEach(item => this.curso.enlaces.push(item.nombreRecurso.toString()));
    }
    this.curso.country = this.curso.country.id !== undefined ? this.curso.country.id : this.curso.country;
    this.curso.type = this.curso.type.id !== undefined ? this.curso.type.id : this.curso.type;
    this.genericoService.post(this.curso, '/gestion/cursoTaller/guardarCursoTaller').subscribe(
      respuesta => {
        if (respuesta.message === '200') {
          if (!this.editCreate) {
            this.toastr.info('Item modificado exitosamente');
          } else {
            this.toastr.info('Item creado exitosamente');
          }
          this.cursosTalleresService.recargarCursosYTalleres.emit(true);
          this.dialogRef.close();
        }
      }, err => {
        console.log(err);
        this.toastr.error(this.mCursos?.mensajes ? this.mCursos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
      }
    );
  }

  borrarCursoTaller(): void {
    this.curso.country = this.curso.country.id !== undefined ? this.curso.country.id : this.curso.country;
    this.curso.type = this.curso.type.id !== undefined ? this.curso.type.id : this.curso.type;
    this.genericoService.post(this.curso, '/gestion/cursoTaller/borrarCursoTaller').subscribe(data => {
      if (data.message === '200') {
        this.toastr.info(this.mCursos?.mensajes ? this.mCursos.mensajes.CURSO_ELIMINADO : Constants.CURSO_ELIMINADO);
        this.cursosTalleresService.recargarCursosYTalleres.emit(true);
        this.dialogRef.close();
      } else {
        this.toastr.error(this.mCursos?.mensajes ? this.mCursos.mensajes.ERROR_ELIMINAR_CURSO : Constants.ERROR_ELIMINAR_CURSO);
      }
    }, err => {
      console.log(err);
      this.toastr.error(this.mCursos?.mensajes ? this.mCursos.mensajes.ERROR_ELIMINAR_CURSO : Constants.ERROR_ELIMINAR_CURSO);
    }
    );
  }

  public handleFileInput(event, tipoArchivo): void {
    const files = event.target.files;
    let numeroArchivos;
    let tiposValidos;
    let formatoInvalido;

    switch (tipoArchivo) {
      case 'documentos':
        numeroArchivos = this.documentosCargados.length;
        tiposValidos = Constants.tiposDocumentosValidos;
        formatoInvalido = this.mCursos?.mensajes ? this.mCursos.mensajes.FORMATO_DOCUMENTOS_INVALIDO
                        : Constants.FORMATO_DOCUMENTOS_INVALIDO;
        break;
      case 'imagenes':
        numeroArchivos = this.imagenesCargadas.length;
        tiposValidos = Constants.tiposImagenesValidas;
        formatoInvalido = this.mCursos?.mensajes ? this.mCursos.mensajes.FORMATO_IMAGEN_INVALIDO : Constants.FORMATO_IMAGEN_INVALIDO;
        break;
      case 'videos':
        numeroArchivos = this.videosCargados.length;
        tiposValidos = Constants.tiposVideosValidos;
        formatoInvalido = this.mCursos?.mensajes ? this.mCursos.mensajes.FORMATO_VIDEOS_INVALIDO : Constants.FORMATO_VIDEOS_INVALIDO;
        break;
    }
    if (files && files.length > 0) {
      if (files.length + numeroArchivos <= 5) {
        let error = false;
        for (const file of files) {
          const fileSize = file.size / 1024 / 1024; // in MB
          if (fileSize > 5) {
            this.toastr.info(this.mCursos?.mensajes ? this.mCursos.mensajes.TAMANO_SUPERADO : Constants.TAMANO_SUPERADO);
            error = true;
            break;
          }
          if (!tiposValidos.includes(file.type)) {
            error = true;
            this.toastr.info(formatoInvalido);
            break;
          }
        }
        if (error) {
          return;
        }
        for (const file of files) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.handleReaderLoaded(e, file, tipoArchivo);
          };
          reader.readAsBinaryString(file);
        }
      }
      else {
        this.toastr.info(this.mCursos?.mensajes ? this.mCursos.mensajes.NUMERO_MAXIMO_ARCHIVO_5 : 'Puede cargar máximo 5 archivos.');
      }
    }
    else {
      this.toastr.info(this.mCursos?.mensajes ? this.mCursos.mensajes.SELECCIONE_ARCHIVO : 'Por favor seleccione un archivo.');
    }
  }


  obtenerNombreEnlace(url: string): string {
    return url.split('/').pop();
  }

  nameIsEmpty(): boolean {
    if (this.curso.name.toString().trim() === '') {
      return true;
    } else {
      return false;
    }
  }


  placeIsEmpty(): boolean {
    if (this.curso.place === '') {
      return true;
    } else {
      return false;
    }
  }

  typeIsEmpty(): boolean {

    if (this.curso.type.id === 0) {
      return true;
    }
    else {
      return false;

    }
  }
  countryIsEmpty(): boolean {

    if (this.curso.country.id === 0) {
      return true;
    }
    else {
      return false;

    }
  }


  fechaIniEsMayor(): boolean {
    if (this.curso.startDate > this.curso.endDate) {
      return true;
    } else {
      return false;
    }
  }
  handleReaderLoaded(readerEvt, fileToUpload, tipoArchivo): void {
    const binaryString = readerEvt.target.result;
    if (binaryString === '') {
      this.toastr.info(this.mCursos?.mensajes ? this.mCursos.mensajes.ARCHIVO_VACIO_MSJ.toString().replace('_MENSAJE_', fileToUpload.name)
        : `Archivo ${fileToUpload.name} esta vacio, validar contenido del archivo.`);
    } else {
      const multimedia: RecursosMultimedia = {
        id: 0,
        path: '',
        tipoMultimedia: fileToUpload.type,
        nombreRecurso: fileToUpload.name,
        base64: btoa(binaryString),
        tipoContenido: tipoArchivo
      };

      this.curso.multimedia.push(multimedia);
      switch (tipoArchivo) {
        case 'documentos':
          this.documentosCargados.push({
            tipoMultimedia: fileToUpload.type,
            nombreRecurso: fileToUpload.name
          });
          break;
        case 'imagenes':
          this.imagenesCargadas.push({
            tipoMultimedia: fileToUpload.type,
            nombreRecurso: fileToUpload.name
          });
          break;
        case 'videos':
          this.videosCargados.push({
            tipoMultimedia: fileToUpload.type,
            nombreRecurso: fileToUpload.name
          });
          break;
      }
      this.toastr.info(this.mCursos?.mensajes
        ? this.mCursos.mensajes.ARCHIVO_AGREGADO.toString().replace('_MENSAJE_', fileToUpload.name)
        : `Archivo ${fileToUpload.name} agregado.`);
    }
  }

  cargarPais(event): void {
    this.curso.country = event;
  }


  cargarTipo(event): void {
    this.curso.type = event;
  }

  quitarRecurso(nombreRecurso, tipoArchivo): void {
    switch (tipoArchivo) {
      case 'documentos':
        this.documentosCargados = this.documentosCargados.filter(
          documento => documento.nombreRecurso !== nombreRecurso
        );
        break;
      case 'imagenes':
        this.imagenesCargadas = this.imagenesCargadas.filter(imagen => imagen.nombreRecurso !== nombreRecurso);
        break;
      case 'videos':
        this.videosCargados = this.videosCargados.filter(video => video.nombreRecurso !== nombreRecurso);
        break;
      case 'enlaces':
        this.enlacesList = this.enlacesList.filter(enlace => enlace.nombreRecurso !== nombreRecurso);
    }
    this.curso.multimedia = this.curso.multimedia.filter(
      (recurso) => recurso.nombreRecurso !== nombreRecurso
    );
  }

  getEnlaces(recursos: Array<Recurso>): void {
    recursos.forEach(obj => {
      switch (obj.resourceTypeId.description) {
        case 'Documentos':
          this.documentosCargados.push({
            tipoMultimedia: obj.resourceTypeId.description,
            nombreRecurso: obj.path
          });
          break;
        case 'Imagenes':
          this.imagenesCargadas.push({
            tipoMultimedia: obj.resourceTypeId.description,
            nombreRecurso: obj.path
          });
          break;
        case 'Videos':
          this.videosCargados.push({
            tipoMultimedia: obj.resourceTypeId.description,
            nombreRecurso: obj.path
          });
          break;
        case 'Enlaces':
          this.enlacesList.push({
            tipoMultimedia: obj.resourceTypeId.description,
            nombreRecurso: obj.path
          });
          break;
      }
    });
  }

  agregarEnlace(enlace: string): void {
    this.enlacesList.push({ nombreRecurso: enlace });
    this.enlaces = '';
  }

  obtenerFechaUTC(fecha: Date): Date {
    try {
      return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 0, 0, 0);
    } catch (error) {
      return new Date();
    }
  }
}
