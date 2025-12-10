import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Noticia } from '../../../modelos/noticia';
import { Recurso } from '../../../modelos/recurso';
import { ToastrService } from 'ngx-toastr';
import {CabeceraService} from '../../../servicios/cabecera.service';
import {LenguajeService} from '../../../servicios/lenguaje.service';
import {Constants} from '../../../common/constants';

@Component({
  selector: 'app-dialog-noticia-detalle',
  templateUrl: './dialog-noticia-detalle.component.html',
  styleUrls: ['./dialog-noticia-detalle.component.scss']
})
export class DialogNoticiaDetalleComponent implements OnInit {

  dNoticiaInfo: any = null;
  noticia: Noticia;
  title: string;
  agrandaImagen = false;
  urlImagen: string;
  recursos: Array<Recurso> = [];
  imagenesNoticia: Array<Recurso> = [];
  URL_SIN_IMAGEN = 'assets/img/noImagen.png';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cabeceraService: CabeceraService,
    private lenguajeService: LenguajeService,
    private toastr: ToastrService) {
    this.noticia = data.noticia;
    this.title = data.title;
  }

  ngOnInit(): void {
    this.cabeceraService.closeMenu.emit(true);
    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
          this.dNoticiaInfo = texts;
        },
        () => {
          this.toastr.error(this.dNoticiaInfo ? this.dNoticiaInfo.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
    this.imagenesNoticia = this.getImagenes(this.noticia.recursos);
  }

  getAnexos(recurso: Array<Recurso>): Array<Recurso>{
    return recurso.filter(r => r.resourceTypeId.description === 'Anexos');
  }

  getImagenes(recurso: Array<Recurso>): Array<Recurso>{
    const rec = recurso.filter(r => r.resourceTypeId.description === 'Imagenes');
    if (rec.length > 0){
      return rec;
    }
    return [];
  }

  getEnlaces(recurso: Array<Recurso>): Array<Recurso>{
    return recurso.filter(r => r.resourceTypeId.description === 'Enlaces');
  }

  agrandarImagen(urlImagen: string): void{
    this.urlImagen = urlImagen;
    this.agrandaImagen = true;
  }

  getDescripcionPais(pais: any): string {
    try {
      return this.data.listaPaises.find(item => item.id === pais.id).nombre.trim();
    } catch {
      return pais.nombre.trim();
    }
  }
}
