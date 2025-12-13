import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CursosTalleresComponent } from './cursos-talleres.component';

const routes: Routes = [
  {
    path : '',
    component: CursosTalleresComponent
  } ,
  {
    path: 'seccion/:id',
    component: CursosTalleresComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CursosTalleresRoutingModule { }
