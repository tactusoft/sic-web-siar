import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GenericoService } from 'src/app/servicios/generico.service';
import { Constants } from '../../../common/constants';
import { LenguajeService } from '../../../servicios/lenguaje.service';

@Component({
  selector: 'app-suscripcion',
  templateUrl: './suscripcion.component.html',
  styleUrls: ['./suscripcion.component.scss']
})
export class SuscripcionComponent implements OnInit {
  IMG_BANNER_SUSCRIPCION = window.location.pathname + Constants.PATH_IMG_BANNER_SUSCRIPCION;
  emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  formSuscripcion: FormGroup;
  textos: any;
  textosMensajes: any = null;

  constructor(
    private toastr: ToastrService,
    private lenguajeService: LenguajeService,
    private genericoService: GenericoService,
  ) { }

  ngOnInit(): void {
    this.lenguajeService.idiomaSubject.subscribe(data => {
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
        this.textos = texts;
        this.textosMensajes = texts?.mensajes;
      }, () => {
        this.toastr.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
      });
    });
    this.formSuscripcion = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
    });
  }

  get email(): any {
    return this.formSuscripcion.get('email');
  }

  suscribirBoletin(): void {
    this.accionBoletin(Constants.PATH_SUSCRIBIR_BOLETIN);
  }

  cancelarBoletin(): void {
    this.accionBoletin(Constants.PATH_CANCELAR_SUSCRIBIR_BOLETIN);
  }

  accionBoletin(url): void {
    if (this.formSuscripcion.valid) {
      const req = { email: this.email.value };
      this.genericoService.post(req, url).subscribe(res => {
        if (res.message === '200') {
          this.toastr.success(this.textosMensajes ? this.textosMensajes.MSJ_OPE_REALIZADA : Constants.MSJ_OPE_REALIZADA);
          // tslint:disable-next-line
          this.formSuscripcion.controls['email'].setValue(null);
        } else {
          this.toastr.warning(this.textos ? this.textos.boletines.suscripcion.correo_existe : Constants.MENSAJE_ERROR);
        }
      });
    }
  }


}
