import { Component, OnInit } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { PaginationInstance } from 'ngx-pagination';
import { FormControl, FormGroup } from '@angular/forms';
import { DialogNuevoRolComponent } from '../dialog-nuevo-rol/dialog-nuevo-rol.component';
import { DialogEditRolComponent } from '../dialog-edit-rol/dialog-edit-rol.component';
import { DialogEliminarRolComponent } from '../dialog-eliminar-rol/dialog-eliminar-rol.component';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { GenericoService } from '../../../servicios/generico.service';
import {LenguajeService} from '../../../servicios/lenguaje.service';
import { ToastrService } from 'ngx-toastr';
import {Constants} from '../../../common/constants';
import {Rol} from '../../../modelos/rol';
import {Pais} from '../../../modelos/pais';


@Component({
  selector: 'app-tabla-roles',
  templateUrl: './tabla-roles.component.html',
  styleUrls: ['./tabla-roles.component.scss']
})

export class TablaRolesComponent implements OnInit {
  // Constantes
  req: any;
  list: Array<any>;
  listFilt: Array<any>;
  iconoEditar = Constants.ICON_EDITAR;
  iconoEliminar = Constants.ICON_ELIMINAR;
  page = 0;
  roles: Array<Rol>;
  nRegistros = 8;

  public configPaginador: PaginationInstance = {
    id: 'custom',
    itemsPerPage: this.nRegistros,
    currentPage: this.page,
    totalItems: 0
  };
  idRoles = 0;
  buscarRoles: FormControl;
  paises: Array<number> = [];
  paisList: Array<Pais> = [];
  formFiltro: FormGroup;
  textos: any;
  constructor(
    public dialog: MatDialog,
    private lenguajeService: LenguajeService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private genericoService: GenericoService,
    private toastrService: ToastrService) {
    iconRegistry.addSvgIcon('iconoEditar', sanitizer.bypassSecurityTrustResourceUrl(this.iconoEditar));
    iconRegistry.addSvgIcon('iconoEliminar', sanitizer.bypassSecurityTrustResourceUrl(this.iconoEliminar));
  }

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

    this.page = 0;
    this.consultarRol(this.page, this.nRegistros);
  }

  pageChanged($event): void {
    this.page = $event;
    this.configPaginador.currentPage = $event;
    this.consultarRol(this.page - 1, this.nRegistros);
  }

  optionPais(idPais: number, option: MatOption): string {
    if (this.paises.some(p => p === idPais)) {
      return 'option-selected';
    } else {
      option.deselect();
      return '';
    }
  }

  openDialogNuevRol(): void {
    const dialogRef = this.dialog.open(DialogNuevoRolComponent, {
      data: {},
      width: '80%',
      maxWidth: '1132px'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  openDialogEditRol(valor): void {
    const dialogRef = this.dialog.open(DialogEditRolComponent, {
      data: { rol: valor },
      width: '80%',
      maxWidth: '1132px'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  openDialogEliminarRol(rol): void {
    const dialogRef = this.dialog.open(DialogEliminarRolComponent, {
      data: { valor: rol },
      width: '80%',
      maxWidth: '1132px'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }
  consultarRol(page: number, size: number): void {
    this.roles = [];
    const url = `/rol/listarRolesPermisos?page=${page}&size=${size}`;
    this.genericoService.get(url).subscribe(res => {
      if (res.message === '200') {
        this.roles = res.data.roles;
        this.list = this.roles;
        this.page = res.data.currentPage;
        this.configPaginador.totalItems = res.data.totalItems;
      } else if (res.message === '204') {
        this.toastrService.info(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_NO_DATA : Constants.MENSAJE_NO_DATA);
      } else {
        this.toastrService.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
      }
    }, error => {
      console.error(error);
      this.toastrService.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
    });
  }
  validElim(value): boolean {
    if (value > 0) {
      return true;
    }
    else {
      return false;
    }
  }
  cambiarEstado(rol): void {
    this.req = {
      id: rol.id,
      name: rol.name,
      state: rol.state === 'I' ? 'A' : 'I',
      lstMenu: rol.lstMenu
    };
    const url = `/rol/guardarRol`;
    this.genericoService.post(this.req, url).subscribe(res => {
      if (res.message === '200') {
        console.log('guardarRol OK');
        this.ngOnInit();
      }
    });
  }
  filtrar(value): void {
    this.listFilt = [];
    if (value === undefined) {
      this.ngOnInit();
    }
    else {
      this.listFilt.push(value);
      this.roles = this.listFilt;
    }
  }
}
