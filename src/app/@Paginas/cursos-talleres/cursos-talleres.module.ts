import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CursosTalleresRoutingModule } from './cursos-talleres-routing.module';
import { CursosTalleresComponent } from './cursos-talleres.component';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MaterialModule } from '../../material.module';
import { HttpClientModule } from '@angular/common/http';
import { PresentacionComponent } from './presentacion/presentacion.component';
import { BannerComponent } from './banner/banner.component';
import { TarjetaCursoComponent } from './tarjeta-curso/tarjeta-curso.component';
import { DetalleCursoComponent } from './detalle-curso/detalle-curso.component';
import { ComentarioComponent } from './detalle-curso/comentario/comentario.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalGestionCursosComponent } from './tarjeta-curso/modal-gestion-cursos-talleres/modal-cursos-talleres.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
@NgModule({
  declarations: [
    CursosTalleresComponent,
    PresentacionComponent,
    BannerComponent,
    TarjetaCursoComponent,
    DetalleCursoComponent,
    ComentarioComponent,
    ModalGestionCursosComponent
  ],
  imports: [
    MatDatepickerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatNativeDateModule,
    CommonModule,
    CursosTalleresRoutingModule,
    SvgIconsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule,
    NgxPaginationModule,
    MaterialModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    TranslateService
  ]
})
export class CursosTalleresModule { }
