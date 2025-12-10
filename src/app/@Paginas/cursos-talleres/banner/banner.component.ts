import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {CabeceraService} from '../../../servicios/cabecera.service';
import {LenguajeService} from '../../../servicios/lenguaje.service';
import {Constants} from '../../../common/constants';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
  IMG_REUNION = window.location.pathname + Constants.PATH_IMG_REUNION;
  bannerInfo: any = null;

  constructor(private cabeceraService: CabeceraService,
              private lenguajeService: LenguajeService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.cabeceraService.closeMenu.emit(true);

    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {

      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
          this.bannerInfo = texts;
        },
        () => {
          this.toastr.error(this.bannerInfo?.mensajes ? this.bannerInfo.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
  }

}
