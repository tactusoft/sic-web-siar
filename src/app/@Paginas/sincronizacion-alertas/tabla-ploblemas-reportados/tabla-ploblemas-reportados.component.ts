import { Component, Input, OnInit, ViewChild, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Constants } from '../../../common/constants';
import { ToastrService } from 'ngx-toastr';
import { AlertaSincronizacion } from '../../../modelos/alerta-sincronizacion';
import { DetalleSincronizacion } from '../../../modelos/detalle-sincronizacion';
import { LenguajeService } from '../../../servicios/lenguaje.service';

@Component({
  selector: 'app-tabla-ploblemas-reportados',
  templateUrl: './tabla-ploblemas-reportados.component.html',
  styleUrls: ['./tabla-ploblemas-reportados.component.scss']
})
export class TablaPloblemasReportadosComponent implements OnInit, AfterViewInit {
  /** Constantes */
  columnsProblemasReportados: string[] = ['codigo', 'problema'];
  idioma: string;
  textos: any = null;

  /** Variable */
  @ViewChild(MatPaginator) paginatorProblemas: MatPaginator;
  @Input() alertaSincronizaciones: AlertaSincronizacion;
  @Output() resincronizarAlerta = new EventEmitter<any>();
  filtroActivo = false;
  habilitarResincronizar = false;
  dataProblemasReportados = new MatTableDataSource<DetalleSincronizacion>([]);

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
  }

  ngAfterViewInit(): void {
    this.paginatorProblemas._intl.itemsPerPageLabel = this.textos?.sincronizacion_alertas?.paginador
      ? this.textos?.sincronizacion_alertas.paginador.items_pagina : 'Items por página';
    this.paginatorProblemas._intl.nextPageLabel = this.textos?.sincronizacion_alertas?.paginador
      ? this.textos?.sincronizacion_alertas.paginador.pagina_siguiente : 'Siguiente';
    this.paginatorProblemas._intl.previousPageLabel = this.textos?.sincronizacion_alertas?.paginador
      ? this.textos?.sincronizacion_alertas.paginador.pagina_anterior : 'Anterior';
    this.paginatorProblemas._intl.lastPageLabel = this.textos?.sincronizacion_alertas?.paginador
      ? this.textos?.sincronizacion_alertas.paginador.pagina_final : 'Final';
    this.paginatorProblemas._intl.firstPageLabel = this.textos?.sincronizacion_alertas?.paginador
      ? this.textos?.sincronizacion_alertas.paginador.pagina_inicial : 'Inicial';
    this.dataProblemasReportados.paginator = this.paginatorProblemas;
  }

  cargarData(): void {
    this.dataProblemasReportados.data = this.alertaSincronizaciones.detalleLog;
    this.habilitarResincronizar = !this.validarResincronizacion(this.alertaSincronizaciones.resync);
  }

  filtroProblemas(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataProblemasReportados.filter = filterValue.trim().toLowerCase();
  }

  resincronizar(): void {
    this.resincronizarAlerta.emit(this.alertaSincronizaciones.id);
  }

  gestionarFiltro(): void {
    this.filtroActivo = !this.filtroActivo;
    if (!this.filtroActivo) {
      this.dataProblemasReportados.filter = '';
    }
  }

  validarResincronizacion(resync: any): any {
    try {
      return resync;
    } catch {
      return false;
    }
  }

}
