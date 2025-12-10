import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GestionAtlasComponent} from './gestion-atlas.component';
import {CrearAtlasComponent} from './crear-atlas/crear-atlas.component';
import {ConsultarAtlasComponent} from './consultar-atlas/consultar-atlas.component';


const routes: Routes = [
  {
    path: '',
    component: GestionAtlasComponent
  },
  {
    path: 'crear/:id',
    component: CrearAtlasComponent
  },
  {
    path: 'consultar',
    component: ConsultarAtlasComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionAtlasRoutingModule {
}
