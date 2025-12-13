import { Component, OnInit, HostListener } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {Alerta} from '../../../../modelos/alerta';
import {GenericoService} from '../../../../servicios/generico.service';
import {CabeceraService} from '../../../../servicios/cabecera.service';
import {LenguajeService} from '../../../../servicios/lenguaje.service';
import {Constants} from '../../../../common/constants';

@Component({
  selector: 'app-tarjeta-pais-alerta',
  templateUrl: './tarjeta-pais-alerta.component.html',
  styleUrls: ['./tarjeta-pais-alerta.component.scss']
})
export class TarjetaPaisAlertaComponent implements OnInit {

  tPaisInfo: any = null;
  alertas: Array<Alerta> = [];
  pagina = 0;
  size = 4;
  resolucionAnterior = window.screen.width;
  estadoTarjeta = 'close';
  idioma: number;
  constructor(private genericoService: GenericoService,
              private cabeceraService: CabeceraService,
              private lenguajeService: LenguajeService,
              private toastr: ToastrService) { }



  ngOnInit(): void {
    this.cabeceraService.closeMenu.emit(true);
    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      this.idioma = this.lenguajeService.devolverIntIdioma(data);
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
          this.tPaisInfo = texts;
        },
        () => {
          this.toastr.error(this.tPaisInfo?.mensajes ? this.tPaisInfo?.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
    this.registrosPantallaGrande();
    this.getAlertas(this.pagina , this.size);
  }

  getAlertas(page: number, size: number): void{
    const url = `/alerta/listarAlerta?page=${page}&pais=0&region=&search=&size=${size}&lang=${this.idioma}`;
    this.genericoService.get(url)
      .subscribe(
        res => {
          if (res.message === '200'){
            this.alertas = res.data.Alertas;
          }
        }, error => {
          console.error(error);
        });
  }


  obtenerMasAlertas(pagina: number): void {
    if (pagina) {
      this.pagina = pagina;
    } else {
      this.pagina++;
      if (this.pagina > 2) {
        this.pagina = 0;
      }
    }

    this.getAlertas(this.pagina, this.size);
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
    if ((window.screen.width <= 991 && this.resolucionAnterior > 991) || (window.screen.width > 991 && this.resolucionAnterior <= 991)
    || (window.screen.width < 1200 && this.resolucionAnterior >= 1200) || (window.screen.width >= 1200 && this.resolucionAnterior < 1200)) {
      this.ngOnInit();
    }
    this.resolucionAnterior = window.screen.width;
  }

  private registrosPantallaGrande(): void {
    if (window.screen.width <= 991) {
      this.size = 2;
    } else if (window.screen.width < 1200){
      this.size = 3;
    } else {
      this.size = 4;
    }
  }
}
