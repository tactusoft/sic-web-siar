import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertasRoutingModule } from './alertas-routing.module';
import { AlertasComponent } from '../alertas/alertas.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {  HttpClientModule } from '@angular/common/http';
import { TarjetaAlertaComponent } from './tarjeta-alerta/tarjeta-alerta.component';
import { MaterialModule } from '../../material.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { DialogAlertaComponent } from './dialog-alerta/dialog-alerta.component';
import { SvgIconsModule } from '@ngneat/svg-icon';
import {ReactiveFormsModule, FormsModule } from '@angular/forms';



@NgModule({
  declarations: [AlertasComponent, TarjetaAlertaComponent, DialogAlertaComponent],
  imports: [
    CommonModule,
    AlertasRoutingModule,
    HttpClientModule,
    TranslateModule,
    MaterialModule,
    NgxPaginationModule,
    SvgIconsModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    TranslateService
  ], exports: [
    DialogAlertaComponent
  ]
})
export class AlertasModule { }
