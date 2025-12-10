import { Component, OnInit  } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CabeceraService } from '../../servicios/cabecera.service';
import { LenguajeService } from '../../servicios/lenguaje.service';
import { Constants } from '../../common/constants';
import { GenericoService } from '../../servicios/generico.service';
import { Recurso } from '../../modelos/recurso';

declare var jQuery: any;

@Component({
  selector: 'app-codigo-lesiones',
  templateUrl: './codigo-lesiones.component.html',
  styleUrls: ['./codigo-lesiones.component.scss']
})
export class CodigoLesionesComponent implements OnInit {
  textos: any = null;
  pdfSrc: string;
  recurso: Recurso[];

  constructor(
    private cabeceraService: CabeceraService,
    private lenguajeService: LenguajeService,
    private toastr: ToastrService,
    private genericoService: GenericoService,
  ) { }

  ngOnInit(): void {

    this.cabeceraService.closeMenu.emit(true);
    this.lenguajeService.idiomaSubject.subscribe(data => {
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
        this.textos = texts;
      }, () => {
        this.toastr.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
      });
    });
    this.getPDF();
  }

  getPDF(): void {
    const url = '/recursos/listarRecursos?tableId=4&tableName=folder';
    this.genericoService.get(url).subscribe(
      res => {

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < res.data.length; i = i + 1) {
          if (res.data[i].name === 'CODIGO_LESIONES.pdf') {
            this.pdfSrc = res.data[i].path;
          }
        }
      },

      error => {
        console.error(error);
      }
    );
  }
}
