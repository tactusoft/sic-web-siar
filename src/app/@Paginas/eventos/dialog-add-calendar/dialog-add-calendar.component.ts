import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Evento } from '../../../modelos/evento';
import { GoogleCalendar } from 'datebook';
import {Constants} from '../../../common/constants';
import { ToastrService } from 'ngx-toastr';
import {LenguajeService} from '../../../servicios/lenguaje.service';
@Component({
  selector: 'app-dialog-add-calendar',
  templateUrl: './dialog-add-calendar.component.html',
  styleUrls: ['./dialog-add-calendar.component.scss']
})

export class DialogAddCalendarComponent implements OnInit {
  evento: Evento;
  title: string;
  idioma: string;
  textos: any = null;

  constructor(@Inject
              (MAT_DIALOG_DATA) public data: any,
              private lenguajeService: LenguajeService,
              private toastrService: ToastrService
  ) {
    this.evento = data.evento;
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

  eventoAdd(evento: Evento): void{
    const googleCalendar = new GoogleCalendar({
      title: evento.title,
      location: evento.addres,
      description: evento.summary,
      start: new Date(evento.startDate),
      end: new Date(evento.endDate),
    });

    window.open(googleCalendar.render());
  }

}
