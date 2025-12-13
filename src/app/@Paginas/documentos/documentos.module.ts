import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentosRoutingModule } from './documentos-routing.module';
import { DocumentosComponent } from './documentos.component';
import { HttpClientModule } from '@angular/common/http';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { HomeRoutingModule } from '../home/home-routing.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MaterialModule } from '../../material.module';
import { TarjetaDocumentosComponent } from './tarjeta-documentos/tarjeta-documentos.component';
import { DetalleTarjetaDocumentosComponent } from './detalle-tarjeta-documentos/detalle-tarjeta-documentos.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [DocumentosComponent, TarjetaDocumentosComponent, DetalleTarjetaDocumentosComponent],
  imports: [
    CommonModule,
    DocumentosRoutingModule,
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
  exports: [
    DocumentosComponent
  ]
})
export class DocumentosModule { }
