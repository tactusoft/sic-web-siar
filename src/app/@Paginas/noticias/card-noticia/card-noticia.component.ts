import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogNoticiaDetalleComponent } from '../dialog-noticia-detalle/dialog-noticia-detalle.component';
import { DialogEliminarNoticiaComponent } from '../dialog-eliminar-noticia/dialog-eliminar-noticia.component';
import {Noticia} from '../../../modelos/noticia';
import {Recurso} from '../../../modelos/recurso';
import { Constants } from 'src/app/common/constants';
import { ToastrService } from 'ngx-toastr';
import { LenguajeService } from 'src/app/servicios/lenguaje.service';

@Component({
  selector: 'app-card-noticia',
  templateUrl: './card-noticia.component.html',
  styleUrls: ['./card-noticia.component.scss']
})
export class CardNoticiaComponent implements OnInit {
  @Input() idTipoSeccion;
  @Input() noticia: Noticia;
  @Input() administrar = false;
  @Input() listaPaises: any;

  @Output() editar = new EventEmitter<Noticia>();
  @Output() eliminar = new EventEmitter<Noticia>();
  paisesNoticia = '';
  idioma: number;
  textos: any;

  constructor(public dialog: MatDialog,
              private toastr: ToastrService,
              private lenguajeService: LenguajeService) { }

  ngOnInit(): void {    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      this.idioma = this.lenguajeService.devolverIntIdioma(data);
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
        this.textos = texts;
        this.anexarNombresPaises();
      }, () => {
        this.toastr.error(this.textos?.mensajes ? this.textos?.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
      });
    });
    this.anexarNombresPaises();
  }

  openDialog(noticia: Noticia): void {
    const dialogRef = this.dialog.open(DialogNoticiaDetalleComponent, {
      panelClass: 'dialog-noticia-detalle',
      data: {
        noticia,
        title: this.textos?.noticias ? this.textos?.noticias?.noticias_detalle : 'noticias-detalle',
        listaPaises: this.listaPaises
      }
    });

    dialogRef.afterClosed();
  }
  getImagenes(recurso: Array<Recurso>): string {
    const rec = recurso.filter(
      r => r.resourceTypeId.description === 'Imagenes'
    );
    if (rec.length > 0) {
      return rec[0].path;
    }
    return 'assets/img/noImagen.png';
  }

  anexarNombresPaises(): void {
    this.paisesNoticia = '';
    this.noticia.pais.length > 0
      ? this.noticia.pais.forEach((item, index) => {
          this.paisesNoticia += this.getDescripcionPais(item);
          if ((index < this.noticia.pais.length - 1) && (this.noticia.pais.length !== 1)) {
            this.paisesNoticia += ', ';
          } else {
            return;
          }
        })
      : (this.paisesNoticia = '');
  }

  edita(): void {
    this.editar.emit(this.noticia);
  }
  elimina(): void {
    this.eliminar.emit(this.noticia);
  }
  openDialogEliminarNoticia(noticia): void {
    const dialogRef = this.dialog.open(DialogEliminarNoticiaComponent, {
      data: noticia,
      width: '95%',
      maxWidth: '1132px'
    });

    dialogRef.afterClosed();
  }

  getDescripcionPais(pais: any): string {
    try {
      return this.listaPaises.find(item => item.id === pais.id).nombre.trim();
    } catch {
      return pais.nombre.trim();
    }
  }
}
