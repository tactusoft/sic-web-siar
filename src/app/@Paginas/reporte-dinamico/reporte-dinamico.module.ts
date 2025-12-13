import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

// Routing
import { ReporteDinamicoRoutingModule } from './reporte-dinamico-routing.module';

// Material centralizado
import { MaterialModule } from '../../material.module';

// Librerías externas
import { NgxPaginationModule } from 'ngx-pagination';
import { SvgIconsModule } from '@ngneat/svg-icon';

// Componente
import { ReporteDinamicoComponent } from './reporte-dinamico.component';

@NgModule({
  declarations: [
    ReporteDinamicoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    ReporteDinamicoRoutingModule,
    MaterialModule,
    NgxPaginationModule,
    SvgIconsModule
  ]
})
export class ReporteDinamicoModule { }
