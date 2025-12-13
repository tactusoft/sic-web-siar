import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { CodigoLesionesRoutingModule } from './codigo-lesiones-routing.module';
import { CodigoLesionesComponent } from '../codigo-lesiones/codigo-lesiones.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';


import { MaterialModule } from '../../material.module';

@NgModule({
  declarations: [CodigoLesionesComponent],
  imports: [
    CommonModule,
    CodigoLesionesRoutingModule,
    MaterialModule,
    HttpClientModule,
    TranslateModule,
    SvgIconsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxExtendedPdfViewerModule
  ],
  providers: [
    TranslateService
  ]
})
export class CodigoLesionesModule { }
