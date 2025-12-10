import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { MaterialModule } from '../../material.module';
import { LoginComponent } from '../login/login.component';
import { LoginRoutingModule } from './login.routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RecuperarPassComponent } from './recuperar-pass/recuperar-pass.component';
import { DialogBloqueoUsuarioComponent } from './dialog-bloqueo-usuario/dialog-bloqueo-usuario.component';
import { CountdownGlobalConfig, CountdownModule } from 'ngx-countdown';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';


@NgModule({
  declarations: [LoginComponent, RecuperarPassComponent, DialogBloqueoUsuarioComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule,
    SvgIconsModule,
    MaterialModule,
    LoginRoutingModule,
    CountdownModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    ReactiveFormsModule
  ],
  providers: [
    TranslateService,
    DatePipe, {
      provide: CountdownGlobalConfig}
  ]
})
export class LoginModule { }
