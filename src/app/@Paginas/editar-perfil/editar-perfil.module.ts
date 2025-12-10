import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { MaterialModule } from '../../material.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EditarPerfilRoutingModule } from './editar-perfil-routing.module';
import { EditarPerfilComponent } from './editar-perfil.component';
import { DialogEditarRespuestaComponent } from './dialog-editar-respuesta/dialog-editar-respuesta.component';


@NgModule({
  declarations: [
    EditarPerfilComponent,
    DialogEditarRespuestaComponent
  ],
  imports: [
    CommonModule,
    EditarPerfilRoutingModule,
    SvgIconsModule,
    MaterialModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class EditarPerfilModule { }
