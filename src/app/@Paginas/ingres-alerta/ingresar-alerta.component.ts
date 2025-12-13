import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Constants } from 'src/app/common/constants';
import { LenguajeService } from 'src/app/servicios/lenguaje.service';

@Component({
  selector: 'app-ingresar-alerta',
  templateUrl: './ingresar-alerta.component.html',
  styleUrls: ['./ingresar-alerta.component.scss']
})

export class IngresarAlertaComponent implements OnInit {

  idioma: string;
  textos: any = null;

  constructor(private toastr: ToastrService,
              private lenguajeService: LenguajeService ) {
  }

  ngOnInit(): void {
    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      this.idioma = data;
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(this.idioma).subscribe(texts => {
        this.textos = texts;
      },
        () => {
          this.toastr.error(this.textos?.mensajes ? this.textos?.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
  }

}
