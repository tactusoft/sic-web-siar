import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { DialogIngresarAlertaComponent } from '../dialog-ingresar-alerta/dialog-ingresar-alerta.component';
import { MatDialog } from '@angular/material/dialog';
import { PaginationInstance } from 'ngx-pagination';
import { GenericoService } from '../../../servicios/generico.service';
import { IngresAlertaService } from '../ingres-alerta.service';
import { DialogEliminarAlertaComponent } from '../dialog-eliminar-alerta/dialog-eliminar-alerta.component';
import { DialogEditarAlertaComponent } from '../dialog-editar-alerta/dialog-editar-alerta.component';
import {Constants} from '../../../common/constants';
import { ToastrService } from 'ngx-toastr';
import {LenguajeService} from '../../../servicios/lenguaje.service';

@Component({
  selector: 'app-tabla-alertas',
  templateUrl: './tabla-alertas.component.html',
  styleUrls: ['./tabla-alertas.component.scss']
})

export class TablaAlertasComponent implements OnInit {
  ID_ROL_ADMIN_PRINC = 1;
  ID_ROL_ADMIN = 2;
  ID_ROL_EDITOR_PAIS = 3;
  iconoEditar = Constants.ICON_EDITAR;
  iconoEliminar = Constants.ICON_ELIMINAR;
  iconoMas = Constants.ICON_MAS;
  listaAlertas: any[];
  NUM_ITEMS_PAGINA = 20;
  rolUsuarioActual: any;
  public configPaginador: PaginationInstance = {
    id: 'custom',
    itemsPerPage: this.NUM_ITEMS_PAGINA,
    currentPage: 1,
    totalItems: 0
  };
  pagina = '0';
  paisUsuario: string;
  idioma: string;
  textos: any = null;

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private lenguajeService: LenguajeService,
    private genericoService: GenericoService,
    private alertaService: IngresAlertaService
  ) {
    iconRegistry.addSvgIcon('iconoEditar', sanitizer.bypassSecurityTrustResourceUrl(this.iconoEditar));
    iconRegistry.addSvgIcon('iconoEliminar', sanitizer.bypassSecurityTrustResourceUrl(this.iconoEliminar));
    iconRegistry.addSvgIcon('iconoMas', sanitizer.bypassSecurityTrustResourceUrl(this.iconoMas));
    this.rolUsuarioActual = JSON.parse(localStorage.getItem('usuario')).rol;
    if (this.rolUsuarioActual.id === this.ID_ROL_ADMIN_PRINC || this.rolUsuarioActual.id === this.ID_ROL_ADMIN){
      this.paisUsuario = '0';
    }else if (this.rolUsuarioActual.id === this.ID_ROL_EDITOR_PAIS ){
      this.paisUsuario = String(JSON.parse(localStorage.getItem('usuario')).pais.id);
    }
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
          this.toastr.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });

    this.alertaService.recargarLista.subscribe(() => {
      this.listarAlertas(this.paisUsuario, this.pagina);
    });
    this.listarAlertas(this.paisUsuario, this.pagina);
  }
  openDialogNuevDoc(): void {
    const dialogRef = this.dialog.open(DialogIngresarAlertaComponent, {
      data: {},
      width: '80%'
    });
    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  openEliminar(alerta): void {
    const dialogRef = this.dialog.open(DialogEliminarAlertaComponent, {
      data: alerta,
      width: '80%'
    });
    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  openEditar(alerta): void {
    const dialogRef = this.dialog.open(DialogEditarAlertaComponent, {
      data: alerta,
      width: '80%'
    });
    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  listarAlertas(idCountry: string, page: string): void{
    const url = `${Constants.PATH_LISTAR_PRINCIPAL_ALERTA}?idCountry=${idCountry}&page=${page}&size=${this.NUM_ITEMS_PAGINA}`;
    this.genericoService.get(url).subscribe( res => {
      if (res.message === '200'){
        this.listaAlertas = res.data.Alertas;
        this.configPaginador.totalItems = res.data.totalItems;
      }else if (res.message === 'No se encontraron Alertas'){
        this.toastr.warning(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_NO_DATA : Constants.MENSAJE_NO_DATA);
      }
      else{
        this.toastr.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
      }
    });
  }

  buscarProducto(input: string): void{
    if (input.trim().length !== 0){
      const url = `${Constants.PATH_LISTAR_POR_PRODUCTO}?nomProd=${input}&page=0&size=${this.NUM_ITEMS_PAGINA}`;
      this.genericoService.get(url).subscribe( res => {
        if (res.message === '200'){
          this.listaAlertas = res.data.Alertas;
          this.configPaginador.totalItems = res.data.totalItems;
        }else{
          this.toastr.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        }
      });
    }else{
      this.listarAlertas('0', '0');
    }
  }

  limpiarCampos(filtroCod, filtroProd): void{
    filtroCod.value = '';
    filtroProd.value = '';
    this.listarAlertas(this.paisUsuario, this.pagina);
  }

  buscarCodigo(input: string): void{
    if (input.trim().length !== 0){
      const url = `${Constants.PATH_LISTAR_POR_CODIGO}?idSiar=${input}&page=0&size=${this.NUM_ITEMS_PAGINA}`;
      this.genericoService.get(url).subscribe( res => {
        if (res.message === '200'){
          this.listaAlertas = res.data.Alertas;
          this.configPaginador.totalItems = res.data.totalItems;
        }else{
          this.toastr.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        }
      });
    }else{
      this.listarAlertas('0', '0');
    }
  }

  pageChanged($event): void {
    this.configPaginador.currentPage = $event;
    this.pagina = String($event - 1);
    this.listarAlertas(this.paisUsuario, this.pagina);
  }
}
