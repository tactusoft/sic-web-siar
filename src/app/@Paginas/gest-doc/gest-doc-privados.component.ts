import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PaginationInstance } from 'ngx-pagination';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { Router } from '@angular/router';
import {Constants} from '../../common/constants';
import {LenguajeService} from '../../servicios/lenguaje.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-gest-doc-privados',
  templateUrl: './gest-doc-privados.component.html',
  styleUrls: ['./gest-doc-privados.component.scss']
})
export class GestDocPrivadoComponent implements OnInit {

  iconoMas = Constants.ICON_MAS;
  iconoEditar = Constants.ICON_EDITAR;
  iconoEliminar = Constants.ICON_ELIMINAR;
  iconoCargueFile = Constants.ICON_CARGAR_FILE;
  mostrarConfirmacion = false;
  mostrando = 'usuarios';
  administrar = false;
  idioma: string;
  textos: any = null;

  public configPaginador: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 20,
    currentPage: 0,
    totalItems: 0,
  };
  constructor(
    public dialog: MatDialog,
    iconRegistry: MatIconRegistry,
    private lenguajeService: LenguajeService,
    private toastrService: ToastrService,
    private router: Router,
    sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('iconoEditar', sanitizer.bypassSecurityTrustResourceUrl(this.iconoEditar));
    iconRegistry.addSvgIcon('iconoEliminar', sanitizer.bypassSecurityTrustResourceUrl(this.iconoEliminar));
    iconRegistry.addSvgIcon('iconoMas', sanitizer.bypassSecurityTrustResourceUrl(this.iconoMas));
    iconRegistry.addSvgIcon('iconoCargueFile', sanitizer.bypassSecurityTrustResourceUrl(this.iconoCargueFile));
  }

  ngOnInit(): void {

    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {

      this.idioma = data;

      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(this.idioma).subscribe(texts => {
          this.textos = texts;
        },
        () => {
          this.toastrService.error(this.textos?.mensajes ? this.textos?.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });

    if ( !!(localStorage.getItem('usuario') && localStorage.getItem('token') )){
      this.administrar = (this.router.url === '/gestionDocPrivados');
    }else{
      this.router.navigate(['']);
    }
  }
  mostrarOk($event): void{
    this.mostrarConfirmacion = $event;
  }


  mostrar(filtro: string = '', campo: string): boolean{
    if (filtro.length > 0){
      if (campo.toLowerCase().includes(filtro.toLowerCase())){
        return true;
      }else{
        return false;
      }
    }
    return true;
  }

}
