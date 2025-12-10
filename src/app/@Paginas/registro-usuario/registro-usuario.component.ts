import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { GenericoService } from '../../servicios/generico.service';
import { BannerService } from '../../servicios/banner.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogPreguntaComponent } from './dialog-pregunta/dialog-pregunta.component';
import { Pais } from '../../modelos/pais';
import { Idioma } from '../../modelos/idioma';
import { Dominio } from '../../modelos/dominio';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Constants } from '../../common/constants';
import { Usuario } from '../../modelos/usuario';
import { ToastrService } from 'ngx-toastr';
import { LenguajeService } from '../../servicios/lenguaje.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CabeceraService } from '../../servicios/cabecera.service';

@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.component.html',
  styleUrls: ['./registro-usuario.component.scss']
})
export class RegistroUsuarioComponent implements OnInit, OnDestroy {
  IMG_BANNER_REGISTRO =
    window.location.pathname + Constants.PATH_IMG_BANNER_REGISTRO;
  registroInfo: any = null;
  @ViewChild('selectPais') selectPais: ElementRef<HTMLElement>;
  registro: Usuario;
  pagina: number;
  paises = [];
  paisesList: Array<Pais> = [];
  idiomas = [];
  idiomasList: Array<Idioma> = [];
  preguntas = [];
  preguntasList: Array<Dominio> = [];
  formRegistro: FormGroup;
  mostrarError = false;
  contraseniaIgual = false;
  usuarioValido = false;
  respuestaValida = false;
  idioma: number;
  paisSelected = 0;
  paisNombreSelected: string;

  constructor(
    private genericoService: GenericoService,
    private bannerService: BannerService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private cabeceraService: CabeceraService,
    private lenguajeService: LenguajeService
  ) {}

  ngOnDestroy(): void {
    setTimeout(() => {
      this.bannerService.mostrarBanner(true);
    }, 0);
    this.pagina = 1;
  }

  ngOnInit(): void {
    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      this.idioma = this.lenguajeService.devolverIntIdioma(data);
    });
    this.formBuilder();
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['token'.toString()]) {
        this.obtenerUsuariosPorToken(params['token'.toString()]);
      }
    });

    this.cabeceraService.closeMenu.emit(true);
    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(
        texts => {
          this.registroInfo = texts;
        },
        () => {
          this.toastr.error(
            this.registroInfo?.mesajes
              ? this.registroInfo?.mesajes.MENSAJE_ERROR
              : Constants.MENSAJE_ERROR
          );
        }
      );
    });

    this.password.valueChanges.subscribe(data => {
      if (data.length > 0) {
        if (data === this.passwordConfirmacion.value) {
          this.contraseniaIgual = true;
        } else {
          this.contraseniaIgual = false;
        }
      }
    });
    this.passwordConfirmacion.valueChanges.subscribe(data => {
      if (data.length > 0) {
        if (data === this.password.value) {
          this.contraseniaIgual = true;
        } else {
          this.contraseniaIgual = false;
        }
      }
    });
    this.bannerService.mostrarBanner(false);
    this.pagina = 1;
    this.consultarIdiomas();
    this.consultarPreguntas();
  }

  get email(): AbstractControl {
    return this.formRegistro.get('email');
  }

  get password(): AbstractControl {
    return this.formRegistro.get('password');
  }

  get passwordConfirmacion(): AbstractControl {
    return this.formRegistro.get('passwordConfirmacion');
  }

  get idPais(): AbstractControl {
    return this.formRegistro.get('idPais');
  }

  get idIdioma(): AbstractControl {
    return this.formRegistro.get('idIdioma');
  }

  get idQuestionSecurity(): AbstractControl {
    return this.formRegistro.get('idQuestionSecurity');
  }

  get questionSecurity(): AbstractControl {
    return this.formRegistro.get('questionSecurity');
  }

  get terminos(): AbstractControl {
    return this.formRegistro.get('terminos');
  }

  formBuilder(): void {
    this.formRegistro = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(Constants.PATTERN_EMAIL)
      ]),
      idIdioma: new FormControl('', [Validators.required]),
      idPais: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(Constants.PASSWORD_PATTER)
      ]),
      passwordConfirmacion: new FormControl('', [
        Validators.required,
        Validators.pattern(Constants.PASSWORD_PATTER)
      ]),
      idQuestionSecurity: new FormControl('', [Validators.required]),
      questionSecurity: new FormControl(null, [Validators.required]),
      terminos: new FormControl(false, [Validators.required])
    });
  }

  getUsuarioCorreo(email: string): void {
    const url = `/usuario/validarUsuarioRegistro?email=${email}`;
    this.genericoService.get(url).subscribe(
      res => {
        if (res.message === '200') {
          this.registro = res.data;
          this.formRegistro.get('password').enable();
          this.formRegistro.get('passwordConfirmacion').enable();
        } else if (res.status === 'FORBIDDEN') {
          this.toastr.error(
            this.registroInfo?.mesajes
              ? this.registroInfo?.mesajes.USUARIO_YA_REGISTRADO
              : 'Usuario ya se encuentra registrado'
          );
          this.formRegistro.get('password').disable();
          this.formRegistro.get('passwordConfirmacion').disable();
        } else {
          this.toastr.error(
            this.registroInfo?.mesajes
              ? this.registroInfo?.mesajes.INVITACION_CADUCADA
              : 'Invitación no existe o ha caducado'
          );
          this.formRegistro.get('password').disable();
          this.formRegistro.get('passwordConfirmacion').disable();
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogPreguntaComponent, {
      data: {
        pregunta: this.preguntasList[0].subDominio.filter(
          s =>
            s.id.toString() ===
            this.formRegistro.get('idQuestionSecurity').value
        )
      },
      width: '80%',
      maxWidth: '860px',
      height: '466px'
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        if (res !== '') {
          this.formRegistro.get('questionSecurity').setValue(res.mensaje);
          this.respuestaValida = true;
        } else {
          this.respuestaValida = false;
        }
      } else {
        this.respuestaValida = false;
      }
    });
  }

  continuarRegistro(): void {
    this.pagina = 2;
  }

  consultarIdiomas(): void {
    const url = `/idioma/listarIdioma?page=0&size=100`;
    this.genericoService.get(url).subscribe(res => {
      this.idiomasList = res.data;
    });
  }

  consultarPreguntas(): void {
    const url = `${Constants.PATH_LISTAR_DOMINIO_NOMBRE_LANG}?nombre=Pregunta%20de%20Seguridad&idioma=${this.idioma}`;
    this.genericoService.get(url).subscribe(res => {
      if (res.message === '200') {
        this.preguntasList = res.data.dominio;
      }
    });
  }

  guardarRegistro(formData: any): void {
    if (formData.terminos) {
      const url = `/usuario/actualizarUsuario`;
      const req = {
        preguntaDTO: {
          answer: formData.questionSecurity,
          id: null,
          id_question: formData.idQuestionSecurity,
          id_user: this.registro.id,
          state: 'A'
        },
        usuarioGestionDTO: {
          approved: null,
          email: this.email.value,
          id: this.registro.id,
          idIdioma: formData.idIdioma,
          idPais: this.registro.pais.id,
          idRol: this.registro.rol.id,
          invitation_status: this.registro.invitation_status,
          invitatiton_sent: this.registro.invitation_sent,
          last_name: this.registro.last_name,
          name: this.registro.name,
          password: formData.password,
          state: this.registro.state
        }
      };
      this.genericoService.post(req, url).subscribe(res => {
        if (res.message === '200') {
          this.toastr.success(
            this.registroInfo?.mensajes
              ? this.registroInfo?.mensajes.USUARIO_REGISTRO_MSJ
              : 'Usuario ha sido registrado exitosamente'
          );
          this.route.navigate(['/']);
        }
      });
    }
  }

  validarTerminos(): boolean {
    const termino = this.terminos.value;
    return termino;
  }

  obtenerUsuariosPorToken(token: string): void {
    const urlToken = `${Constants.PATH_USUARIO_TOKEN}?token=${token}`;
    this.genericoService.get(urlToken).subscribe(respuesta => {
      if (respuesta.message === '200') {
        this.email.setValue(respuesta.data.email);
        this.email.disable();
        this.idPais.disable();
        this.getUsuarioCorreo(respuesta.data.email);
        this.paisSelected = respuesta.data.pais.id;
        this.paisNombreSelected = respuesta.data.pais.nombre;
        this.idPais.setValue(this.paisNombreSelected);
      }
    });
  }

  nombreIdiomaTraduccion(descripcion: string): any {
    try {
      if (this.registroInfo?.idiomas) {
        return this.registroInfo.idiomas[descripcion.trim()];
      } else {
        return descripcion;
      }
    } catch {
      return descripcion;
    }
  }
}
