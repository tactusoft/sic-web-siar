import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../../material.module';
import { SincronizacionAlertasRoutingModule } from './sincronizacion-alertas-routing.module';
import { SincronizacionAlertasComponent } from './sincronizacion-alertas.component';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogGestionSincronizacionComponent } from './dialog-gestion-sincronizacion/dialog-gestion-sincronizacion.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { TablaPaisComponent } from './tabla-pais/tabla-pais.component';
import { TablaCategoriaComponent } from './tabla-categoria/tabla-categoria.component';
import { TablaPloblemasReportadosComponent } from './tabla-ploblemas-reportados/tabla-ploblemas-reportados.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';


@NgModule({
  declarations: [SincronizacionAlertasComponent, DialogGestionSincronizacionComponent,
                TablaPaisComponent, TablaCategoriaComponent, TablaPloblemasReportadosComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    SincronizacionAlertasRoutingModule,
    ReactiveFormsModule,
    SvgIconsModule,
    NgxPaginationModule,
    TranslateModule
  ],
  providers : [
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    TranslateService
  ]
})
export class SincronizacionAlertasModule { }
