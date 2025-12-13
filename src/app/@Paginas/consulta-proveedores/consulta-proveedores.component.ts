import { Component, OnInit } from '@angular/core';
import { Proveedor } from '../../modelos/proveedor';
import { GenericoService } from '../../servicios/generico.service';
import { PaginationInstance } from 'ngx-pagination';
import { FormControl, FormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core/option';
import { Constants } from '../../common/constants';
import { MatDialog } from '@angular/material/dialog';
import { DialogAgregarComponent } from './dialog-agregar/dialog-agregar.component';
import { ToastrService } from 'ngx-toastr';
import { LenguajeService } from '../../servicios/lenguaje.service';
import { ConsultaProveedoresService } from './consulta-proveedores.service';
import { PaisesService } from 'src/app/servicios/paises.service';

@Component({
  selector: 'app-proveedores-consulta',
  templateUrl: './consulta-proveedores.component.html',
  styleUrls: ['./consulta-proveedores.component.scss']
})
export class ConsultaProveedoresComponent implements OnInit {

  registros: Array<Proveedor> = [];
  paisesListIdioma: any = [];
  categoriasListIdioma: any = [];
  pagina = '0';
  totalRegistros = '16';
  pais = String(localStorage.getItem('paisId'));
  categoria = '';
  public configPaginador: PaginationInstance = {
    id: 'custom',
    itemsPerPage: Number(this.totalRegistros),
    currentPage: 1,
    totalItems: 0
  };
  buscarPais: FormControl;
  buscarCategoria: FormControl;
  formFiltro: FormGroup;
  categoriaList: Array<any>;
  paisesList: Array<any>;
  paisesInput: Array<any>;
  categoriaInput: Array<any>;
  panelOpenState = false;
  idioma: number;
  textos: any = null;

  constructor(
    private genericoService: GenericoService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private gestionService: ConsultaProveedoresService,
    private lenguajeService: LenguajeService,
    private paisesService: PaisesService
  ) { }

  ngOnInit(): void {

    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      this.idioma = this.lenguajeService.devolverIntIdioma(data);

      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
        this.textos = texts;
        this.obtenerCategoriasIdioma();
      },
        () => {
          this.toastr.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
    this.buscarPais = new FormControl('');
    this.buscarCategoria = new FormControl('');
    this.formFiltro = new FormGroup({
      pais: new FormControl(),
      categoria: new FormControl()
    });
    this.formFiltro.get('pais').valueChanges.subscribe(data => {
      this.paisesInput = data;
      const paisFil = this.paisesInput === undefined ? '' : this.getIdsFiltro(this.paisesInput);
      const categoriaFil = this.categoriaInput === undefined ? '' : this.getIdsFiltro(this.categoriaInput);
      console.log(paisFil, categoriaFil);
      this.getCantidadDocumentos();
      this.getRegistros(paisFil, this.pagina, categoriaFil, this.totalRegistros);
    });
    this.formFiltro.get('categoria').valueChanges.subscribe(data => {
      this.categoriaInput = data;
      const paisFil = this.paisesInput === undefined ? '' : this.getIdsFiltro(this.paisesInput);
      const categoriaFil = this.categoriaInput === undefined ? '' : this.getIdsFiltro(this.categoriaInput);
      this.getCantidadDocumentos();
      this.getRegistros(paisFil, this.pagina, categoriaFil, this.totalRegistros);
    });

    this.getCantidadDocumentos();
    this.getRegistros('', this.pagina, '', this.totalRegistros);
    this.gestionService.recargarDocumentos.subscribe(() => {
      this.getCantidadDocumentos();
      const paisFil = this.paisesInput === undefined ? '' : this.getIdsFiltro(this.paisesInput);
      const categoriaFil = this.categoriaInput === undefined ? '' : this.getIdsFiltro(this.categoriaInput);
      this.getRegistros(paisFil, this.pagina, categoriaFil, this.totalRegistros);
    });

    this.getCantidadDocumentos();
    this.getRegistros('', this.pagina, '', this.totalRegistros);
    this.paisesService.listaPaises.subscribe(cambio => {
      if (cambio) {
        this.paisesListIdioma = this.paisesService.listadoPaises;
      }
    });
    this.obtenerCategoriasIdioma();
    this.paisesListIdioma = this.paisesService.listadoPaises;
  }

  getRegistros(pais: string, pagina: string, categoria: string, totalRegistros: string): void {
    console.log(pais + '' + categoria);
    const url = `/proveedor/listar?page=${pagina}&size=${totalRegistros}`;
    this.genericoService.get(url).subscribe(res => {
      if (res.message === '200') {
        this.registros = res.data.result;
        this.configPaginador.totalItems = res.data.totalItems;
      } else if (res.message === '204') {
        this.toastr.info(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_NO_DATA : Constants.MENSAJE_NO_DATA);
        this.registros = [];
        this.configPaginador.totalItems = 0;
      } else {
        this.toastr.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
      }
    }, error => {
      console.error(error);
      this.toastr.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
    });
  }

  getCantidadDocumentos(): void {
    // const url = `/documento/cantidadDocumentosFiltro?paises=${pais}&cat=${categoria}`;
    const url = `/documento/cantidadDocumentosFiltro?idioma=${this.idioma}`;
    this.genericoService.get(url).subscribe(res => {
      if (this.paisesList === undefined) {
        this.paisesList = res.data.cantidadPais;
      } else {
        for (const reg of res.data.cantidadPais) {
          this.paisesList.map(x => {
            if (x.id === reg.id) {
              x.cantidad = reg.cantidad;
            }
          });
        }
      }
      if (this.categoriaList === undefined) {
        this.categoriaList = res.data.cantidadCategoria;
      } else {
        for (const reg of res.data.cantidadCategoria) {
          this.categoriaList.map(x => {
            if (x.id === reg.id) {
              x.cantidad = reg.cantidad;
            }
          });
        }
      }
    }, error => {
      console.error(error);
      this.toastr.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
    });
  }

  obtenerCategoriasIdioma(): void {
    const url = `${Constants.PATH_LISTAR_DOMINIO_NOMBRE_LANG}?nombre=Categoria Documentos&idioma=${this.idioma}`;
    this.genericoService.get(url).subscribe(res => {
      res.data.dominio[0].subDominio.sort((a, b) => b.description.toUpperCase().trim() < a.description.toUpperCase().trim()
        ? -1 : b.description.toUpperCase().trim() > a.description.toUpperCase().trim() ? 1 : 0);
      this.categoriasListIdioma = res.data.dominio[0].subDominio;
    });
  }

  pageChanged($event): void {
    this.configPaginador.currentPage = $event;
    this.pagina = String($event - 1);
    const paisFil = this.paisesInput === undefined ? '' : this.getIdsFiltro(this.paisesInput);
    const categoriaFil = this.categoriaInput === undefined ? '' : this.getIdsFiltro(this.categoriaInput);
    this.getRegistros(paisFil, this.pagina, categoriaFil, this.totalRegistros);
  }

  optionPais(idPais: number, option: MatOption): string {
    if (this.paisesInput !== undefined) {
      if (this.paisesInput.some(p => p.id === idPais)) {
        return 'option-selected';
      } else {
        option.deselect();
        return '';
      }
    }
  }

  optionTipo(idTipo: number, option: MatOption): string {
    if (this.categoriaInput !== undefined) {
      if (this.categoriaInput.some(t => t.id === idTipo)) {
        return 'option-selected';
      } else {
        option.deselect();
        return '';
      }
    }
  }

  limpiarFiltro(): void {
    this.formFiltro.get('pais').setValue([]);
    this.formFiltro.get('categoria').setValue([]);
    this.paisesInput = [];
    this.categoriaInput = [];
  }

  mostrar(filtro: string = '', campo: string): boolean {
    if (filtro.length > 0) {
      if (campo.toLowerCase().includes(filtro.toLowerCase())) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }

  mostrarLimpiarFiltro(): boolean {
    const catLong = this.categoriaInput === undefined ? 0 : this.categoriaInput.length;
    const paisLong = this.paisesInput === undefined ? 0 : this.paisesInput.length;
    return (catLong + paisLong) > 1;
  }

  removePais(idPais): void {
    const index = this.paisesInput.findIndex(x => x.id === idPais);
    this.paisesInput.splice(index);
    this.formFiltro.get('pais').setValue(this.paisesInput);
  }
  removeCategoria(idTipo): void {
    const index = this.categoriaInput.findIndex(x => x.id === idTipo);
    this.categoriaInput.splice(index);
    this.formFiltro.get('categoria').setValue(this.categoriaInput);
  }

  getIdsFiltro(lista: Array<any>): string {
    let idFil = '';
    lista.forEach(value => idFil = idFil + String(value.id) + ',');
    idFil = idFil.slice(0, -1);
    return idFil;
  }

  abrirEditar(): void {
    const dialogRef = this.dialog.open(DialogAgregarComponent, {
      width: '80%',
      panelClass: 'mat-add-doc-public-diag'
    });
    dialogRef.afterClosed();
  }

  getDescripcionPais(pais: any): string {
    try {
      return this.paisesListIdioma.find(item => item.id === pais.id).nombre.trim();
    } catch {
      return pais.descripcion.trim();
    }
  }

  getDescripcionCategoria(categoria: any): string {
    try {
      return this.categoriasListIdioma.find(item => item.id === categoria.id).description.trim();
    } catch {
      return categoria.description.trim();
    }
  }
}
