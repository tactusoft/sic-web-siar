import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePaisComponent } from './home-pais.component';

const routes: Routes = [
  {
    path: '',
    component: HomePaisComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePaisRoutingModule { }
