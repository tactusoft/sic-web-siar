import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DialogEditarRespuestaComponent } from './dialog-editar-respuesta/dialog-editar-respuesta.component';
import { GenericoService } from '../../servicios/generico.service';
import { Usuario } from '../../modelos/usuario';
import { SubdominioDTO } from '../../clases/subdominioDTO';
import { Observable, Observer } from 'rxjs';
import { Recurso } from '../../modelos/recurso';
import { Router } from '@angular/router';
import {LenguajeService} from '../../servicios/lenguaje.service';
import {Constants} from '../../common/constants';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.scss']
})
export class EditarPerfilComponent implements OnInit {

  idUsrTemp = 4; // @b
  infoUsr = {
    id: null,
    name: '',
    last_name: '',
    email: '',
    password: '',
    pais: null,
    id_role: '',
    state: '',
    approved: null,
    idioma: null,
    invitation_status: '',
    invitation_sent: null,
    rol: null
  } as Usuario;

  newInfoUsr = {
    id: null,
    name: '',
    last_name: '',
    email: '',
    password: '',
    pais: null,
    id_role: '',
    state: '',
    approved: null,
    idioma: null,
    invitation_status: '',
    invitation_sent: null,
    rol: null
  } as Usuario;

  recursoUsr: Recurso;
  modificarActivo = false;
  nuevaContrasena = '';
  nuevaContrasenaConf = '';
  preguntasSeg: SubdominioDTO [] = [];
  preguntaSeleccionada = '';
  formEditar: FormGroup;
  mostrarError = false;
  contraseniaIgual = false;
  imagenPerfil = 'profile pic';
  desplegado = false;
  popActivo = false;
  respuesta: string;
  preguntaUsr = '';
  newPass = '';
  profileImgUrl = './assets/img/test64.jpeg';
  noQuestion = false;
  switched = false;
  count = -1;
  countSelect = 0;
  rolUsr = '';
  idPreguntaSeleccionada: number;
  idPreguntaOriginal: number;
  idRecurso: number;
  contrasenaRep = false;
  restaurarImagen = false;
  mostrarOpciones = false;
  pastUrl: string;
  imgBase64Path: any;
  exitImage = false;
  textos: any = null;
  idioma: number;


  constructor(
    public dialog: MatDialog,
    private lenguajeService: LenguajeService,
    private toastrService: ToastrService,
    private genericoService: GenericoService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.verificaLogin();

    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      this.idioma = this.lenguajeService.devolverIntIdioma(data);

      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
          this.textos = texts;
          this.formEditar = new FormGroup({
            approved: new FormControl(false),
            idPreguntaSeg: new FormControl(this.textos.editar_perfil.selecPregunta, Validators.required),
            contrasena: new FormControl('',  [Validators.required, Validators.pattern('^(?=.*[*#¿?!¡&$()%/+_.])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$'),
              Validators.maxLength(200)]),
            contrasenaConfirmacion: new FormControl('', [Validators.required, Validators.maxLength(3)])
          });

          this.contrasenaConfirmacion.valueChanges.subscribe(
            // tslint:disable-next-line:no-shadowed-variable
            data => {
              if (data.length > 0){
                if (data === this.contrasena.value){
                  this.contraseniaIgual = true;
                } else {
                  this.contraseniaIgual = false;
                }
              }
            }
          );
        },
        () => {
          this.toastrService.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });


    this.getPreugntasSeg();
    this.getInfoUsuario();
    this.dataURItoBlob('http://10.42.0.55/siar_pru/profilePics/profile_pic_4_20201103180618');

  }


  get contrasena(): any{
    return this.formEditar.get('contrasena');
  }

  get idPreguntaSeg(): any{
    return this.formEditar.get('idPreguntaSeg');
  }

  get contrasenaConfirmacion(): any{
    return this.formEditar.get('contrasenaConfirmacion');
  }

  verificaLogin(): void{
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario === null) {
      this.toastrService.error(this.textos?.mensajes ? this.textos.mensajes.INICIO_SESION_PREVIO_MSJ
            : 'Se debe iniciar sesión previamente');
      this.router.navigate(['']);
    }else {
      this.idUsrTemp = usuario.id;
    }
  }

  getPreugntasSeg(): void{
    const url = `${Constants.PATH_LISTAR_DOMINIO_NOMBRE_LANG}?nombre=Pregunta de Seguridad&idioma=${this.idioma}`;
    this.genericoService.get(url).subscribe(
      res => {
        this.preguntasSeg = res.data.dominio[0].subDominio;
      },
      error => {
        console.error(error);
      }
    );
  }

  getInfoUsuario(): void{
    const url = `/usuario/detalleUsuarioPregunta?id=${this.idUsrTemp}`;
    this.genericoService.get(url).subscribe(
      res => {
        this.infoUsr = res.data.usuarioDTO;
        this.rolUsr = this.infoUsr.rol.name;
        this.profileImgUrl = res.data.profileImage != null && res.data.profileImage.path != null ?
          res.data.profileImage.path : this.profileImgUrl;
        this.idRecurso = res.data.profileImage != null && res.data.profileImage.id != null ? res.data.profileImage.id : null;
        this.pastUrl = res.data.profileImage != null && res.data.profileImage.path != null ? res.data.profileImage.path : null;
        this.newInfoUsr = this.infoUsr;
        this.recursoUsr = res.data.profileImage;
        this.idPreguntaOriginal = res.data.preguntaDTO.id;
        this.preguntaUsr = this.preguntasSeg.find(pregunta => pregunta.id === res.data.preguntaDTO.id_question).description;
      },
      error => {
        console.error(error);
      }
    );
  }


  activarMod(): void{
    this.modificarActivo = !this.modificarActivo;
    this.formEditar.reset({
      idPreguntaSeg: this.textos.editar_perfil.selecPregunta,
      contrasena: '',
      contrasenaConfirmacion: ''
    });
    this.preguntaSeleccionada = '';
    this.respuesta = null;
  }

  openDialogModRespuesta(pregunta: string): void {
    this.preguntaSeleccionada = pregunta;
    // tslint:disable-next-line
    this.formEditar.controls['idPreguntaSeg'].setValue(this.preguntaSeleccionada);
    this.popActivo = true;
    const dialogRef = this.dialog.open(DialogEditarRespuestaComponent, {
      data: {
        preguntaSeleccionada: pregunta
      },
      width: '95%',
      maxWidth: '1132px'
    });

    dialogRef.afterClosed().subscribe(
      result => {
        this.popActivo = false;
        this.desplegado = false;
        this.respuesta = result;
        if (result){
          this.toastrService.success(this.textos?.mensajes ? this.textos.mensajes.RESPUESTA_ALMACENADA_MSJ : 'Respuesta almacenada exitosamente');
        }
      });
  }

  @HostListener('document:click', ['$event'])
  clickout(): void {
    this.desplegado = this.popActivo ? true : false;
    if (this.switched && this.count >= 0) {
      this.validaPreguntaSeg();
    }
    this.count ++;
  }

  openFileExplorer(): void {
    const input: HTMLElement = document.getElementById('imageInput') as HTMLElement;
    input.click();
  }

  onFileChange(fileInput): void {
    if (fileInput.target.files && fileInput.target.files[0]) {

      // Size Filter Bytes
      const maxSize = 5000000;
      console.log(fileInput.target.files[0].type);
      console.log(fileInput.target.files[0].size);


      if (fileInput.target.files[0].type !== 'image/png' && fileInput.target.files[0].type !== 'image/jpeg') {
        this.toastrService.error(this.textos?.mensajes ? this.textos?.mensajes.ARCHIVO_FORMATO_INVALIDO : 'Archivo no cumple con formato válido');
        return;
      }

      if (fileInput.target.files[0].size > maxSize) {
        this.toastrService.error(this.textos?.mensajes ? this.textos?.mensajes.TAMANO_SUPERADO : 'Imagen supera el tamaño permitido');
        return;
      }

      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.imgBase64Path = e.target.result;

        const imgBase64Path2 = reader.result.toString();

        const base64textString = btoa(this.imgBase64Path);

        console.log(1, this.imgBase64Path);
        console.log(2, imgBase64Path2);
        console.log(3, base64textString);

        const url = `/recursos/guardarImagenPerfil`;
        const req = {
          base64 : this.imgBase64Path,
          idUsr: this.idUsrTemp,
          idRecurso: this.idRecurso,
          confirmacion: this.restaurarImagen,
          recurso: this.recursoUsr
        };

        this.enviarImagen(req, url);
        this.getInfoUsuario();
      };

      reader.readAsDataURL(fileInput.target.files[0]);
      reader.readAsBinaryString(fileInput.target.files[0]);
    }
  }


  enviarImagen(req, url): Promise<any> {
    return new Promise((resolve) =>  {
      this.genericoService.post(req, url).subscribe(
        res => {
          if (res.message === '200'){
            this.profileImgUrl = res.data.path;
            this.recursoUsr = res.data;
            this.mostrarOpciones = !this.mostrarOpciones;
            this.exitImage = true;
          }
          resolve();
        }, error => {
          this.exitImage = false;
          this.mostrarOpciones = false;
          this.toastrService.error(this.textos?.mensajes ? this.textos.mensajes.ERROR_CARGA_IMG : 'Error al cargar la imagen');
          console.error(error);
          resolve();
        }
      );
    });
  }

  guardarCambios(formData: any): void{

    const url = `/usuario/actualizarPerfil`;
    const req = {
      preguntaDTO : {
        answer: this.respuesta,
        id: this.idPreguntaOriginal,
        id_question: this.idPreguntaSeleccionada,
        id_user: this.infoUsr.id,
        state: 'A'
      },
      usuarioGestionDTO: {
        approved: this.infoUsr === null ? null : this.infoUsr.approved,
        email: this.infoUsr === null ? null : this.infoUsr.email,
        id: this.infoUsr === null ? null : this.infoUsr.id,
        idIdioma: this.infoUsr.idioma === null ? null : this.infoUsr.idioma.id,
        idPais: this.infoUsr.pais === null ? null : this.infoUsr.pais.id,
        idRol: this.infoUsr.rol === null ? null : this.infoUsr.rol.id,
        invitation_status: this.infoUsr === null ? null : this.infoUsr.invitation_status,
        invitatiton_sent: this.infoUsr === null ? null : this.infoUsr.invitation_sent,
        last_name: this.infoUsr === null ? null : this.infoUsr.last_name,
        name: this.infoUsr === null ? null : this.infoUsr.name,
        password: formData.contrasena,
        state: this.infoUsr.state,
      }
    };

    this.genericoService.post(req, url).subscribe(
      res => {
        if (res.message === '200'){
          this.activarMod();
          this.countSelect = 0;
          this.toastrService.success(this.textos?.mensajes ? this.textos?.mensajes.ACT_INFO_EXITOSA_MSJ : 'Se ha actualizado la información exitosamente');
        }
      }, error => {
        console.error(error);
      });
  }

  obtenerIdPregunta(): void{
    this.idPreguntaSeleccionada = this.preguntasSeg.find(pregunta => pregunta.description === this.preguntaSeleccionada).id;
  }

  validaPreguntaSeg(): void{
    this.noQuestion = this.preguntaSeleccionada === '' && !this.switched === false && this.desplegado === false
    && this.countSelect > 0 ? true : false;
  }

  dataURItoBlob(dataURI: string): Observable<Blob> {
    return new Observable((observer: Observer<Blob>) => {
      const byteString: string = window.atob(dataURI);
      const arrayBuffer: ArrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array: Uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([int8Array], { type: 'image/jpeg' });
      observer.next(blob);
      observer.complete();
    });
  }

  validarContrasenaRep(): void{
    const url = `/usuario/validarContrasenaRep?id=${this.idUsrTemp}&newPass=${this.formEditar.get('contrasena').value}`;
    if (this.formEditar.get('contrasena').errors === null) {
      this.genericoService.get(url).subscribe(
        res => {
          if (res.data === true) {
            this.contrasenaRep = true;
          }else{
            this.contrasenaRep = false;
          }
        },
        error => {
          console.error(error);
        }
      );
    }
  }

  async restaurarImagenPerfil(): Promise<void>{
    this.restaurarImagen = false;
    const url = `/recursos/guardarImagenPerfil`;
    const req = {
      base64 : null,
      idUsr: this.idUsrTemp,
      idRecurso: this.idRecurso,
      confirmacion: this.restaurarImagen,
      recurso: this.recursoUsr
    };
    await this.enviarImagen(req, url);
    this.getInfoUsuario();
  }

  async conservarImagenPerfil(): Promise<void>{
    this.restaurarImagen = true;
    const url = `/recursos/guardarImagenPerfil`;
    const req = {
      base64 : this.imgBase64Path,
      idUsr: this.idUsrTemp,
      idRecurso: this.idRecurso,
      confirmacion: this.restaurarImagen,
      recurso: this.recursoUsr
    };
    await this.enviarImagen(req, url);
    this.getInfoUsuario();
    if (this.exitImage) {
      this.toastrService.success(this.textos?.mensajes ? this.textos?.mensajes?.IMAGEN_MODIF_MSJ : 'Imagen de perfil modificada!');
    }
  }

}
