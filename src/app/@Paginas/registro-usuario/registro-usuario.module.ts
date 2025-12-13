import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistroUsuarioRoutingModule } from './registro-usuario-routing.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MaterialModule } from '../../material.module';
import { HttpClientModule } from '@angular/common/http';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { DialogPreguntaComponent } from './dialog-pregunta/dialog-pregunta.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [DialogPreguntaComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule,
    SvgIconsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RegistroUsuarioRoutingModule
  ],
  providers: [
    TranslateService
  ]
})
export class RegistroUsuarioModule { }
