import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CodigoLesionesComponent } from './codigo-lesiones.component';

const routes: Routes = [
  {
    path: '',
    component: CodigoLesionesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CodigoLesionesRoutingModule { }
