import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import {Constants} from '../../../common/constants';
import {LenguajeService} from '../../../servicios/lenguaje.service';

@Component({
  selector: 'app-dialog-editar-respuesta',
  templateUrl: './dialog-editar-respuesta.component.html',
  styleUrls: ['./dialog-editar-respuesta.component.scss']
})
export class DialogEditarRespuestaComponent implements OnInit {

  preguntaSeleccionada: string;
  respuesta: string;
  idioma: string;
  textos: any = null;

  constructor(
    public dialog: MatDialog,
    private lenguajeService: LenguajeService,
    private toastrService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogEditarRespuestaComponent>
  ) {
    this.preguntaSeleccionada = data.preguntaSeleccionada;
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
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
