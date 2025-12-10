import {Component, HostListener, OnInit} from '@angular/core';
import { Noticia } from '../../../modelos/noticia';
import { GenericoService } from '../../../servicios/generico.service';
import { ToastrService } from 'ngx-toastr';
import {CabeceraService} from '../../../servicios/cabecera.service';
import {LenguajeService} from '../../../servicios/lenguaje.service';
import {Constants} from '../../../common/constants';

@Component({
  selector: 'app-ultimas-noticias',
  templateUrl: './ultimas-noticias.component.html',
  styleUrls: ['./ultimas-noticias.component.scss']
})
export class UltimasNoticiasComponent implements OnInit {

  UltimasNotiInfo: any = null;
  paisesList: any = [];
  noticias: Array<Noticia> = [];
  pagina = 0;
  registros = 0;
  paisId = Number(localStorage.getItem('paisId'));
  mostrarBoletin = false;
  habilitarPaginado = false;

  // Cambio de resolución
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.obtenerResolucionPantalla();
  }

  // Giro de pantallas
  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(): void {
    this.obtenerResolucionPantalla();
  }

  constructor(
    private genericoService: GenericoService,
    private cabeceraService: CabeceraService,
    private lenguajeService: LenguajeService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.obtenerResolucionPantalla();
    this.cabeceraService.closeMenu.emit(true);
    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
          this.UltimasNotiInfo = texts;
        },
        () => {
          this.toastr.error(this.UltimasNotiInfo?.mensajes ? this.UltimasNotiInfo.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
  }

  getNoticias(
    paises: Array<number>,
    ano: Array<number>,
    mes: Array<number>,
    pagina: number,
    registros: number): void {
    paises = [];

    if (this.paisId) {
      this.mostrarBoletin = false;
      paises.push(this.paisId);
    }

    const url =
      `/noticias/listarNoticias?pais=${paises.toString()}&ano=${ano.toString()}&mes=${mes.toString()}&pagina=${pagina}&nRegistros=${registros}`;

    this.genericoService.get(url).subscribe(res => {
      if (res.message === '200') {
        this.noticias = res.data.noticias;
        this.noticias.sort((a , b) => b.fecha < a.fecha ? -1 : b.fecha > a.fecha ? 1 : 0);
        this.habilitarPaginado = res.data.totalItems > 4;
      }
    }, error => {
      console.error(error);
      this.toastr.error(this.UltimasNotiInfo?.mensajes ? this.UltimasNotiInfo.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
    });
  }

  obtenerMasNoticias(pagina: number): void {
    if (pagina) {
      this.pagina = pagina;
    } else {
      this.pagina++;
      if (this.pagina > 2) {
        this.pagina = 0;
      }
    }
    this.getNoticias([], [], [], this.pagina, this.registros);
  }

  private obtenerResolucionPantalla(): void {
    let numeroRegistros;
    if (window.screen.width < 600) {
      numeroRegistros = 2;
    }
    else if (window.screen.width < 900) {
      numeroRegistros = 3;
    }
    else {
      numeroRegistros = 4;
    }
    if (this.registros !== numeroRegistros) {
      this.getNoticias([], [], [], this.pagina, numeroRegistros);
    }
    this.registros = numeroRegistros;
  }

}
