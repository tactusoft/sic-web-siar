import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestDocPrivadosRoutingModule } from './gest-doc-privados-routing.module';
import { GestDocPrivadoComponent } from './gest-doc-privados.component';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { MaterialModule } from '../../material.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DialogNuevoDocComponent } from './dialog-nuevo-doc/dialog-nuevo-doc.component';
import { DialogEditDocComponent } from './dialog-edit-doc/dialog-edit-doc.component';
import { DialogEliminarDocComponent } from './dialog-eliminar-doc/dialog-eliminar-doc.component';
import { DialogFolderComponent } from './tabla-folder/table-doc-privados.component';
import {​​ MatDatepickerModule }​​ from '@angular/material/datepicker';
import {​​ MatNativeDateModule }​​ from '@angular/material/core';

@NgModule({
  declarations: [
    GestDocPrivadoComponent,
    DialogNuevoDocComponent,
    DialogEditDocComponent,
    DialogEliminarDocComponent,
    DialogFolderComponent,
    ],
  imports: [
    CommonModule,
    GestDocPrivadosRoutingModule,
    SvgIconsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxPaginationModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,  ]
})

export class GestDocPrivadoModule { }
