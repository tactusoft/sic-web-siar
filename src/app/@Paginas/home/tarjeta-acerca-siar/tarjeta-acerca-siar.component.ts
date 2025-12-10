import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {CabeceraService} from '../../../servicios/cabecera.service';
import {LenguajeService} from '../../../servicios/lenguaje.service';
import {Constants} from '../../../common/constants';

@Component({
  selector: 'app-tarjeta-acerca-siar',
  templateUrl: './tarjeta-acerca-siar.component.html',
  styleUrls: ['./tarjeta-acerca-siar.component.scss']
})
export class TarjetaAcercaSiarComponent implements OnInit {
  hover = false;
  IMG_SIAR_ES = window.location.pathname + Constants.PATH_IMG_SIAR_ES;
  IMG_SIAR_ES_HOVER = window.location.pathname + Constants.PATH_IMG_SIAR_ES_HOVER;

  acercaSiarInfo: any = null;

  constructor(private cabeceraService: CabeceraService,
              private lenguajeService: LenguajeService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.cabeceraService.closeMenu.emit(true);

    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {

      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
          this.acercaSiarInfo = texts;
        },
        () => {
          this.toastr.error(this.acercaSiarInfo?.mensajes ? this.acercaSiarInfo?.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
  }

}
