import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { GenericoService } from '../../../servicios/generico.service';
import { IngresAlertaService} from '../ingres-alerta.service';
import {Constants} from '../../../common/constants';
import { ToastrService } from 'ngx-toastr';
import {LenguajeService} from '../../../servicios/lenguaje.service';

@Component({
  selector: 'app-dialog-eliminar-alerta',
  templateUrl: './dialog-eliminar-alerta.component.html',
  styleUrls: ['./dialog-eliminar-alerta.component.scss']
})
export class DialogEliminarAlertaComponent implements OnInit {

  alerta: any;
  idioma: string;
  textos: any = null;
  textosMensajes: any = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private genericoService: GenericoService,
              private toastr: ToastrService,
              private lenguajeService: LenguajeService,
              public dialogRef: MatDialogRef<DialogEliminarAlertaComponent>,
              private gestionService: IngresAlertaService)
  {
    this.alerta = data;
    if (this.alerta.productOriginCountry && this.alerta.productOriginCountry[0]){
      this.alerta.productOriginCountry = [this.alerta.productOriginCountry[0].id];
    }
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
          this.toastr.error(this.textosMensajes ? this.textosMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
  }
  eliminarAlerta(): void {
    const url = Constants.PATH_ELIMINAR_ALERTA;
    const req = {
      alerta: this.alerta,
      galeria: [],
      adjuntos: []
    };
    this.genericoService.post(req, url).subscribe( res => {
      if (res.message === '200'){
        this.toastr.success(this.textosMensajes ? this.textosMensajes.MSJ_OPE_REALIZADA : Constants.MSJ_OPE_REALIZADA);
        this.gestionService.recargarLista.emit(true);
      }else{
        this.toastr.error(this.textosMensajes ? this.textosMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
      }
      this.dialogRef.close();
    });
  }
}
