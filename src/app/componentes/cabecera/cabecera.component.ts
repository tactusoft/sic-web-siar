import { Component, EventEmitter, NgZone, OnInit, Output } from '@angular/core';
import { GenericoService } from '../../servicios/generico.service';
import { Pais } from '../../modelos/pais';
import { NavigationEnd, Router } from '@angular/router';
import { CabeceraService } from '../../servicios/cabecera.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { BusquedaPalabraClaveService } from '../../servicios/busqueda-palabra-clave.service';
import { ToastrService } from 'ngx-toastr';
import { Constants } from '../../common/constants';
import { LenguajeService } from '../../servicios/lenguaje.service';
import { PaisesService } from '../../servicios/paises.service';
import { Menu } from '../../modelos/menu';

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.scss']
})
export class CabeceraComponent implements OnInit {
  textos;
  textosMensajes: any;
  textosIdiomas: any;
  // Constantes
  ICONOUSUARIO = Constants.ICON_PERFIL;
  ICONOAPAGAR = Constants.ICON_APAGAR;
  iconoBuscador = Constants.ICON_BUSCADOR;
  iconoRCSS = Constants.ICON_RCSS_LOGO;
  iconoOEA = Constants.ICON_OEA_LOGO;
  iconoUsuarioBlanco = Constants.ICON_USUARIO;
  IMG_BANNER_HOME = window.location.pathname + Constants.PATH_IMG_BANNER_HOME;
  // Variables
  itemShow: number;
  mostrarMenu = false;
  mostrarMenuPais = false;
  listaIdiomas: Array<any> = [];
  paises: Array<Pais> = [];
  selectedPais: Pais;
  paisActual: string;
  mostrarBanner = false;
  usuarioLogueado = false;
  nombreUsuario = 'Usuario';
  iconoAcerca = false;
  iconoSiar = false;
  iconoEventos = false;
  iconoNoticias = false;
  iconoInstitucional = false;
  iconoSincronizacion = false;
  iconoUsuarios = false;
  iconoGestionEventos = false;
  iconoGestionNoticias = false;
  iconoBoletin = false;
  iconoCursoTalleres = false;
  iconoDocumentosPublicaciones = false;
  iconoMiembros = false;
  iconoAlertas = false;
  iconoDocumentos = false;
  iconoBiblioteca = false;
  @Output() private paisId = new EventEmitter<number>();
  menuList: Array<Menu> = [];
  palabraClave: string;
  idioma: number;

  constructor(
    private genericoService: GenericoService,
    private router: Router,
    private cabeceraService: CabeceraService,
    private lenguajeService: LenguajeService,
    private ngZone: NgZone,
    private busquedaPalabraClaveService: BusquedaPalabraClaveService,
    private toastrService: ToastrService,
    private paisesService: PaisesService,
    iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('iconoUsuario', sanitizer.bypassSecurityTrustResourceUrl(this.ICONOUSUARIO));
    iconRegistry.addSvgIcon('iconoApagar', sanitizer.bypassSecurityTrustResourceUrl(this.ICONOAPAGAR));
    iconRegistry.addSvgIcon('iconoBuscador', sanitizer.bypassSecurityTrustResourceUrl(this.iconoBuscador));
    iconRegistry.addSvgIcon('iconoUsuarioBlanco', sanitizer.bypassSecurityTrustResourceUrl(this.iconoUsuarioBlanco));
    iconRegistry.addSvgIcon('iconoRCSS_es', sanitizer.bypassSecurityTrustResourceUrl(Constants.ICON_RCSS_LOGO.replace('[LG]', 'es')));
    iconRegistry.addSvgIcon('iconoRCSS_en', sanitizer.bypassSecurityTrustResourceUrl(Constants.ICON_RCSS_LOGO.replace('[LG]', 'en')));
    iconRegistry.addSvgIcon('iconoRCSS_fr', sanitizer.bypassSecurityTrustResourceUrl(Constants.ICON_RCSS_LOGO.replace('[LG]', 'fr')));
    iconRegistry.addSvgIcon('iconoRCSS_pt', sanitizer.bypassSecurityTrustResourceUrl(Constants.ICON_RCSS_LOGO.replace('[LG]', 'pt')));
    iconRegistry.addSvgIcon('iconoOEA_en', sanitizer.bypassSecurityTrustResourceUrl(Constants.ICON_OEA_LOGO.replace('[LG]', 'en')));
    iconRegistry.addSvgIcon('iconoOEA_fr', sanitizer.bypassSecurityTrustResourceUrl(Constants.ICON_OEA_LOGO.replace('[LG]', 'fr')));
    iconRegistry.addSvgIcon('iconoOEA_pt', sanitizer.bypassSecurityTrustResourceUrl(Constants.ICON_OEA_LOGO.replace('[LG]', 'pt')));
    iconRegistry.addSvgIcon('iconoOEA_es', sanitizer.bypassSecurityTrustResourceUrl(Constants.ICON_OEA_LOGO.replace('[LG]', 'es')));
  }

  ngOnInit(): void {
    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      this.iconoOEA = 'iconoOEA_' + data;
      this.iconoRCSS = 'iconoRCSS_' + data;
      this.idioma = this.lenguajeService.devolverIntIdioma(data);
      this.paisesService.obtenerPaises(this.idioma);
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
        this.textos = texts.cabecera;
        this.textosIdiomas = texts.idiomas;
        this.textosMensajes = texts?.mensajes;
        if (!this.cabeceraService.userLogged) {
          this.getPaises(0);
        }
      },
        error => {
          console.log(error);
          this.toastrService.error(this.textosMensajes ? this.textosMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });

    this.verificarSesionActiva();
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.mostrarBanner = (val.url !== '/login');
        this.palabraClave = null;
        this.getMenu();
      }
    });
    this.cabeceraService.closeMenu.subscribe((value) => {
      if (value) {
        this.mostrarMenu = false;
      }
    });
    this.cabeceraService.userLogged.subscribe((value) => {
      this.cargarUsuarioLogueado(value);
    });
    this.getPaises(0);
    this.getIdiomas();
  }

  enrutar(url: any): void {
    this.mostrarMenu = !this.mostrarMenu;
    this.ngZone.run(() => {
      this.router.navigate([url]);
    });
  }
  // tslint:disable-next-line
  authMenu(id: number) {
    const found: Menu = this.menuList.find(element => element.id === id);
    if (found) {
      return true;
    } else {
      return false;
    }
  }

  getPaises(paises: number): void {
    const url = `${Constants.PATH_LISTAR_PAIS_LANG}?pais=${paises}&lang=${this.idioma}&region=America`;
    this.genericoService.get(url).subscribe(res => {
      if (res.message === '200') {
        this.paises = res.data;
        this.paises.sort((a, b) => {
          if (a.nombre > b.nombre) {
            return 1;
          }
          if (a.nombre < b.nombre) {
            return -1;
          }
          return 0;
        });
        if (localStorage.getItem('iconoPais') === null && this.paises[0].recursos.length !== 0) {
          this.paisActual = this.paises[0].recursos[0].path;
        }
        else {
          this.paisActual = localStorage.getItem('iconoPais');
        }
      }
    }, error => {
      console.error(error);
    });
  }

  getIdiomas(): void {
    const url = Constants.PATH_LISTAR_IDIOMAS;
    this.genericoService.get(url).subscribe(res => {
      res.data.sort((f, s) => {
        const a = f.descripcion.toUpperCase().trim();
        const b = s.descripcion.toUpperCase().trim();
        return a < b ? -1 : a > b ? 1 : 0;
      });
      this.listaIdiomas = res.data;
    });
  }

  getMenu(): void {
    this.menuList = [];
    const url = Constants.PATH_MENU_TOKEN;
    this.genericoService.get(url).subscribe(res => {
      if (res.message === '200') {
        this.menuList = res.data.menu;
      }
    });
  }

  cambiarIdiomar(idIdioma: any): void {
    if (idIdioma !== this.idioma || this.idioma !== Number(localStorage.getItem('idioma'))) {
      this.lenguajeService.cambiarIdioma(this.lenguajeService.devolverSubStringIdiomaPorId(idIdioma));
      localStorage.setItem('idioma', idIdioma);
    }
  }

  selectPais(pais): void {
    this.selectedPais = pais;
    this.paisId.emit(pais.id);
    localStorage.setItem('paisId', pais.id);
    localStorage.setItem('iconoPais', pais.recursos[0].path);
    if (this.router.url === '/homePais') {
      window.location.reload();
    }
    else {
      this.router.navigate(['homePais']);
      this.paisActual = pais.recursos[0].path;
      this.mostrarMenuPais = false;
    }
  }

  onFocusoutEvent(): void {
    this.mostrarMenu = true;
    console.log('Mostrar menu false');
  }

  cerrarSesion(): void {
    const usuarioLogueo = localStorage.getItem('credenciales');
    localStorage.clear();
    this.menuList = [];
    this.cabeceraService.closeMenu.emit(false);
    this.cabeceraService.userLogged.emit(false);
    if (usuarioLogueo !== null) {
      localStorage.setItem('credenciales', usuarioLogueo);
    }
    this.router.navigate(['']);
  }

  cargarUsuarioLogueado(logueo: boolean): void {
    this.usuarioLogueado = logueo;
    if (this.usuarioLogueado) {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      this.nombreUsuario = usuario.name + ' ' + usuario.last_name;
    }
  }

  verificarSesionActiva(): void {
    if (localStorage.getItem('usuario') && localStorage.getItem('token')) {
      this.cargarUsuarioLogueado(true);
      this.cabeceraService.userLogged.emit(true);
    }
  }

  buscar(): void {
    if (!this.palabraClave) {
      this.toastrService.warning(this.textosMensajes
        ? this.textosMensajes.BUSQUEDA_MINIMO_CARACTERES : Constants.BUSQUEDA_MINIMO_CARACTERES);
    }
    else {
      const palabra = this.palabraClave.trim();

      if (palabra.length < 4) {
        this.toastrService.warning(this.textosMensajes
          ? this.textosMensajes.MENSAJEBUSQUEDA_MINIMO_CARACTERES_ERROR : Constants.BUSQUEDA_MINIMO_CARACTERES);
      }
      else {
        this.busquedaPalabraClaveService.buscarPorPalabraClave(palabra)
          .subscribe((res) => {
            if (res.success) {
              if (res.result) {
                if (!this.router.url.includes('resultadosPalabraClave')) {
                  this.router.navigate(['/resultadosPalabraClave']);
                }
              }
              else {
                this.toastrService.warning(this.textosMensajes
                  ? this.textosMensajes.BUSQUEDA_SIN_RESULTADOS : Constants.BUSQUEDA_SIN_RESULTADOS);
              }
            }
            else {
              this.toastrService.error(this.textosMensajes ? this.textosMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
            }
          },
            () => {
              this.toastrService.error(this.textosMensajes ? this.textosMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
            });
      }
    }
  }

  nombreIdiomaTraduccion(descripcion: string): any {
    try {
      if (this.textosIdiomas) {
        return this.textosIdiomas[descripcion.trim()];
      } else {
        return descripcion;
      }
    } catch {
      return descripcion;
    }
  }

}
