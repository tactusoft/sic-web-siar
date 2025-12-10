import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {CabeceraService} from '../../../servicios/cabecera.service';
import {LenguajeService} from '../../../servicios/lenguaje.service';
import {Constants} from '../../../common/constants';

@Component({
  selector: 'app-presentacion',
  templateUrl: './presentacion.component.html',
  styleUrls: ['./presentacion.component.scss']
})
export class PresentacionComponent implements OnInit {
  presentacionInfo: any = null;
  constructor(private cabeceraService: CabeceraService,
              private lenguajeService: LenguajeService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.cabeceraService.closeMenu.emit(true);

    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {

      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
          this.presentacionInfo = texts;
        },
        () => {
          this.toastr.error(this.presentacionInfo?.mensajes ? this.presentacionInfo.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
  }

}
