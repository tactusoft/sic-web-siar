import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AcercaSiarRoutingModule } from './acerca-siar-routing.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { AcercaSiarComponent } from './acerca-siar.component';
import { SvgIconsModule } from '@ngneat/svg-icon';
import {MaterialModule} from '../../material.module';


@NgModule({
  declarations: [
    AcercaSiarComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    MaterialModule,
    AcercaSiarRoutingModule,
    HttpClientModule,
    TranslateModule,
    SvgIconsModule
  ],
  providers: [
    TranslateService
  ]
})
export class AcercaSiarModule { }
