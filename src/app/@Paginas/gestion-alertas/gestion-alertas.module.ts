import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionAlertasRoutingModule } from './gestion-alertas-routing.module';
import { GestionAlertasComponent } from './gestion-alertas.component';
import { HttpClientModule } from '@angular/common/http';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MaterialModule } from '../../material.module';
import { ModalGestionAlertasComponent } from './modal-gestion-alertas/modal-gestion-alertas.component';




@NgModule({
  declarations: [GestionAlertasComponent,
    ModalGestionAlertasComponent, ],
  imports: [
    CommonModule,
    GestionAlertasRoutingModule,
    MaterialModule,
    HttpClientModule,
    TranslateModule,
    SvgIconsModule
  ], providers: [
    TranslateService
  ],
  exports: [
    GestionAlertasComponent
  ]
})
export class GestionAlertaModule { }
