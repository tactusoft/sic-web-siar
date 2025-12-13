import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Noticia } from '../../../../modelos/noticia';
import { DialogNoticiaDetalleComponent } from '../../../noticias/dialog-noticia-detalle/dialog-noticia-detalle.component';
import { Recurso } from '../../../../modelos/recurso';
import { LenguajeService } from 'src/app/servicios/lenguaje.service';
import { ToastrService } from 'ngx-toastr';
import { Constants } from 'src/app/common/constants';
import { PaisesService } from 'src/app/servicios/paises.service';

@Component({
  selector: 'app-card-noticias',
  templateUrl: './card-noticias.component.html',
  styleUrls: ['./card-noticias.component.scss']
})
export class CardNoticiasComponent implements OnInit {

  @Input() noticia: Noticia;
  paisesNoticia = '';
  idioma: number;
  textos: any;

  constructor(public dialog: MatDialog,
              private toastr: ToastrService,
              private lenguajeService: LenguajeService,
              private paisesService: PaisesService) { }

  ngOnInit(): void {
    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      this.idioma = this.lenguajeService.devolverIntIdioma(data);
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
        this.textos = texts;
      }, () => {
        this.toastr.error(this.textos?.mensajes ? this.textos?.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
      });
    });

    this.paisesService.listaPaises.subscribe(() => {
      this.paisesNoticia = '';
      this.anexarNombresPaises();
    });

    this.anexarNombresPaises();
  }

  openDialog(noticia: Noticia): void {
    const dialogRef = this.dialog.open(DialogNoticiaDetalleComponent, {
      panelClass: 'dialog-noticia-detalle',
      data: {
        noticia,
        title: this.textos?.noticias ? this.textos?.noticias?.ultimas_noticias_detalle : 'ultimas-noticias-detalle',
        listaPaises: this.paisesService.listadoPaises
      },
      width: '80%'
    });

    dialogRef.afterClosed();
  }

  getImagenes(recurso: Array<Recurso>): string {
    const rec = recurso.filter(r => r.resourceTypeId.description === 'Imagenes');
    if (rec.length > 0) {
      return rec[0].path;
    }
    return 'assets/img/noImagen.png';
  }

  anexarNombresPaises(): void {
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

  getDescripcionPais(pais: any): string {
    try {
      return this.paisesService.listadoPaises.find(item => item.id === pais.id).nombre.trim();
    } catch {
      return pais.nombre.trim();
    }
  }
}
