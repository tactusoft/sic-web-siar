import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoticiasComponent } from '../noticias/noticias.component';
import { NoticiasRoutingModule } from './noticias-routing.module';
import { MaterialModule } from '../../material.module';
import { CardNoticiaComponent } from './card-noticia/card-noticia.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogNoticiaDetalleComponent } from './dialog-noticia-detalle/dialog-noticia-detalle.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { DialogNuevaNoticiaComponent } from './dialog-nueva-noticia/dialog-nueva-noticia.component';
import { DialogEliminarNoticiaComponent } from './dialog-eliminar-noticia/dialog-eliminar-noticia.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';

@NgModule({
  declarations: [
    NoticiasComponent,
    CardNoticiaComponent,
    DialogNoticiaDetalleComponent,
    DialogNuevaNoticiaComponent,
    DialogEliminarNoticiaComponent
  ],
  imports: [
    CommonModule,
    NoticiasRoutingModule,
    MaterialModule,
    HttpClientModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    SvgIconsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    TranslateService,
  ],
  exports: [DialogNoticiaDetalleComponent]
})
export class NoticiasModule {}
