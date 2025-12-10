import { Component, HostListener, OnInit } from '@angular/core';
import { Evento } from '../../../modelos/evento';
import { GenericoService } from '../../../servicios/generico.service';
import { ToastrService } from 'ngx-toastr';
import {CabeceraService} from '../../../servicios/cabecera.service';
import {LenguajeService} from '../../../servicios/lenguaje.service';
import {Constants} from '../../../common/constants';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {
  IMG_EVENTOS_AUDITORIO = window.location.pathname + Constants.PATH_IMG_EVENTOS_AUDITORIO;
  eventosInfo: any = null;
  eventos: Array<Evento> = [];
  pagina = 0;
  registros = 8;
  pais = 0;
  idEvento = 0;
  habilitarPaginado = false;
  resolucionAnterior = window.screen.width;

  constructor(private genericoService: GenericoService,
              private cabeceraService: CabeceraService,
              private lenguajeService: LenguajeService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.registrosPantallaGrande();
    this.cabeceraService.closeMenu.emit(true);
    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
          this.eventosInfo = texts;
        },
        () => {
          this.toastr.error(this.eventosInfo?.mensajes ? this.eventosInfo?.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
    this.getEventos(this.pais, this.pagina, this.idEvento, this.registros);
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.obtenerResolucionPantalla();
  }

  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(): void {
    this.obtenerResolucionPantalla();
  }

  private obtenerResolucionPantalla(): void {
    if ((window.screen.width <= 800 && this.resolucionAnterior > 800) || (window.screen.width > 800 && this.resolucionAnterior <= 800)) {
      this.ngOnInit();
    }
    this.resolucionAnterior = window.screen.width;
  }

  private registrosPantallaGrande(): void {
    if (window.screen.width <= 800) {
      this.registros = 4;
    } else {
      this.registros = 8;
    }
  }

  getEventos(pais: number, pagina: number, idEvento: number, registros: number): void{
    const url = `/evento/listarEvento?pais=${pais}&page=${pagina}&event=${idEvento}&size=${registros}&start=&end=`;
    this.genericoService.get(url).subscribe(res => {
      if (res.message === '200'){
        this.eventos = res.data.evento;
        this.eventos.sort((a , b) => b.creationDate
              ? b.creationDate < a.creationDate ? -1 : b.creationDate > a.creationDate ? 1 : 0
              : 0);
        this.habilitarPaginado = res.data.totalItems > this.registros;
      }
    }, error => {
      console.log(error);
    });
  }

  obtenerMasEventos(pagina: number): void {
    if (pagina) {
      this.pagina = pagina;
    } else {
      this.pagina++;
      if (this.pagina > 1) {
        this.pagina = 0;
      }
    }
    this.getEventos(this.pais, this.pagina, this.idEvento, this.registros);
  }
}
