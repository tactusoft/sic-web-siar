import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Constants } from '../../../common/constants';
import { ToastrService } from 'ngx-toastr';
import { RegistroHomologacion, TipoHomologacion } from '../../../modelos/registro-homologacion';
import { LenguajeService } from '../../../servicios/lenguaje.service';

@Component({
  selector: 'app-tabla-categoria',
  templateUrl: './tabla-categoria.component.html',
  styleUrls: ['./tabla-categoria.component.scss']
})
export class TablaCategoriaComponent implements OnInit, AfterViewInit {
  /** Constantes */
  TIPO_HOMOLOGACION = TipoHomologacion.TipoC;
  columnsMapa: string[] = ['editar', 'nombre_externo', 'nombre_siar'];
  idioma: string;
  textos: any = null;

  /** Variables */
  @ViewChild(MatPaginator) paginatorCategorias: MatPaginator;
  @Input() listaCategorias: RegistroHomologacion[];
  @Input() administar: boolean;
  @Output() administrarHomologacion = new EventEmitter<any>();
  dataCategoria = new MatTableDataSource<RegistroHomologacion>([]);
  filtroActivo = false;

  constructor(
    private toastr: ToastrService,
    private lenguajeService: LenguajeService,
  ) { }

  ngOnInit(): void {
    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      this.idioma = data;
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(this.idioma).subscribe(texts => {
        this.textos = texts;
      },
        () => {
          this.toastr.error(this.textos?.mensajes ? this.textos?.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });

    this.cargarData();
    if (!this.administar) {
      this.columnsMapa.shift();
    }
  }

  ngAfterViewInit(): void {
    this.paginatorCategorias._intl.itemsPerPageLabel = this.textos?.sincronizacion_alertas?.paginador
      ? this.textos?.sincronizacion_alertas.paginador.items_pagina : 'Items por página';
    this.paginatorCategorias._intl.nextPageLabel = this.textos?.sincronizacion_alertas?.paginador
      ? this.textos?.sincronizacion_alertas.paginador.pagina_siguiente : 'Siguiente';
    this.paginatorCategorias._intl.previousPageLabel = this.textos?.sincronizacion_alertas?.paginador
      ? this.textos?.sincronizacion_alertas.paginador.pagina_anterior : 'Anterior';
    this.paginatorCategorias._intl.lastPageLabel = this.textos?.sincronizacion_alertas?.paginador
      ? this.textos?.sincronizacion_alertas.paginador.pagina_final : 'Final';
    this.paginatorCategorias._intl.firstPageLabel = this.textos?.sincronizacion_alertas?.paginador
      ? this.textos?.sincronizacion_alertas.paginador.pagina_inicial : 'Inicial';
    this.dataCategoria.paginator = this.paginatorCategorias;
  }

  cargarData(): void {
    this.dataCategoria.data = this.listaCategorias;
  }

  filtroCategorias(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataCategoria.filter = filterValue.trim().toLowerCase();
  }

  administrarSincronizacion(nuevoRegistro: boolean, registro: any = null): void {
    this.administrarHomologacion.emit({ nuevoRegistro, tipoRegistro: this.TIPO_HOMOLOGACION, registro });
  }

  gestionarFiltro(): void {
    this.filtroActivo = !this.filtroActivo;
    if (!this.filtroActivo) {
      this.dataCategoria.filter = '';
    }
  }

}
