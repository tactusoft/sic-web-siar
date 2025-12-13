import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from '../home/home.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MaterialModule } from '../../material.module';
import { TarjetaAcercaRcssComponent } from './tarjeta-acerca-rcss/tarjeta-acerca-rcss.component';
import { TarjetaAcercaSiarComponent } from './tarjeta-acerca-siar/tarjeta-acerca-siar.component';
import { UltimasNoticiasComponent } from './ultimas-noticias/ultimas-noticias.component';
import { CardNoticiasComponent } from './ultimas-noticias/card-noticias/card-noticias.component';
import { EventosComponent } from './eventos/eventos.component';
import { TarjetaEventoComponent } from './eventos/tarjeta-evento/tarjeta-evento.component';
import { AlertasComponent } from './alertas/alertas.component';
import { TarjetaAlertaComponent } from './alertas/tarjeta-alerta/tarjeta-alerta.component';
import { HttpClientModule } from '@angular/common/http';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TarjetaPaisAlertaComponent } from './alertas/tarjeta-pais-alerta/tarjeta-pais-alerta.component';

@NgModule({
  declarations: [
    HomeComponent,
    TarjetaAcercaRcssComponent,
    TarjetaAcercaSiarComponent,
    UltimasNoticiasComponent,
    CardNoticiasComponent,
    EventosComponent,
    TarjetaEventoComponent,
    AlertasComponent,
    TarjetaAlertaComponent,
    TarjetaPaisAlertaComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    HomeRoutingModule,
    HttpClientModule,
    TranslateModule,
    SvgIconsModule
  ],
  providers : [
    TranslateService
  ],
  exports: [
    TarjetaPaisAlertaComponent,
    UltimasNoticiasComponent
  ]
})
export class HomeModule { }
