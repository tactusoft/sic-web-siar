import { Component, Input, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Constants } from '../../../common/constants';
import { MatDialog } from '@angular/material/dialog';
import { DialogNuevoDocComponent } from '../dialog-nuevo-doc/dialog-nuevo-doc.component';
import { DialogEditDocComponent } from '../dialog-edit-doc/dialog-edit-doc.component';
import { DialogEliminarDocComponent } from '../dialog-eliminar-doc/dialog-eliminar-doc.component';
import { GenericoService } from '../../../servicios/generico.service';
import { ToastrService } from 'ngx-toastr';
import { PaginationInstance } from 'ngx-pagination';
import { formatDate } from '@angular/common';
import { GestDocService } from '../gest-doc.service';
import {LenguajeService} from '../../../servicios/lenguaje.service';


interface FoodNode {
  id?: number;
  archivo: string;
  tamano?: number;
  modificacion: string;
  tipo: string;
  accion?: any;
  url?: any;
  hijos?: any[];
}
interface ExampleFlatNode {
  expandable: boolean;
  archivo: string;
  tamano: number;
  modificacion: string;
  tipo: string;
  level: number;
}

@Component({
  selector: 'app-table-doc-privados',
  templateUrl: './table-doc-privados.component.html',
  styleUrls: ['./table-doc-privados.component.scss']
})
export class DialogFolderComponent implements OnInit {
  @Input() administrar = false;

  fech = '';
  page = 0;
  nRegistros = 1000;
  carpeta = 'carpeta';
  column = true;
  idioma: string;
  textos: any = null;


  public configPaginador: PaginationInstance = {
    id: 'custom',
    itemsPerPage: this.nRegistros,
    currentPage: this.page,
    totalItems: 0
  };
  iconoEditar = Constants.ICON_EDITAR;
  iconoCargueFile = Constants.ICON_CARGAR_FILE;
  displayedColumns: string[] = ['archivo', 'tamano', 'modificacion', 'tipo'];

  private transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.hijos && node.hijos.length > 0,
      archivo: node.archivo,
      tamano: node.tamano,
      modificacion: node.modificacion,
      tipo: node.tipo,
      accion: node.accion,
      url: node.url,
      id: node.id,
      hijos: node.hijos,
      level,
    };
  }


  // tslint:disable-next-line:member-ordering
  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  // tslint:disable-next-line:member-ordering
  treeFlattener = new MatTreeFlattener(
    this.transformer, node => node.level,
    node => node.expandable, node => node.hijos);

  // tslint:disable-next-line:member-ordering
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    private gestDocService: GestDocService,
    private genericoService: GenericoService,
    private toastrService: ToastrService,
    private lenguajeService: LenguajeService,
    public dialog: MatDialog,
  ) {
  }

  descargarArchivo(ruta): void {
    this.gestDocService.descargarArchivo(ruta).subscribe(data => {
      const blob = new Blob([data]);
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }

  filtrarNombre(val): void {
    this.listarFolder(val, '');
  }
  filtrarFecha(val): void {
    const valor = formatDate(val.value, 'yyyy-MM-dd', 'en-GB');
    this.listarFolder('', valor);
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
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

    if (this.administrar && this.column) {
      this.displayedColumns.push('accion');
      this.column = false;
    }
    this.page = 0;
    this.listarFolder('', '');
  }
  pageChanged($event): void {
    this.page = $event;
    this.configPaginador.currentPage = $event;
    this.listarFolder('', '');
  }

  openDialogNuevDoc(): void {
    const dialogRef = this.dialog.open(DialogNuevoDocComponent, {
      data: {},
      width: '95%',
      height: '75%',
      maxWidth: '1132px'
    });
    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }
  openDialogEditDoc(val): void {
    const dialogRef = this.dialog.open(DialogEditDocComponent, {
      data: { valor: val },
      width: '95%',
      height: '75%',
      maxWidth: '1132px'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  openDialogEliminarDoc(val): void {
    const dialogRef = this.dialog.open(DialogEliminarDocComponent, {
      data: { valor: val },
      width: '95%',
      maxWidth: '1132px'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }
  clearStartDate(): void {
    this.fech = ' ';
    const TREE_DATA: FoodNode[] = [];
    this.dataSource.data = TREE_DATA;
    this.ngOnInit();
  }
  listarFolder(nombre: string, fecha: string): void {
    const url = `/folder/listarFolder?nombre=${nombre}&fecha=${fecha}`;
    this.genericoService.get(url).subscribe(res => {
      if (res.message === '200') {
        const TREE_DATA: FoodNode[] = [];
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < res.data.length; i = i + 1) {
          const TREE_CHILD: FoodNode[] = [];
          // tslint:disable-next-line:prefer-for-of
          for (let j = 0; j < res.data[i].recursos.length; j = j + 1) {
            let bytes = res.data[i].recursos[j].size;
            if (bytes >= 1073741824) { bytes = (bytes / 1073741824).toFixed(2) + ' GB'; }
            else if (bytes >= 1048576) { bytes = (bytes / 1048576).toFixed(2) + ' MB'; }
            else if (bytes >= 1024) { bytes = (bytes / 1024).toFixed(2) + ' KB'; }
            else if (bytes > 1) { bytes = bytes + ' bytes'; }
            else if (bytes === 1) { bytes = bytes + ' byte'; }
            else { bytes = '0 bytes'; }
            TREE_CHILD.push(
              {
                id: res.data[i].recursos[j].id,
                url: res.data[i].recursos[j].path,
                archivo: res.data[i].recursos[j].name,
                tamano: bytes,
                modificacion: res.data[i].recursos[j].date,
                tipo: 'Archivo',
              }
            );
          }
          TREE_DATA.push(
            {
              id: res.data[i].id,
              archivo: res.data[i].nombre,
              modificacion: res.data[i].fecha,
              tipo: 'carpeta',
              hijos: TREE_CHILD
            }
          );
        }
        this.dataSource.data = TREE_DATA;
      } else if (res.message === '204') {
        const TREE_DATA: FoodNode[] = [];
        this.dataSource.data = TREE_DATA;
      } else {
        this.toastrService.error(this.textos?.mensajes ? this.textos?.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
      }
    }, error => {
      console.error(error);
      this.toastrService.error(this.textos?.mensajes ? this.textos?.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
    });
  }

}
