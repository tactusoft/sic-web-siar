import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionProveedoresComponent } from './gestion-proveedores.component';
import { HttpClientModule } from '@angular/common/http';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { HomeRoutingModule } from '../home/home-routing.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MaterialModule } from '../../material.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TarjetaRegistroComponent } from './tarjeta-registro/tarjeta-registro.component';
import { GestionProveedoresRoutingModule } from './gestion-proveedores-routing.module';
import { DialogAgregarComponent } from './dialog-agregar/dialog-agregar.component';
import { DialogEliminarComponent } from './dialog-eliminar/dialog-eliminar.component';

@NgModule({
  declarations: [
    GestionProveedoresComponent,
    TarjetaRegistroComponent,
    DialogAgregarComponent,
    DialogEliminarComponent],
  imports: [
    GestionProveedoresRoutingModule,
    CommonModule,
    MaterialModule,
    HomeRoutingModule,
    HttpClientModule,
    TranslateModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    SvgIconsModule
  ], providers: [
    TranslateService
  ],
})
export class GestionProveedoresModule { }
