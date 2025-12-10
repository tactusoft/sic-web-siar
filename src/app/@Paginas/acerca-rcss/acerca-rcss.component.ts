import { Component, OnInit } from '@angular/core';
import { LenguajeService } from '../../servicios/lenguaje.service';
import { Constants } from '../../common/constants';
import { ToastrService } from 'ngx-toastr';
import { CabeceraService } from '../../servicios/cabecera.service';

@Component({
  selector: 'app-acerca-rcss',
  templateUrl: './acerca-rcss.component.html',
  styleUrls: ['./acerca-rcss.component.scss']
})
export class AcercaRcssComponent implements OnInit {
  textos: any = null;
  IMG_REUNION = window.location.pathname + Constants.PATH_IMG_REUNION;
  urlOAS: string;
  urlAGRES: string;

  constructor(
    private lenguajeService: LenguajeService,
    private toastr: ToastrService,
    private cabeceraService: CabeceraService,
  ) { }

  ngOnInit(): void {
    this.cabeceraService.closeMenu.emit(true);
    this.lenguajeService.idiomaSubject.subscribe(data => {
      switch (data) {
        case 'en':
          this.urlOAS = Constants.URL_OAS_EN;
          this.urlAGRES = Constants.AG_RES_EN;
          break;
        case 'es':
          this.urlOAS = Constants.URL_OAS_ES;
          this.urlAGRES = Constants.AG_RES_ES;
          break;
        case 'fr':
          this.urlOAS = Constants.URL_OAS_FR;
          this.urlAGRES = Constants.AG_RES_FR;
          break;
        case 'pt':
          this.urlOAS = Constants.URL_OAS_PT;
          this.urlAGRES = Constants.AG_RES_PT;
          break;
        default:
          break;
      }
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
        this.textos = texts;
      }, () => {
        this.toastr.error(this.textos?.mensajes ? this.textos.mensaje.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
      });
    });
  }
}
