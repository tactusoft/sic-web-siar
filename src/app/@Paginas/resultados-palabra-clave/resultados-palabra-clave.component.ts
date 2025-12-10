import {Component, HostListener, OnInit} from '@angular/core';
import {BusquedaPalabraClaveService} from '../../servicios/busqueda-palabra-clave.service';
import {Router} from '@angular/router';
import {PaginationInstance} from 'ngx-pagination';
import {CabeceraService} from '../../servicios/cabecera.service';
import {LenguajeService} from '../../servicios/lenguaje.service';
import {ToastrService} from 'ngx-toastr';
import {Constants} from '../../common/constants';

@Component({
  selector: 'app-resultados-palabra-clave',
  templateUrl: './resultados-palabra-clave.component.html',
  styleUrls: ['./resultados-palabra-clave.component.scss']
})
export class ResultadosPalabraClaveComponent implements OnInit {
  palabraClaveInfo: any = null;
  resultados: any[] = [];
  palabrasBuscadas: string[] = [];
  configPaginador: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 20,
    currentPage: 1,
    totalItems: 0
  };

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

  constructor(private busquedaPalabraClaveService: BusquedaPalabraClaveService,
              private router: Router,
              private cabeceraService: CabeceraService,
              private lenguajeService: LenguajeService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.obtenerResolucionPantalla();

    this.cabeceraService.closeMenu.emit(true);
    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
          this.palabraClaveInfo = texts;
        },
        () => {
          this.toastr.error(this.palabraClaveInfo?.mensajes ? this.palabraClaveInfo?.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });

    this.resultados = this.busquedaPalabraClaveService.resultados;

    this.busquedaPalabraClaveService.resultadosSubject.subscribe(resultados => {
      this.resultados = resultados;
      this.pageChanged(1);
    });

    this.busquedaPalabraClaveService.palabrasBuscadasSubject.subscribe(palabras => {
      this.palabrasBuscadas = palabras;
    });
  }

  redirigir(tipo: string): void {
    let url: string;

    switch (tipo) {
      case 'news':
        url = '/noticias';
        break;
      case 'event':
        url = '/eventos';
        break;
      case 'alert':
        url = '/alertas';
        break;
      case 'document':
        url = '/gestionDocumentos';
        break;
      case 'course':
        url = '/cursosTalleres';
        break;
      default:
        url = '';
        break;
    }

    if (url !== '') {
      this.router.navigate([url]);
    }
  }

  pageChanged($event): void {
    this.configPaginador.currentPage = $event;
  }

  private obtenerResolucionPantalla(): void {
    this.configPaginador.itemsPerPage = window.screen.width <= 700 ? 10 : 20;
  }

}
