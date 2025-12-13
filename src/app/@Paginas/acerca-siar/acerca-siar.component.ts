import { Component, OnInit } from '@angular/core';
import { LenguajeService } from '../../servicios/lenguaje.service';
import { Constants } from '../../common/constants';
import { GenericoService } from '../../servicios/generico.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-acerca-siar',
  templateUrl: './acerca-siar.component.html',
  styleUrls: ['./acerca-siar.component.scss']
})
export class AcercaSiarComponent implements OnInit {
  IMG_MANOS_SIAR = window.location.pathname + Constants.PATH_IMG_MANOS_SIAR;
  infoSiar: any;
  urlOAS: string;
  urlAGRES: string;
  textos: any;
  constructor(
    private lenguajeServiceService: LenguajeService,
    private genericoService: GenericoService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.lenguajeServiceService.idiomaSubject.subscribe(data => {
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
      this.lenguajeServiceService.getTranslationTexts(data).subscribe(texts => {
        this.textos = texts;
      }, () => {
        this.toastr.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
      });
    });
    this.getInfoSiar();
  }

  getInfoSiar(): void {
    this.genericoService.get('/siar').subscribe(res => {
      this.infoSiar = JSON.parse(res.data);
    }, error => {
      console.error(error);
      this.toastr.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
    });
  }
}
