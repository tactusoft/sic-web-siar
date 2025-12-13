import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ResultadosPalabraClaveComponent} from './resultados-palabra-clave.component';


const routes: Routes = [
  {
    path: '',
    component: ResultadosPalabraClaveComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResultadosPalabraClaveRoutingModule { }
