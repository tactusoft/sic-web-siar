import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GestionDirectoriosComponent} from './gestion-directorios.component';

const routes: Routes = [
  {
    path: '',
    component: GestionDirectoriosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionDirectoriosRoutingModule {
}
