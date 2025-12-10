import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Alerta } from '../../../modelos/alerta';
import { Constants } from '../../../common/constants';
import { LenguajeService } from '../../../servicios/lenguaje.service';
import { ToastrService } from 'ngx-toastr';
import { Recurso } from '../../../modelos/recurso';

@Component({
  selector: 'app-dialog-alerta',
  templateUrl: './dialog-alerta.component.html',
  styleUrls: ['./dialog-alerta.component.scss']
})
export class DialogAlertaComponent implements OnInit, AfterViewInit {
  IMG_TWITTER = window.location.pathname + Constants.PATH_IMG_TWITTER;
  IMG_FACEBOOK = window.location.pathname + Constants.PATH_IMG_FACEBOOK;
  IMG_LINK = window.location.pathname + Constants.PATH_IMG_LINK;
  alerta: Alerta;
  currentURL: string;
  agrandaImagen = false;
  urlFacebook = Constants.FACEBOOK;
  urlTwitter = Constants.TWITTER;
  urlLink: string;
  urlImagen: string;
  disableAnimation = true;
  paisesAlerta = '';
  riesgosAlerta = '';
  textos: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastrService: ToastrService,
    private lenguajeService: LenguajeService
  ) { }

  ngOnInit(): void {
    this.lenguajeService.idiomaSubject.subscribe(data => {
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
        this.textos = texts;
      },
        () => {
          this.toastrService.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
    this.alerta = this.data.alerta;
    this.anexarNombresPaises();
    this.anexarNombresRiesgos();
    this.currentURL = window.location.href;
    if (!this.currentURL.includes('/alertas')) {
      this.currentURL = `${this.currentURL}alertas`;
    }
    this.buildURL();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.disableAnimation = false);
  }

  getImagenes(recurso: Array<Recurso>): Array<Recurso> {
    if (recurso) {
      return recurso.filter(r => r.resourceTypeId.description === 'Imagenes');
    } else {
      return;
    }
  }

  agrandarImagen(urlImagen: string): void {
    this.urlImagen = urlImagen;
    this.agrandaImagen = true;
  }

  buildURL(): void {
    this.urlFacebook = `${this.urlFacebook}${this.currentURL}?idAlerta=${this.alerta.id}`;
    this.urlTwitter = `${this.urlTwitter}${this.currentURL}?idAlerta=${this.alerta.id}`;
    this.urlLink = `${this.currentURL}?idAlerta=${this.alerta.id}`;
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.urlLink);
    this.toastrService.info(this.textos.mensajes.MENSAJE_COPIAR_ENLACE);
  }

  anexarNombresPaises(): void {
    this.alerta.productOriginCountry.length > 0 ?
      this.alerta.productOriginCountry.forEach((item, index) => {
        this.paisesAlerta += this.getDescripcionPais(item);
        if ((index < this.alerta.productOriginCountry.length - 1) && (this.alerta.productOriginCountry.length !== 1)) {
          this.paisesAlerta += ', ';
        } else {
          return;
        }
      }) : (this.paisesAlerta = '');
  }

  anexarNombresRiesgos(): void {
    this.alerta.riesgo.length > 0 ?
      this.alerta.riesgo.forEach((item, index) => {
        this.riesgosAlerta += this.getDescripcionRiesgo(item);
        if ((index < this.alerta.riesgo.length - 1) && (this.alerta.riesgo.length !== 1)) {
          this.riesgosAlerta += ', ';
        } else {
          return;
        }
      }) : (this.riesgosAlerta = '');
  }

  getDescripcionPais(pais: any): string {
    try {
      return this.data.listaPaises.find(item => item.id === pais.id).nombre.trim();
    } catch {
      return pais.nombre.trim();
    }
  }

  getDescripcionCategoria(categoria: any): string {
    try {
      return this.data.listaCategoria[0].subDominio.find(item => item.id === categoria.id).description.trim();
    } catch {
      return categoria.description.trim();
    }
  }

  getDescripcionRiesgo(riesgo: any): string {
    try {
      return this.data.listaRiesgo[0].subDominio.find(item => item.id === riesgo.id).description;
    } catch {
      return riesgo.description;
    }
  }

  getDescripcionNivelRiesgo(nivelRiesgo: any): string {
    try {
      return this.data.listaNivelRiesgo[0].subDominio.find(item => item.id === nivelRiesgo.id).description;
    } catch {
      return nivelRiesgo.description;
    }
  }

  getDescripcionTipoMedida(tipoMedida: any): string {
    try {
      return this.data.listaTipoMedidas[0].subDominio.find(item => item.id === tipoMedida.id).description;
    } catch {
      return tipoMedida.description;
    }
  }

  getDocumentos(recurso: Array<Recurso>): Array<Recurso> {
    return recurso.filter(r => r.resourceTypeId.description === 'Anexos');
  }

  obtenerNombreEnlace(url: string): string {
    return url.split('/').pop();
  }

}
