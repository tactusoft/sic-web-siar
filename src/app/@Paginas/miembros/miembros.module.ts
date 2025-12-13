import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiembrosComponent } from './miembros.component';
import { MiembrosRoutingModule } from './miembros-routing.module';
import { MaterialModule } from '../../material.module';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TarjetaMiembroComponent } from './tarjeta-miembro/tarjeta-miembro.component';
import { DiagMiembroComponent } from './diag-miembro/diag-miembro.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialNuevoMiembroComponent } from './dial-nuevo-miembro/dial-nuevo-miembro.component';
import { DialEliminarMiembroComponent } from './dial-eliminar-miembro/dial-eliminar-miembro.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [MiembrosComponent, TarjetaMiembroComponent, DiagMiembroComponent, DialNuevoMiembroComponent, DialEliminarMiembroComponent],
  imports: [
    CommonModule,
    MiembrosRoutingModule,
    MaterialModule,
    SvgIconsModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers : [
    TranslateService
  ],
})
export class MiembrosModule { }
