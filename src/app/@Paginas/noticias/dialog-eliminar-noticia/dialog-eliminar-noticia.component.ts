import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Noticia } from '../../../modelos/noticia';
import { GenericoService } from '../../../servicios/generico.service';
import { ToastrService } from 'ngx-toastr';
import {CabeceraService} from '../../../servicios/cabecera.service';
import {LenguajeService} from '../../../servicios/lenguaje.service';
import {Constants} from '../../../common/constants';

@Component({
  selector: 'app-dialog-eliminar-noticia',
  templateUrl: './dialog-eliminar-noticia.component.html',
  styleUrls: ['./dialog-eliminar-noticia.component.scss']
})
export class DialogEliminarNoticiaComponent implements OnInit {

  noticia: Noticia;
  eliminarNotiInfo: any = null;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cabeceraService: CabeceraService,
    private lenguajeService: LenguajeService,
    private genericoService: GenericoService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<DialogEliminarNoticiaComponent>
  ) { }

  ngOnInit(): void {
    this.cabeceraService.closeMenu.emit(true);
    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
          this.eliminarNotiInfo = texts;
        },
        () => {
          this.toastr.error(this.eliminarNotiInfo ? this.eliminarNotiInfo.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
    this.noticia = this.data.noticia;
  }

  eliminarNoticia(): void{
    const url = `/noticias/eliminarNoticia?id=${this.noticia.id}`;
    this.genericoService.get(url).subscribe(
      res => {
        if (res.message === '200') {
          this.dialogRef.close(true);
        }
      });
  }

}
