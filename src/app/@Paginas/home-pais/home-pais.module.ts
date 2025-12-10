import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomePaisRoutingModule } from './home-pais-routing.module';
import { HomePaisComponent } from './home-pais.component';
import { HomeModule } from '../home/home.module';
import { AutoridadesModule } from '../autoridades/autoridades.module';
import { DocumentosModule } from '../documentos/documentos.module';
import { UltimosDocumentosComponent } from './ultimos-documentos/ultimos-documentos.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TarjetaDocumentosComponent } from './ultimos-documentos/tarjeta-documentos/tarjeta-documentos.component';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { MaterialModule } from '../../material.module';


@NgModule({
  declarations: [HomePaisComponent, UltimosDocumentosComponent, TarjetaDocumentosComponent],
  imports: [
    CommonModule,
    HomePaisRoutingModule,
    MaterialModule,
    HomeModule,
    AutoridadesModule,
    TranslateModule,
    DocumentosModule,
    SvgIconsModule
  ],
  providers : [
    TranslateService
  ],
})
export class HomePaisModule { }
