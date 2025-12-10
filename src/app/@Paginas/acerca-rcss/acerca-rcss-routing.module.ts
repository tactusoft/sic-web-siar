import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AcercaRcssComponent } from './acerca-rcss.component';


const routes: Routes = [
  {
    path: '',
    component: AcercaRcssComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcercaRcssRoutingModule { }
