import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FiltroPaisPipe} from '../pipes/filtro-pais.pipe';
import { FiltroPlantillaAtlasPipe } from '../pipes/filtro-plantilla-atlas.pipe';


@NgModule({
  declarations: [FiltroPaisPipe, FiltroPlantillaAtlasPipe],
  imports: [
    CommonModule
  ], exports: [FiltroPaisPipe, FiltroPlantillaAtlasPipe]
})
export class CommonPipeModule {
}
