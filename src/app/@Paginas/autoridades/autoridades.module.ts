import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoridadesRoutingModule } from './autoridades-routing.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AutoridadesComponent } from './autoridades.component';
import { HttpClientModule } from '@angular/common/http';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { HomeRoutingModule } from '../home/home-routing.module';
import { DiagAutoridadComponent } from './diag-autoridad/diag-autoridad.component';
import {MaterialModule} from '../../material.module';


@NgModule({
  declarations: [AutoridadesComponent, DiagAutoridadComponent],
  imports: [
    CommonModule,
    AutoridadesRoutingModule,
    MaterialModule,
    HomeRoutingModule,
    HttpClientModule,
    TranslateModule,
    SvgIconsModule
  ], providers: [
    TranslateService
  ],
  exports: [
    AutoridadesComponent
  ]
})
export class AutoridadesModule { }
