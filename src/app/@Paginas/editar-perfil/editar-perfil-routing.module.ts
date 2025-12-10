import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditarPerfilComponent } from './editar-perfil.component';
import { MaterialModule } from '../../material.module';

const routes: Routes = [
  {
    path : '',
    component : EditarPerfilComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    MaterialModule
  ],
  exports: [RouterModule]
})
export class EditarPerfilRoutingModule { }
