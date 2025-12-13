import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminUsuariosRoutingModule } from './admin-usuarios-routing.module';
import { AdminUsuariosComponent } from './admin-usuarios.component';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { MaterialModule } from '../../material.module';
import { TablaUsuariosComponent } from './tabla-usuarios/tabla-usuarios.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogNuevoUsuarioComponent } from './dialog-nuevo-usuario/dialog-nuevo-usuario.component';
import { DialogNuevoRolComponent } from './dialog-nuevo-rol/dialog-nuevo-rol.component';
import { DialogEliminarRolComponent } from './dialog-eliminar-rol/dialog-eliminar-rol.component';
import { TablaRolesComponent } from './tabla-roles/tabla-roles.component';
import { DialogInvitacionComponent } from './dialog-invitacion/dialog-invitacion.component';
import { DialogEditRolComponent} from './dialog-edit-rol/dialog-edit-rol.component';


@NgModule({
  declarations: [
    AdminUsuariosComponent,
    TablaUsuariosComponent,
    DialogNuevoUsuarioComponent,
    DialogNuevoRolComponent,
    DialogEditRolComponent,
    DialogEliminarRolComponent,
    TablaRolesComponent,
    DialogInvitacionComponent],
  imports: [
    CommonModule,
    AdminUsuariosRoutingModule,
    SvgIconsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxPaginationModule
  ]
})
export class AdminUsuariosModule { }
