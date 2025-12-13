import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {Constants} from '../../../common/constants';
import {LenguajeService} from '../../../servicios/lenguaje.service';
import {Autoridad} from '../../../modelos/autoridad';

@Component({
  selector: 'app-diag-autoridad',
  templateUrl: './diag-autoridad.component.html',
  styleUrls: ['./diag-autoridad.component.scss']
})
export class DiagAutoridadComponent implements OnInit {

  autoridad: Autoridad;
  title: string;
  image: string;
  logoPais: string;
  textos: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private lenguajeService: LenguajeService
  ) {
    this.autoridad = data.autoridad;
    this.title = data.title;
    this.image = `url(${data.image})`;
    this.logoPais = data.logo;
  }

  ngOnInit(): void {
    this.lenguajeService.idiomaSubject.subscribe(data => {
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
        console.log(texts);
        this.textos = texts;
        },
        () => {
          this.toastr.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
  }

}
