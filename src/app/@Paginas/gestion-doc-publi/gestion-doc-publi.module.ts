import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionDocPubliComponent } from './gestion-doc-publi.component';
import { HttpClientModule } from '@angular/common/http';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { HomeRoutingModule } from '../home/home-routing.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MaterialModule } from '../../material.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TarjetaDocumentosComponent } from './tarjeta-documentos/tarjeta-documentos.component';
import {GestionDocPubliRoutingModule} from './gestion-doc-publi-routing.module';
import { DialogAgregarComponent } from './dialog-agregar/dialog-agregar.component';
import { DialogEliminarComponent } from './dialog-eliminar/dialog-eliminar.component';
import { DialogEditarComponent } from './dialog-editar/dialog-editar.component';


@NgModule({
  declarations: [
    GestionDocPubliComponent,
    TarjetaDocumentosComponent,
    DialogAgregarComponent,
    DialogEliminarComponent,
    DialogEditarComponent],
  imports: [
    GestionDocPubliRoutingModule,
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
export class GestionDocPubliModule { }
