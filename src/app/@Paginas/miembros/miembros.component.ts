import { Component, OnInit } from '@angular/core';
import { Miembro } from '../../modelos/miembro';
import { GenericoService } from '../../servicios/generico.service';
import { CabeceraService } from '../../servicios/cabecera.service';
import { LenguajeService } from '../../servicios/lenguaje.service';
import { ToastrService } from 'ngx-toastr';
import { Constants } from '../../common/constants';
import { MatDialog } from '@angular/material/dialog';
import { DialNuevoMiembroComponent } from './dial-nuevo-miembro/dial-nuevo-miembro.component';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DialEliminarMiembroComponent } from './dial-eliminar-miembro/dial-eliminar-miembro.component';
import { Pais } from 'src/app/modelos/pais';

@Component({
  selector: 'app-miembros',
  templateUrl: './miembros.component.html',
  styleUrls: ['./miembros.component.scss']
})
export class MiembrosComponent implements OnInit {
  iconoMas = Constants.ICON_MAS;
  IMG_BANDERAS = window.location.pathname + Constants.PATH_IMG_BANDERAS;
  miembrosInfo: any = null;
  paisesListaIdiomas: any = [];
  miembros: Miembro[];
  miembrosRender: Miembro[];
  itemsPorPag = 10;
  pagina = 1;
  numeroPaginas: number;
  administrar = false;
  paisesList: Array<Pais> = [];
  idioma: number;

  urlOAS: string;
  urlFormato: string;

  constructor(
    iconRegistry: MatIconRegistry,
    private genericoService: GenericoService,
    private cabeceraService: CabeceraService,
    private lenguajeService: LenguajeService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private router: Router,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon('iconoMas', sanitizer.bypassSecurityTrustResourceUrl(this.iconoMas));

  }

  ngOnInit(): void {
    this.cabeceraService.closeMenu.emit(true);
    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      switch (data) {
        case 'en':
          this.urlOAS = Constants.URL_OAS_EN;
          this.urlFormato = Constants.URL_FORMATO_EN;
          break;
        case 'es':
          this.urlOAS = Constants.URL_OAS_ES;
          this.urlFormato = Constants.URL_FORMATO_ES;
          break;
        case 'fr':
          this.urlOAS = Constants.URL_OAS_FR;
          this.urlFormato = Constants.URL_FORMATO_FR;
          break;
        case 'pt':
          this.urlOAS = Constants.URL_OAS_PT;
          this.urlFormato = Constants.URL_FORMATO_PT;
          break;
        default:
          break;
      }

      this.idioma = this.lenguajeService.devolverIntIdioma(data);
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
        this.miembrosInfo = texts;
      },
        () => {
          this.toastr.error(this.miembrosInfo?.mensajes ? this.miembrosInfo?.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
    this.consultarPaises();
    this.administrar = !!(localStorage.getItem('usuario') && localStorage.getItem('token') && (this.router.url === '/miembros'));
    this.getMiembros();
  }

  getMiembros(): void {
    const url = '/pais/listarMiembros?pais=0';
    this.genericoService.get(url).subscribe(
      res => {
        this.miembros = res.data;
        this.numeroPaginas = Math.ceil(this.miembros.length / this.itemsPorPag);
        this.presentarMiembros(1);
        console.log(this.miembros);
      },
      error => {
        console.error(error);
      }
    );
  }

  consultarPaises(): void {
    const url = `${Constants.PATH_LISTAR_PAIS_LANG}?pais=0&lang=${this.idioma}`;
    this.genericoService.get(url).subscribe(res => {
      this.paisesList = res.data;
      this.paisesList.sort((a, b) => b.nombre < a.nombre ? 1 : b.nombre > a.nombre ? -1 : 0);
    });
  }

  seleccionPagina(pagina: number): void {
    this.pagina = pagina <= this.numeroPaginas ? pagina : 1;
    this.presentarMiembros(this.pagina);
  }
  numSequence(n: number): Array<number> {
    return Array(n);
  }

  presentarMiembros(pagina: number): void {
    this.miembrosRender = this.miembros.slice(
      pagina * this.itemsPorPag - this.itemsPorPag,
      pagina * this.itemsPorPag
    );
  }

  openDialogNuevoMiembro(): void {

    const dialogRef = this.dialog.open(DialNuevoMiembroComponent, {
      width: '95%',
      data: { miembro: null, paises: this.paisesList }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.toastr.success(this.miembrosInfo?.mensajes ? this.miembrosInfo?.mensajes?.USUARIO_CREADO_MSJ : 'Usuario creado exitósamente');
        this.ngOnInit();
      }
    });

  }

  openDialogEditar(miembro): void {

    const url = `/pais/listarMiembros?pais=${miembro.id}`;
    this.genericoService.get(url).subscribe(
      res => {
        miembro = res.data[0];
        const dialogRef = this.dialog.open(DialNuevoMiembroComponent, {
          data: {
            miembro,
            paises: this.paisesList,
            administrar: this.administrar
          },
          width: '95%',
        });
        dialogRef.afterClosed().subscribe(resu => {
          if (resu) {
            this.toastr.success(this.miembrosInfo?.mensajes ? this.miembrosInfo?.mensajes.EVENTO_EDITADO_MSJ : 'Miembro editado correctamente');
          }
        });
      },
      error => {
        console.error(error);
      }
    );
  }

  openDialogEliminar(miembro: Miembro): void {
    const dialogRef = this.dialog.open(DialEliminarMiembroComponent, {
      data: {
        miembro
      },
      width: '95%',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.toastr.success(this.miembrosInfo?.mensajes ? this.miembrosInfo?.mensajes.EVENTO_ELIMINADO_MSJ : 'Miembro eliminado correctamente');
        this.ngOnInit();
      }
    });
  }

  showEditar(miembro): void {
    this.openDialogEditar(miembro);
  }
  showEliminar(miembro): void {
    this.openDialogEliminar(miembro);
  }


}
