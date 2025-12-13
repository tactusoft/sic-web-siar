import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { GestionBoletinService } from '../gestion-boletin.service';
import { ToastrService } from 'ngx-toastr';
import { Constants } from '../../../common/constants';
import { GestionBoletin } from '../../../modelos/gestion-boletin';
import { GenericoService } from '../../../servicios/generico.service';
import { LenguajeService } from '../../../servicios/lenguaje.service';

@Component({
  selector: 'app-dialog-eliminar',
  templateUrl: './dialog-eliminar.component.html',
  styleUrls: ['./dialog-eliminar.component.scss']
})
export class DialogEliminarComponent implements OnInit {
  boletin: GestionBoletin;
  idioma: string;
  textos: any = null;
  textosMensajes: any = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private genericoService: GenericoService,
              private toastr: ToastrService,
              private toastrService: ToastrService,
              private lenguajeService: LenguajeService,
              public dialogRef: MatDialogRef<DialogEliminarComponent>,
              private gestionService: GestionBoletinService) {
    this.boletin = data;
  }

  ngOnInit(): void {

    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {

      this.idioma = data;

      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(this.idioma).subscribe(texts => {
        this.textos = texts;
        this.textosMensajes = texts?.mensajes;
      },
        () => {
          this.toastrService.error(this.textosMensajes ? this.textosMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
  }

  eliminarBoletin(): void {
    const url = Constants.PATH_ELIMINAR_BOLETIN;
    this.genericoService.post(this.boletin, url).subscribe(res => {
      if (res.message === '200') {
        this.toastr.success(this.textosMensajes ? this.textosMensajes.MSJ_OPE_REALIZADA : Constants.MSJ_OPE_REALIZADA);
        this.gestionService.recargarBoletines.emit(true);
      } else {
        this.toastr.error(this.textosMensajes ? this.textosMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
      }
      this.dialogRef.close();
    });
  }
}
