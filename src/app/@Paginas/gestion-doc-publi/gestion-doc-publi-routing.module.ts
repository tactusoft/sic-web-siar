import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestionDocPubliComponent } from './gestion-doc-publi.component';

const routes: Routes = [
  {
    path: '',
    component: GestionDocPubliComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionDocPubliRoutingModule { }
