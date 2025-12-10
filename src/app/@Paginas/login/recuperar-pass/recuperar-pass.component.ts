import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Constants } from '../../../common/constants';
import { GenericoService } from '../../../servicios/generico.service';
import { CabeceraService } from '../../../servicios/cabecera.service';
import { LenguajeService } from '../../../servicios/lenguaje.service';

@Component({
  selector: 'app-recuperar-pass',
  templateUrl: './recuperar-pass.component.html',
  styleUrls: ['./recuperar-pass.component.scss']
})
export class RecuperarPassComponent implements OnInit {
  recuperarInfo: any = null;
  recuperarInfoMensajes: any = null;
  submit: boolean;
  formularioLogin: FormGroup;
  esValido = false;
  CORREO = 'correo';
  publicRecaptchaKey = Constants.KEY_CAPTCHA;

  constructor(
    private formBuilder: FormBuilder,
    private genericoService: GenericoService,
    private toastr: ToastrService,
    private cabeceraService: CabeceraService,
    private lenguajeService: LenguajeService
  ) { }
  // Funciones para usar las validaciones del formulario
  get correo(): any { return this.formularioLogin.get('correo'); }
  get recaptcha(): any { return this.formularioLogin.get('recaptcha'); }


  ngOnInit(): void {
    this.cabeceraService.closeMenu.emit(true);
    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
        this.recuperarInfo = texts;
        this.recuperarInfoMensajes = texts?.mensajes;
      },
        () => {
          this.toastr.error(this.recuperarInfoMensajes ? this.recuperarInfoMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
    this.builderForm();
  }

  builderForm(): void {
    this.formularioLogin = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.pattern(Constants.PATTERN_EMAIL)]],
      recaptcha: ['', [Validators.required]]
    });
  }

  ingresar(): void {
    this.submit = true;
    if (this.formularioLogin.valid) {
      const correoIn = this.formularioLogin.get('correo').value;
      const url = `/usuario/validaRecaptcha`;
      const req = {
        correo: correoIn,
        recaptcha: this.formularioLogin.get('recaptcha').value
      };
      this.genericoService.post(req, url).subscribe(res => {
        if (res.message === '200') {
          this.toastr.info(this.recuperarInfoMensajes
                            ? this.recuperarInfo.mensajes.MENSAJE_RECUPERACION_CONTRASENA_OK
                            : Constants.MENSAJE_RECUPERACION_CONTRASENA_OK);
        } else if (res.message === '403') {
          // Cuando no esta registrado
          this.formularioLogin.controls[this.CORREO].setErrors({ nomatch: true });
        } else if (res.message === '406') {
          // Cuando esta registrado y no tiene pass
          this.formularioLogin.controls[this.CORREO].setErrors({ nomatch: true });
        } else if (res.message === '412') {
          // Cuando reCaptcha no es válido
          this.toastr.warning(this.recuperarInfoMensajes
            ? this.recuperarInfo.mensajes.MENSAJE_CAPTCHA_FALLO : Constants.MENSAJE_CAPTCHA_FALLO);
        } else {
          this.toastr.error(this.recuperarInfoMensajes ? this.recuperarInfo.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        }
      });
    }
  }

  consultarCorreo(): void {
    if (this.correo.valid) {
      const correo = this.formularioLogin.get('correo').value;
      const url = `/usuario/detalleUsuarioEmail?email=${correo}`;
      this.genericoService.get(url).subscribe(res => {
        if (res.message === '200') {
          this.esValido = true;
        } else if (res.message === '204') {
          this.formularioLogin.controls[this.CORREO].setErrors({ nomatch: true });
        }
      });
    }
  }
}
