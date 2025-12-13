import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AcercaRcssRoutingModule } from './acerca-rcss-routing.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MaterialModule } from '../../material.module';
import { HttpClientModule } from '@angular/common/http';
import { AcercaRcssComponent } from './acerca-rcss.component';
import { SvgIconsModule } from '@ngneat/svg-icon';


@NgModule({
  declarations: [
    AcercaRcssComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule,
    MaterialModule,
    AcercaRcssRoutingModule,
    SvgIconsModule
  ],
  providers: [
    TranslateService
  ]
})
export class AcercaRcssModule { }
