import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SincronizacionAlertasComponent } from './sincronizacion-alertas.component';

const routes: Routes = [{
  path: '',
  component: SincronizacionAlertasComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SincronizacionAlertasRoutingModule { }
