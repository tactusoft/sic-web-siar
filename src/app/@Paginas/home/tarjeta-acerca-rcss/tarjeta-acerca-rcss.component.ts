import { Component, OnInit } from '@angular/core';
import { Constants } from '../../../common/constants';
import { ToastrService } from 'ngx-toastr';
import {CabeceraService} from '../../../servicios/cabecera.service';
import {LenguajeService} from '../../../servicios/lenguaje.service';

@Component({
  selector: 'app-tarjeta-acerca-rcss',
  templateUrl: './tarjeta-acerca-rcss.component.html',
  styleUrls: ['./tarjeta-acerca-rcss.component.scss']
})
export class TarjetaAcercaRcssComponent implements OnInit {
  IMG_MANOS_ROMPECABEZA = window.location.pathname + Constants.PATH_IMG_MANOS_ROMPECABEZA;
  acercaInfo: any = null;

  constructor(private cabeceraService: CabeceraService,
              private lenguajeService: LenguajeService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.cabeceraService.closeMenu.emit(true);
    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
          this.acercaInfo = texts;
        },
        () => {
          this.toastr.error(this.acercaInfo?.mensajes ? this.acercaInfo?.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
  }

}
