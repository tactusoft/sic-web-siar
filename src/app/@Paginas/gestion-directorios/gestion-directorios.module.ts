import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GestionDirectoriosRoutingModule} from './gestion-directorios-routing.module';

import {MaterialModule} from '../../material.module';
import {HttpClientModule} from '@angular/common/http';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {SvgIconsModule} from '@ngneat/svg-icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {DialogDetalleDirectorioComponent} from './dialog-detalle-directorio/dialog-detalle-directorio.component';
import {GestionDirectoriosComponent} from './gestion-directorios.component';
import {DialogNuevoDirectorioComponent} from './dialog-nuevo-directorio/dialog-nuevo-directorio.component';
import {DialogEliminarDirectorioComponent} from './dialog-eliminar-directorio/dialog-eliminar-directorio.component';
import {TarjetasDirectoriosComponent} from './tarjetas-directorios/tarjetas-directorios.component';


@NgModule({
  declarations: [
    GestionDirectoriosComponent,
    DialogNuevoDirectorioComponent,
    DialogEliminarDirectorioComponent,
    TarjetasDirectoriosComponent,
    DialogDetalleDirectorioComponent
  ],
  imports: [
    CommonModule,
    GestionDirectoriosRoutingModule,
    MaterialModule,
    HttpClientModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    SvgIconsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class GestionDirectoriosModule {
}
