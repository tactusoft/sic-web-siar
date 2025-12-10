import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultaProveedoresComponent } from './consulta-proveedores.component';

const routes: Routes = [
  {
    path: '',
    component: ConsultaProveedoresComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaProveedoresRoutingModule { }
