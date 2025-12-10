import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnInit } from '@angular/core';
import { Alerta } from '../../../modelos/alerta';
import { GenericoService } from '../../../servicios/generico.service';
import { ToastrService } from 'ngx-toastr';
import { CabeceraService } from '../../../servicios/cabecera.service';
import { LenguajeService } from '../../../servicios/lenguaje.service';
import { Constants } from '../../../common/constants';

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.scss'],
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        opacity: 1,
      })),
      state('close', style({
        opacity: 0,
      })),
      transition('* => close', [
        animate('1s')
      ]),
      transition('* => open', [
        animate('5s')
      ]),
    ]),
  ]
})
export class AlertasComponent implements OnInit {
  paisesOrigenList: Array<any> = [];
  riesgosList: Array<any> = [];
  nivelRiesgosList: Array<any> = [];
  idiomasList: Array<any> = [];
  tipoMedidaList: Array<any> = [];
  proveedoresList: Array<any> = [];
  categoriasList: Array<any> = [];

  alertasInfo: any = null;
  alertas: Array<Alerta> = [];
  pagina = 0;
  size = 8;
  estadoTarjeta = 'close';
  paisId = 0;
  habilitarPaginado = false;
  resolucionAnterior = window.screen.width;
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
        this.alertasInfo = texts;
        this.obtenerListas();
      },
        () => {
          this.toastr.error(this.alertasInfo?.mensajes ? this.alertasInfo?.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
    this.registrosPantallaGrande();
    this.getAlertas(this.paisId, this.pagina, this.size);
    this.obtenerListas();
  }

  obtenerListas(): void{
    this.consultarPais();
    this.consultarRiesgos();
    this.consultarNivelRiesgos();
    this.consultarTipoMedida();
    this.consultarProveedores();
    this.consultarCategorias();
  }

  subDominioSort(f, s): number {
    const a = f.description.toUpperCase().trim();
    const b = s.description.toUpperCase().trim();
    return a < b ? -1 : a > b ? 1 : 0;
  }

  getAlertas(pais: number, page: number, size: number): void {
    // const url = `/alerta/listarAlerta?page=${page}&pais=${pais}&region=&search=&size=${size}`;
    const url = `/alerta/listarAlerta?page=${page}&pais=${pais}&region=&search=&size=${size}&lang=${this.idioma}`;
    this.genericoService.get(url)
      .subscribe(
        res => {
          if (res.message === '200') {
            this.alertas = res.data.Alertas;
            this.habilitarPaginado = res.data.totalItems > this.size;
          }
        }, error => {
          console.error(error);
        });
  }

  consultarPais(): void {
    const url = `${Constants.PATH_LISTAR_PAIS_LANG}?pais=0&lang=${this.idioma}`;
    this.genericoService.get(url).subscribe(res => {
      res.data.sort((f, s) => {
        const a = f.nombre.toUpperCase().trim();
        const b = s.nombre.toUpperCase().trim();
        return a < b ? -1 : a > b ? 1 : 0;
      });
      this.paisesOrigenList = res.data;
    });
  }

  consultarRiesgos(): void {
    const url = `${Constants.PATH_LISTAR_DOMINIO_NOMBRE_LANG}?nombre=Riesgos&idioma=${this.idioma}`;
    this.genericoService.get(url).subscribe(res => {
      res.data.dominio[0].subDominio.sort(this.subDominioSort);
      this.riesgosList = res.data.dominio;
    });
  }

  consultarNivelRiesgos(): void {
    const url = `${Constants.PATH_LISTAR_DOMINIO_NOMBRE_LANG}?nombre=Nivel%20de%20Riesgo&idioma=${this.idioma}`;
    this.genericoService.get(url).subscribe(res => {
      res.data.dominio[0].subDominio.sort(this.subDominioSort);
      this.nivelRiesgosList = res.data.dominio;
    });
  }

  consultarCategorias(): void {
    const url = `${Constants.PATH_LISTAR_DOMINIO_NOMBRE_LANG}?nombre=Categoria&idioma=${this.idioma}`;
    this.genericoService.get(url).subscribe(res => {
      res.data.dominio[0].subDominio.sort(this.subDominioSort);
      this.categoriasList = res.data.dominio;
    });
  }

  consultarTipoMedida(): void {
    const url = `${Constants.PATH_LISTAR_DOMINIO_NOMBRE_LANG}?nombre=Tipo%20de%20Medida&idioma=${this.idioma}`;
    this.genericoService.get(url).subscribe(res => {
      res.data.dominio[0].subDominio.sort(this.subDominioSort);
      this.tipoMedidaList = res.data.dominio;
    });
  }

  consultarProveedores(): void {
    const url = `/proveedor/listar?page=0&size=100`;
    this.genericoService.get(url).subscribe(res => {
      this.proveedoresList = res.data.result;
      this.proveedoresList.sort((a, b) => {
        if (a.title > b.title) {
          return 1;
        }
        if (a.title < b.title) {
          return -1;
        }
        return 0;
      });
    });
  }

  obtenerMasAlertas(pagina: number): void {
    if (pagina) {
      this.pagina = pagina;
    } else {
      this.pagina++;
      if (this.pagina > 1) {
        this.pagina = 0;
      }
    }

    this.getAlertas(this.paisId, this.pagina, this.size);
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
      || (window.screen.width < 1200 && this.resolucionAnterior >= 1200)
      || (window.screen.width >= 1200 && this.resolucionAnterior < 1200)) {
      this.ngOnInit();
    }
    this.resolucionAnterior = window.screen.width;
  }

  private registrosPantallaGrande(): void {
    if (window.screen.width <= 991) {
      this.size = 4;
    } else if (window.screen.width < 1200) {
      this.size = 6;
    } else {
      this.size = 8;
    }
  }
}
