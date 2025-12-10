import { Component, OnInit } from '@angular/core';
import {Constants} from '../../common/constants';
import {LenguajeService} from '../../servicios/lenguaje.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  textos;
  textosMensajes: any;

  constructor(private lenguajeService: LenguajeService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {

      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
          this.textos = texts.footer;
          this.textosMensajes = texts?.mensajes;
        },
        () => {
          this.toastr.error(this.textosMensajes ? this.textosMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
  }

}
