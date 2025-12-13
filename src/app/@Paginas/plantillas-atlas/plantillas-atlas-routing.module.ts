import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PlantillasAtlasComponent} from './plantillas-atlas.component';

const routes: Routes = [
  {
    path: '',
    component: PlantillasAtlasComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlantillasAtlasRoutingModule { }
