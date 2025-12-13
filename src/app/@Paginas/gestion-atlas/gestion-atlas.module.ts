import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GestionAtlasComponent} from './gestion-atlas.component';
import {TablaAtlasComponent} from './tabla-atlas/tabla-atlas.component';
import {MaterialModule} from '../../material.module';
import {HttpClientModule} from '@angular/common/http';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {SvgIconsModule} from '@ngneat/svg-icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {GestionAtlasRoutingModule} from './gestion-atlas-routing.module';
import {ConsultarAtlasComponent} from './consultar-atlas/consultar-atlas.component';
import {GenerarFormularioAtlasComponent} from './generar-formulario-atlas/generar-formulario-atlas.component';
import {CrearAtlasComponent} from './crear-atlas/crear-atlas.component';
import {CommonPipeModule} from '../../common/common-pipe/common-pipe.module';


@NgModule({
  declarations: [GestionAtlasComponent, TablaAtlasComponent, ConsultarAtlasComponent, GenerarFormularioAtlasComponent, CrearAtlasComponent],
  imports: [
    CommonModule,
    GestionAtlasRoutingModule,
    MaterialModule,
    HttpClientModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    SvgIconsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonPipeModule
  ]
})
export class GestionAtlasModule {
}
