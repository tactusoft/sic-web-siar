import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Evento } from '../../../modelos/evento';
import { GenericoService } from '../../../servicios/generico.service';
import {Constants} from '../../../common/constants';
import { ToastrService } from 'ngx-toastr';
import {LenguajeService} from '../../../servicios/lenguaje.service';
@Component({
  selector: 'app-eliminar-evento-dialog',
  templateUrl: './eliminar-evento-dialog.component.html',
  styleUrls: ['./eliminar-evento-dialog.component.scss']
})
export class EliminarEventoDialogComponent implements OnInit {

  evento: Evento;
  idioma: string;
  textos: any = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private genericoService: GenericoService,
    private lenguajeService: LenguajeService,
    private toastrService: ToastrService,
    private dialogRef: MatDialogRef<EliminarEventoDialogComponent>) { }

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

    this.evento = this.data.evento;
  }

  eliminarEvento(): void{
    const url = `/gestion/eventos/eliminarEvento?idEvento=${this.evento.id}`;
    this.genericoService.delete(url).subscribe(
      res => {
        if (res){
          this.dialogRef.close(res);
        }
      });
  }

}
