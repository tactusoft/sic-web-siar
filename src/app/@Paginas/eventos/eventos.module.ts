import { DialogAddCalendarComponent } from './dialog-add-calendar/dialog-add-calendar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { CardEventoComponent } from './card-evento/card-evento.component';
import { DialogEventoDetalleComponent } from './dialog-evento-detalle/dialog-evento-detalle.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventosRoutingModule } from './eventos-routing.module';
import { EventosComponent } from '../eventos/eventos.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { EliminarEventoDialogComponent } from './eliminar-evento-dialog/eliminar-evento-dialog.component';
import { DialogNuevoEventoComponent } from './dialog-nuevo-evento/dialog-nuevo-evento.component';
import {​​ MatDatepickerModule }​​ from '@angular/material/datepicker';
import {​​ MatNativeDateModule, MAT_DATE_LOCALE }​​ from '@angular/material/core';

@NgModule({
  declarations: [
    EventosComponent,
    CardEventoComponent,
    DialogEventoDetalleComponent,
    DialogAddCalendarComponent,
    EliminarEventoDialogComponent,
    DialogNuevoEventoComponent],
  imports: [
    CommonModule,
    EventosRoutingModule,
    MaterialModule,
    HttpClientModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    SvgIconsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    TranslateService,
  ],
  exports: [
    DialogEventoDetalleComponent,
    DialogAddCalendarComponent

  ]
})
export class EventosModule { }
