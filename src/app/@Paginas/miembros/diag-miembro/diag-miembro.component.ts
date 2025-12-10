import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import {Miembro} from '../../../modelos/miembro';
import {Autoridad} from '../../../modelos/autoridad';
import {CabeceraService} from '../../../servicios/cabecera.service';
import {LenguajeService} from '../../../servicios/lenguaje.service';
import {Constants} from '../../../common/constants';


@Component({
  selector: 'app-diag-miembro',
  templateUrl: './diag-miembro.component.html',
  styleUrls: ['./diag-miembro.component.scss']
})
export class DiagMiembroComponent implements OnInit {

  miembro: Miembro;
  miembroInfo: any = null;
  autoridades: Autoridad[];
  title: string;
  image: string;
  logo: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private cabeceraService: CabeceraService,
              private lenguajeService: LenguajeService,
              private toastr: ToastrService) {
    this.miembro = data.miembro;
    this.title = data.title;
    this.image = `url(${data.image})`;
    this.logo = data.logo;
  }

  ngOnInit(): void {
    this.cabeceraService.closeMenu.emit(true);
    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
          this.miembroInfo = texts;
        },
        () => {
          this.toastr.error(this.miembroInfo?.mensajes ? this.miembroInfo?.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
    this.autoridades = this.miembro.autoridades;
  }
}
