import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Constants } from '../../common/constants';
import { Encrypt } from '../../common/encrypt';
import { GenericoService } from '../../servicios/generico.service';
import { LoginDTO } from '../../modelos/loginDTO';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogBloqueoUsuarioComponent } from './dialog-bloqueo-usuario/dialog-bloqueo-usuario.component';
import { CabeceraService } from '../../servicios/cabecera.service';
import { LoginService } from '../../servicios/login.service';
import {LenguajeService} from '../../servicios/lenguaje.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  // Constantes
  IMG_BANNER_LOGIN = window.location.pathname + Constants.PATH_IMG_BANNER_LOGIN;
  infoLogin: any = null;
  infoLoginMensajes: any = null;
  iconoUsuario = Constants.ICON_USUARIO;
  iconoContrasena = Constants.ICON_CONTRASENA;
  // Variables
  formularioLogin: FormGroup;
  submit: boolean;
  logueoInvalido: boolean;
  mensajeErrorLogueo: string;
  private encrypt: Encrypt = new Encrypt();
  private onDestroy = new Subject<void>();
  olvidoPass = false;

  constructor(private formBuilder: FormBuilder,
              private lenguajeService: LenguajeService,
              private router: Router,
              private toastr: ToastrService,
              public dialog: MatDialog,
              private genericoService: GenericoService,
              private cabeceraService: CabeceraService,
              private loginService: LoginService,
              iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('iconoUsuario', sanitizer.bypassSecurityTrustResourceUrl(this.iconoUsuario));
    iconRegistry.addSvgIcon('iconoContrasena', sanitizer.bypassSecurityTrustResourceUrl(this.iconoContrasena));
  }

  // Funciones para usar las validaciones del formulario
  get usuario(): any { return this.formularioLogin.get('usuario'); }
  get contrasena(): any { return this.formularioLogin.get('contrasena'); }
  get recordar(): any { return this.formularioLogin.get('recordar'); }


  ngOnInit(): void {
    this.cabeceraService.closeMenu.emit(true);
    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
          this.infoLogin = texts;
          this.infoLoginMensajes = texts?.mensajes;
        },
        () => {
          this.toastr.error(this.infoLoginMensajes ? this.infoLoginMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
    this.builderForm();
    this.validarRecordatorioSesion();
    this.loginService.olvidoContrasena.subscribe(value => {
      this.olvidoPass = value;
    });
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  builderForm(): void {
    this.formularioLogin = this.formBuilder.group({
      usuario: ['', [Validators.required, Validators.pattern(Constants.PATTERN_EMAIL)]],
      contrasena: new FormControl('', [Validators.required]),
      recordar: new FormControl(false, [Validators.required])
    });
  }

  ingresar(): void {
    this.submit = true;
    if (this.formularioLogin.valid) {
      this.iniciarSesion();
    }
  }

  iniciarSesion(): void {
    const login: LoginDTO = {
      email: this.formularioLogin.get('usuario').value,
      contrasena: this.formularioLogin.get('contrasena').value
    };
    this.autenticarUsuario(login);
  }

  recordarCrecenciales(recordar: boolean, credenciales: LoginDTO): void {
    if (recordar) {
      localStorage.setItem('credenciales', JSON.stringify(this.encrypt.encryptObject(JSON.stringify(credenciales))));
    } else {
      localStorage.removeItem('credenciales');
    }
  }

  guardarLocalStorage(llave: string, valor: string): void {
    localStorage.setItem(llave, valor);
  }

  validarRecordatorioSesion(): void {
    if (localStorage.getItem('credenciales')) {
      const login = JSON.parse(this.encrypt.decryptObject(JSON.parse(localStorage.getItem('credenciales'))));
      this.formularioLogin.controls.usuario.setValue(login.email);
      this.formularioLogin.controls.contrasena.setValue(login.contrasena);
      this.formularioLogin.controls.recordar.setValue(true);
    }
  }

  /*** Web Services Method ****/

  autenticarUsuario(login: LoginDTO): void {
    this.genericoService.post(login, Constants.PATH_LOGIN).subscribe((respuestaLogin: any) => {
      if (respuestaLogin.success) {
        this.recordarCrecenciales(this.formularioLogin.get('recordar').value, login);
        localStorage.setItem('token', JSON.stringify(respuestaLogin.data));
        this.obtenerDataUsuario(login.email);
        this.router.navigate(['']);
      } else {
        this.logueoInvalido = true;
        this.contrasena.reset();
        switch (respuestaLogin.status) {
          case Constants.NO_CONTENT: {
            this.mensajeErrorLogueo =  this.infoLogin?.login?.usuario_no_existe ? this.infoLogin.login.usuario_no_existe : 'Usuario no existente';
            break;
          } case Constants.LOCKED: {
            this.mensajeErrorLogueo = this.infoLogin?.login?.usuario_bloqueado ? this.infoLogin.login.usuario_bloqueado : 'Usuario bloqueado';
            this.notificarBloqueo(new Date(respuestaLogin.data.fechaBloqueo), new Date(respuestaLogin.data.fechaSistema));
            break;
          } case Constants.FORBIDDEN: {
            this.mensajeErrorLogueo =  this.infoLogin?.login?.clave_invalida ? this.infoLogin.login.clave_invalida : 'Contraseña Inválida';
            break;
          } case Constants.INTERNAL_SERVER_ERROR: {
            if (respuestaLogin.message === '500') {
              console.log('Error::', respuestaLogin.message);
              this.toastr.error(this.infoLoginMensajes ? this.infoLoginMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR, '¡Error', {
                closeButton: true,
                titleClass: 'toast-tittle-error'
              });
            } else {
              this.mensajeErrorLogueo = respuestaLogin.message;
            }
            break;
          } default: {
            this.toastr.error(this.infoLoginMensajes ? this.infoLoginMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR, '¡Error', {
              closeButton: true,
              titleClass: 'toast-tittle-error'
            });
            break;
          }
        }
      }
    }, (error: any) => {
      console.log('Error::', error);
      this.toastr.error(this.infoLoginMensajes ? this.infoLoginMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR, '¡Error', {
        closeButton: true,
        titleClass: 'toast-tittle-error'
      });
    });
  }

  notificarBloqueo(fechaBloqueo: Date, fechaSistema: Date): void {
    console.log('Fecha Actual::', fechaSistema);
    console.log('Fecha Bloqueo::', fechaBloqueo);

    if (fechaBloqueo.getTime() <= fechaSistema.getTime() || this.compararFechas(fechaBloqueo, fechaSistema)) {
      const segundosContador  = fechaBloqueo.getTime() === fechaSistema.getTime()
                              && this.compararFechas(fechaBloqueo, fechaSistema)
                              ? 0
                              : Constants.SEGUNDOS_BLOQUEO - Math.abs((fechaSistema.getTime() - fechaBloqueo.getTime()) / 1000);
      const dialogRef = this.dialog.open(DialogBloqueoUsuarioComponent, {
        panelClass: 'mat-dialog-bloqueo-login',
        data: {
          segundos: segundosContador <= 0 ? Constants.SEGUNDOS_BLOQUEO : segundosContador,
        }
      });
      dialogRef.afterClosed();
    } else {
      return;
    }
  }

  obtenerDataUsuario(email: string): void {
    const url = `${Constants.PATH_GET_DETALLE_USR_EMAIL}${email}`;
    this.genericoService.get(url).subscribe(res => {
      if (res.message === '200') {
        delete res.data.password;
        this.guardarLocalStorage('usuario', JSON.stringify(res.data));
        this.cabeceraService.userLogged.emit(true);
        if (res.data.recovery_pass === 'R') {
          let localURL = window.location.href;
          localURL = String(localURL).slice(0, localURL.lastIndexOf('/'));
          const message = Constants.RECUERDA_CAMBIO_CONTRASENA
                      .replace('replaceURL', localURL)
                      .replace('MENSAJE', this.infoLoginMensajes
                                ? this.infoLoginMensajes.MSJ_RECUERDA_CAMBIO_CONTRASENA
                                : Constants.MSJ_RECUERDA_CAMBIO_CONTRASENA);
          console.log(message);
          this.toastr.warning(message, '', {
            enableHtml: true,
            closeButton: true,
            disableTimeOut: true
          });
        }
      }
    });
  }

  compararFechas(fechaBloqueo: Date, fechaActual: Date): boolean {
    fechaBloqueo.setSeconds(0, 0);
    fechaActual.setSeconds(0, 0);
    return Date.parse(fechaBloqueo.toDateString()) === Date.parse(fechaActual.toDateString());
  }
}
