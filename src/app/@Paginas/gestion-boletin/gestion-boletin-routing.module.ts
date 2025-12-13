import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestionBoletinComponent } from './gestion-boletin.component';

const routes: Routes = [
  {
    path: '',
    component: GestionBoletinComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionBoletinRoutingModule { }
