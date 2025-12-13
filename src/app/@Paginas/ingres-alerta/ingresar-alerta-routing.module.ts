import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IngresarAlertaComponent } from './ingresar-alerta.component';

const routes: Routes = [
  {
    path : '',
    component : IngresarAlertaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngresarAlertaRoutingModule { }
