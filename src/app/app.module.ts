import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CabeceraComponent } from './componentes/cabecera/cabecera.component';
import { MenuComponent } from './componentes/menu/menu.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { MainComponent } from './componentes/main/main.component';
import { LenguajeService } from './servicios/lenguaje.service';
import { PaisesService } from './servicios/paises.service';
import { BannerService } from './servicios/banner.service';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Utils } from './common/utils';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import icons from '../assets/svg/svg-icons';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { ToastrModule } from 'ngx-toastr';
import { RegistroUsuarioComponent } from './@Paginas/registro-usuario/registro-usuario.component';
import { CountdownGlobalConfig, CountdownModule } from 'ngx-countdown';
import { BasicAuthInterceptor } from './common/BasicAuthInterceptor';

import {
  NgxUiLoaderModule, NgxUiLoaderConfig, SPINNER, POSITION, NgxUiLoaderHttpModule
} from 'ngx-ui-loader';

export function HttpLoaderFactory(http: HttpClient): MultiTranslateHttpLoader {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/app/', suffix: '.json' },
    { prefix: './assets/i18n/rcss/', suffix: '.json' },
    { prefix: './assets/i18n/siar/', suffix: '.json' },
    { prefix: './assets/i18n/noticias/', suffix: '.json' },
    { prefix: './assets/i18n/alertas/', suffix: '.json' },
    { prefix: './assets/i18n/eventos/', suffix: '.json' },
    { prefix: './assets/i18n/menu/', suffix: '.json' },
    { prefix: './assets/i18n/cursoTaller/', suffix: '.json' },
    { prefix: './assets/i18n/sincronizacionAlertas/', suffix: '.json' }
  ]);
}

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: ' #004a9c',
  bgsOpacity: 1,
  bgsPosition: POSITION.bottomRight,
  bgsSize: 40,
  bgsType: SPINNER.threeStrings,
  fgsColor: ' #004a9c',
  fgsPosition: POSITION.centerCenter
};

@NgModule({
  declarations: [
    AppComponent,
    CabeceraComponent,
    MenuComponent,
    FooterComponent,
    MainComponent,
    RegistroUsuarioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CountdownModule,
    ToastrModule.forRoot(),
    SvgIconsModule.forRoot({
      icons
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient],
      }
    }),
    SvgIconsModule.forRoot({
      icons
    }),
    NgxUiLoaderHttpModule.forRoot({ showForeground: true }),
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
  ],
  providers: [
    LenguajeService,
    PaisesService,
    BannerService,
    Utils, {
      provide: HTTP_INTERCEPTORS,
      useClass: BasicAuthInterceptor,
      multi: true
    }, {
      provide: CountdownGlobalConfig
    }
  ],
  bootstrap: [AppComponent],
  exports: [
    MaterialModule
  ]
})
export class AppModule { }
