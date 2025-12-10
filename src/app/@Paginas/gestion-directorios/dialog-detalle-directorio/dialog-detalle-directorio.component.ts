import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {Constants} from '../../../common/constants';
import {Recurso} from '../../../modelos/recurso';
import {LenguajeService} from '../../../servicios/lenguaje.service';
import {Directorio} from '../../../modelos/directorio';
import {CabeceraService} from '../../../servicios/cabecera.service';

@Component({
  selector: 'app-dialog-detalle-directorio',
  templateUrl: './dialog-detalle-directorio.component.html',
  styleUrls: ['./dialog-detalle-directorio.component.scss']
})
export class DialogDetalleDirectorioComponent implements OnInit {
  directorio: Directorio;
  agrandaImagen = false;
  urlImagen: string;
  recursos: Array<Recurso> = [];
  imagenes: Array<Recurso> = [];
  idioma: string;
  textos: any = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cabeceraService: CabeceraService,
    private lenguajeService: LenguajeService,
    private toastr: ToastrService) {

    this.directorio = data.directorio;
  }

  ngOnInit(): void {
    this.cabeceraService.closeMenu.emit(true);
    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
          this.textos = texts;
        },
        () => {
          this.toastr.error(this.textos ? this.textos.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
    this.imagenes = this.getImagenes(this.directorio.recursos);
  }

  getAnexos(recurso: Array<Recurso>): Array<Recurso> {
    return recurso.filter(r => r.resourceTypeId.description === 'Anexos');
  }

  getImagenes(recurso: Array<Recurso>): Array<Recurso> {
    const rec = recurso.filter(r => r.resourceTypeId.description === 'Imagenes');
    if (rec.length > 0) {
      return rec;
    }
    return [];
  }

  getEnlaces(recurso: Array<Recurso>): Array<Recurso> {
    return recurso.filter(r => r.resourceTypeId.description === 'Enlaces');
  }

  agrandarImagen(urlImagen: string): void {
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

