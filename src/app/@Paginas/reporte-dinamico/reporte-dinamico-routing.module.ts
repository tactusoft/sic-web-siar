import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReporteDinamicoComponent } from './reporte-dinamico.component';


const routes: Routes = [
  {
    path: '',
    component: ReporteDinamicoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReporteDinamicoRoutingModule { }
