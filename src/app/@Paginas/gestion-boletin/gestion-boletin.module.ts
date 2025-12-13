import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionBoletinComponent } from './gestion-boletin.component';
import { MaterialModule } from '../../material.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClientModule } from '@angular/common/http';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { GestionBoletinRoutingModule } from './gestion-boletin-routing.module';
import { BoletinComponent } from './boletin/boletin.component';
import { DialogEditarComponent } from './dialog-editar/dialog-editar.component';
import { DialogEliminarComponent } from './dialog-eliminar/dialog-eliminar.component';
import { DialogAgregarComponent } from './dialog-agregar/dialog-agregar.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';

@NgModule({
  declarations: [GestionBoletinComponent, BoletinComponent, DialogEditarComponent, DialogEliminarComponent, DialogAgregarComponent],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatNativeDateModule,
    GestionBoletinRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    HttpClientModule,
    FormsModule,
    TranslateModule,
    SvgIconsModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    TranslateService
  ]
})
export class GestionBoletinModule { }
