import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AcercaSiarComponent } from './acerca-siar.component';

const routes: Routes = [
  {
    path: '',
    component: AcercaSiarComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcercaSiarRoutingModule { }
