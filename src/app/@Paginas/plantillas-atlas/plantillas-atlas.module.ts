import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PlantillasAtlasRoutingModule} from './plantillas-atlas-routing.module';
import {PlantillasAtlasComponent} from './plantillas-atlas.component';
import {CrearPlantillaComponent} from './crear-plantilla/crear-plantilla.component';
import {EliminarPlantillaComponent} from './eliminar-plantilla/eliminar-plantilla.component';
import {ListarPlantillasComponent} from './listar-plantillas/listar-plantillas.component';
import {SvgIconsModule} from '@ngneat/svg-icon';
import {MatIconModule} from '@angular/material/icon';
import {NgxPaginationModule} from 'ngx-pagination';
import {MaterialModule} from '../../material.module';
import {HttpClientModule} from '@angular/common/http';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonPipeModule} from '../../common/common-pipe/common-pipe.module';


@NgModule({
  declarations: [PlantillasAtlasComponent,
    CrearPlantillaComponent,
    EliminarPlantillaComponent,
    ListarPlantillasComponent],
  imports: [
    CommonModule,
    PlantillasAtlasRoutingModule,
    SvgIconsModule,
    MatIconModule,
    NgxPaginationModule,
    MaterialModule,
    HttpClientModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CommonPipeModule
  ]
})
export class PlantillasAtlasModule {
}
