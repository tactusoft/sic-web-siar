import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Constants } from '../../../common/constants';
import { ToastrService } from 'ngx-toastr';
import { RegistroHomologacion, TipoHomologacion } from '../../../modelos/registro-homologacion';
import { LenguajeService } from '../../../servicios/lenguaje.service';

@Component({
  selector: 'app-tabla-pais',
  templateUrl: './tabla-pais.component.html',
  styleUrls: ['./tabla-pais.component.scss']
})
export class TablaPaisComponent implements OnInit, AfterViewInit {
  /** Constantes */
  TIPO_HOMOLOGACION = TipoHomologacion.TipoP;
  columnsMapa: string[] = ['editar', 'nombre_externo', 'nombre_siar'];
  idioma: string;
  textos: any = null;

  /** Variables */
  @ViewChild(MatPaginator) paginatorPais: MatPaginator;
  @Input() listaPaises: RegistroHomologacion[];
  @Input() administar: boolean;
  @Output() administrarHomologacion = new EventEmitter<any>();
  dataPais = new MatTableDataSource<RegistroHomologacion>([]);
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
    this.paginatorPais._intl.itemsPerPageLabel = this.textos?.sincronizacion_alertas?.paginador
      ? this.textos?.sincronizacion_alertas.paginador.items_pagina : 'Items por página';
    this.paginatorPais._intl.nextPageLabel = this.textos?.sincronizacion_alertas?.paginador
      ? this.textos?.sincronizacion_alertas.paginador.pagina_siguiente : 'Siguiente';
    this.paginatorPais._intl.previousPageLabel = this.textos?.sincronizacion_alertas?.paginador
      ? this.textos?.sincronizacion_alertas.paginador.pagina_anterior : 'Anterior';
    this.paginatorPais._intl.lastPageLabel = this.textos?.sincronizacion_alertas?.paginador
      ? this.textos?.sincronizacion_alertas.paginador.pagina_final : 'Final';
    this.paginatorPais._intl.firstPageLabel = this.textos?.sincronizacion_alertas?.paginador
      ? this.textos?.sincronizacion_alertas.paginador.pagina_inicial : 'Inicial';
    this.dataPais.paginator = this.paginatorPais;
  }

  cargarData(): void {
    this.dataPais.data = this.listaPaises;
  }

  filtroPaises(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataPais.filter = filterValue.trim().toLowerCase();
  }

  administrarSincronizacion(nuevoRegistro: boolean, registro: any = null): void {
    this.administrarHomologacion.emit({ nuevoRegistro, tipoRegistro: this.TIPO_HOMOLOGACION, registro });
  }

  gestionarFiltro(): void {
    this.filtroActivo = !this.filtroActivo;
    if (!this.filtroActivo) {
      this.dataPais.filter = '';
    }
  }

}
