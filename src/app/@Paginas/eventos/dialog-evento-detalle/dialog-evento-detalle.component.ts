import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Evento } from '../../../modelos/evento';
import { ToastrService } from 'ngx-toastr';
import {Constants} from '../../../common/constants';
import {Recurso} from '../../../modelos/recurso';
import {LenguajeService} from '../../../servicios/lenguaje.service';
@Component({
  selector: 'app-dialog-evento-detalle',
  templateUrl: './dialog-evento-detalle.component.html',
  styleUrls: ['./dialog-evento-detalle.component.scss']
})

export class DialogEventoDetalleComponent implements OnInit {
  evento: Evento;
  title: string;
  agrandaImagen = false;
  urlImagen: string;
  recursos: Array<Recurso> = [];
  idioma: string;
  textos: any = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private lenguajeService: LenguajeService,
    private toastrService: ToastrService) {

    this.evento = data.evento;
    this.evento.startDate = new Date(this.evento.startDate).toISOString().slice(0, 10);
    this.evento.endDate = new Date(this.evento.endDate).toISOString().slice(0, 10);
    this.title = data.title;
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
  getEnlaces(recurso: Array<Recurso>): Array<Recurso> {
    return recurso.filter(r => r.resourceTypeId.description === 'Enlaces');
  }
  getImagen(recurso: Array<Recurso>): Array<Recurso> {
    const rec = recurso.filter(r => r.resourceTypeId.description === 'Imagenes');
    if (rec.length > 0) {
      return rec;
    }
  }
  agrandarImagen(urlImagen: string): void {
    this.urlImagen = urlImagen;
    this.agrandaImagen = true;
  }
  getCategoria(evento: Evento): string{
    const event = evento.categoryId.subDominio.filter( s => s.id === evento.categoryId.id);
    return event[0].description;
  }

}
