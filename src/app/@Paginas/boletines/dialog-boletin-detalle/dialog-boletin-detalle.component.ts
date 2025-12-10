import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Constants } from '../../../common/constants';
import { LenguajeService } from '../../../servicios/lenguaje.service';
import { GestionBoletin } from 'src/app/modelos/gestion-boletin';

@Component({
  selector: 'app-dialog-boletin-detalle',
  templateUrl: './dialog-boletin-detalle.component.html',
  styleUrls: ['./dialog-boletin-detalle.component.scss']
})
export class DialogBoletinDetalleComponent implements OnInit {
  textos: any;
  archivo: any = [];
  recursos: any = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: GestionBoletin,
    private toastr: ToastrService,
    private lenguajeService: LenguajeService
  ) {
    data.recursos.forEach(el => {
      this.archivo.push(
        {
          id: el.id,
          nombreRecurso: el.path,
          peso: null
        });
      this.recursos.push(el);
    });
  }

  ngOnInit(): void {
    this.lenguajeService.idiomaSubject.subscribe(data => {
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
        this.textos = texts;
      }, () => {
        this.toastr.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
      });
    });
  }

}
