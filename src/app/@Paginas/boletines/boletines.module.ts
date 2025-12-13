import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoletinesRoutingModule } from './boletines-routing.module';
import { BoletinesComponent } from './boletines.component';
import { BoletinComponent } from './boletin/boletin.component';
import { SuscripcionComponent } from './suscripcion/suscripcion.component';
import { MaterialModule } from '../../material.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogBoletinDetalleComponent } from './dialog-boletin-detalle/dialog-boletin-detalle.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClientModule } from '@angular/common/http';
import { SvgIconsModule } from '@ngneat/svg-icon';


@NgModule({
  declarations: [BoletinesComponent, BoletinComponent, SuscripcionComponent, DialogBoletinDetalleComponent],
  imports: [
    CommonModule,
    BoletinesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    HttpClientModule,
    TranslateModule,
    SvgIconsModule
  ],
  providers: [
    TranslateService
  ]
})
export class BoletinesModule { }
