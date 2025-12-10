import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subdominio } from '../../../modelos/Subdominio';
import {Constants} from '../../../common/constants';
import {ToastrService} from 'ngx-toastr';
import {CabeceraService} from '../../../servicios/cabecera.service';
import {LenguajeService} from '../../../servicios/lenguaje.service';

@Component({
  selector: 'app-dialog-pregunta',
  templateUrl: './dialog-pregunta.component.html',
  styleUrls: ['./dialog-pregunta.component.scss']
})
export class DialogPreguntaComponent implements OnInit {
  formRespuesta: FormGroup;
  pregunta: Subdominio;
  dialogInfo: any = null;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private lenguajeService: LenguajeService,
    private cabeceraService: CabeceraService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<DialogPreguntaComponent>) { }

  ngOnInit(): void {
    this.cabeceraService.closeMenu.emit(true);
    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
          this.dialogInfo = texts;
        },
        () => {
          this.toastr.error(this.dialogInfo?.mensajes ? this.dialogInfo?.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
    this.pregunta = this.data.pregunta;
    this.formRespuesta = new FormGroup({
      respuesta: new FormControl('', [Validators.required])
    });
  }

  prepararRespuesta(data: any): void{
    const res = {
      mensaje: data.respuesta
    };
    this.dialogRef.close(res);
  }

}
