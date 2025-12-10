import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { CalendarioRoutingModule } from './calendario-routing.module';
import { CalendarioComponent } from '../calendario/calendario.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SvgIconsModule } from '@ngneat/svg-icon';

import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import { MapaEventosComponent } from '../eventos/mapa-eventos/mapa-eventos.component';
import { MaterialModule } from '../../material.module';


FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [CalendarioComponent, MapaEventosComponent],
  imports: [
    CommonModule,
    CalendarioRoutingModule,
    HttpClientModule,
    TranslateModule,
    SvgIconsModule,
    MaterialModule,
    FullCalendarModule
  ],
  providers: [
    TranslateService,
    DatePipe
  ]
})
export class CalendarioModule { }
