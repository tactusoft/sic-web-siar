import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestDocPrivadoComponent } from './gest-doc-privados.component';

const routes: Routes = [
  {
    path : '',
    component : GestDocPrivadoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestDocPrivadosRoutingModule { }
