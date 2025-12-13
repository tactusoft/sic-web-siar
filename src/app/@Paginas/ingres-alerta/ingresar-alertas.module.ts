import { NgModule } from '@angular/core';
import { IngresarAlertaComponent } from './ingresar-alerta.component';
import { TablaAlertasComponent } from './tabla-alertas/tabla-alertas.component';
import { IngresarAlertaRoutingModule } from './ingresar-alerta-routing.module';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { DialogIngresarAlertaComponent } from './dialog-ingresar-alerta/dialog-ingresar-alerta.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { DialogEditarAlertaComponent } from './dialog-editar-alerta/dialog-editar-alerta.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogEliminarAlertaComponent } from './dialog-eliminar-alerta/dialog-eliminar-alerta.component';


@NgModule({
  declarations: [
    IngresarAlertaComponent,
    TablaAlertasComponent,
    DialogIngresarAlertaComponent,
    DialogEditarAlertaComponent,
    DialogEliminarAlertaComponent,
  ],
  imports: [
    MatDatepickerModule,
    MatNativeDateModule,
    IngresarAlertaRoutingModule,
    SvgIconsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MaterialModule,
    NgxPaginationModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    TranslateService
  ]
})
export class AdminAlertasModule { }
