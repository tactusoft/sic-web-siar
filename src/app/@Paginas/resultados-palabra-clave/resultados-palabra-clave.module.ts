import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MaterialModule } from '../../material.module';
import { SvgIconsModule } from '@ngneat/svg-icon';
import {ResultadosPalabraClaveRoutingModule} from './resultados-palabra-clave-routing.module';
import {ResultadosPalabraClaveComponent} from './resultados-palabra-clave.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { ResaltarPalabraEnTituloPipe } from './resaltar-palabra-en-titulo.pipe';
import { ResaltarPalabraEnTextoPipe } from './resaltar-palabra-en-texto.pipe';


@NgModule({
  declarations: [
    ResultadosPalabraClaveComponent,
    ResaltarPalabraEnTituloPipe,
    ResaltarPalabraEnTextoPipe
  ],
  imports: [
    CommonModule,
    TranslateModule,
    MaterialModule,
    ResultadosPalabraClaveRoutingModule,
    SvgIconsModule,
    NgxPaginationModule
  ],
  providers: [
    TranslateService
  ]
})
export class ResultadosPalabraClaveModule { }
