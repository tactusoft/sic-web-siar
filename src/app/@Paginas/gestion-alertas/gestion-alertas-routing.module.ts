import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestionAlertasComponent } from './gestion-alertas.component';

const routes: Routes = [
  {
    path : '', component : GestionAlertasComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionAlertasRoutingModule { }
