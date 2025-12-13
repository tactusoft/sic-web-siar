import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestionProveedoresComponent } from './gestion-proveedores.component';

const routes: Routes = [
  {
    path: '',
    component: GestionProveedoresComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionProveedoresRoutingModule { }
