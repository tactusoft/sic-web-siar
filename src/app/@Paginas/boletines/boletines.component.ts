import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { PaginationInstance } from 'ngx-pagination';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Boletin } from '../../modelos/boletin';
import { GenericoService } from '../../servicios/generico.service';
import { Utils } from '../../common/utils';
import { ToastrService } from 'ngx-toastr';
import { LenguajeService } from '../../servicios/lenguaje.service';
import { Constants } from '../../common/constants';

@Component({
  selector: 'app-boletines',
  templateUrl: './boletines.component.html',
  styleUrls: ['./boletines.component.scss']
})
export class BoletinesComponent implements OnInit, AfterViewInit {

  nRegistros = 10;
  totalRegistros = 0;
  page: 0;
  mostrarFiltro = false;

  public configPaginador: PaginationInstance = {
    id: 'custom',
    itemsPerPage: this.nRegistros,
    currentPage: 0,
    totalItems: 0
  };
  filtroMes = new FormControl();
  filtroAno = new FormControl();

  filteredMeses: Observable<any[]>;
  filteredAno: Observable<any[]>;

  anoSeleted = [];
  mesSeleted = [];

  mesList = [];
  anoList = [];
  panelOpenState = false;
  boletines: Array<Boletin> = [];
  textos: any;

  formFiltroBoletin: FormGroup;
  constructor(
    private genericoService: GenericoService,
    private util: Utils,
    private lenguajeService: LenguajeService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.lenguajeService.idiomaSubject.subscribe(data => {
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
        this.textos = texts;
      }, () => {
        this.toastr.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
      });
    });
    this.formFiltroBoletin = new FormGroup({
      ano: new FormControl(),
      mes: new FormControl()
    });
    this.getBoletines([], [], 0, this.nRegistros);
    this.getFiltroBoletines([]);
    this.formFiltroBoletin.get('ano').valueChanges.subscribe(data => {
      this.anoSeleted = data;
      this.mostrarFiltroBoletines();
      this.configPaginador.currentPage = 0;
      this.getBoletines(this.anoSeleted, this.mesSeleted, 0, this.nRegistros);
    });
    this.formFiltroBoletin.get('mes').valueChanges.subscribe(data => {
      this.mesSeleted = data;
      this.mostrarFiltroBoletines();
      this.configPaginador.currentPage = 0;
      this.getBoletines(this.anoSeleted, this.mesSeleted, 0, this.nRegistros);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadTableauScript();
    }, 1000);
  }

  getBoletines(ano: Array<any>, mes: Array<any>, pagina: number, registros: number): void {
    const anos = [];
    const meses = [];
    ano.forEach(a => anos.push(a.ano));
    mes.forEach(m => meses.push(m.mes));
    /*const url = `/boletin/listarBoletin?ano=${anos.toString()}&mes=${meses.toString()}&pagina=${pagina}&nRegistros=${registros}`;*/
    const url = `/boletin/listarBoletinRecurso?ano=${anos.toString()}&mes=${meses.toString()}&pagina=${pagina}&nRegistros=${registros}`;
    this.genericoService.get(url).subscribe(res => {
      if (res.message === '200') {
        this.boletines = res.data.boletines;
        this.totalRegistros = res.data.totalItems;
        this.configPaginador.totalItems = this.totalRegistros;
      } else if (res.message === 'No se encontraron boletines') {
        this.boletines = [];
        this.totalRegistros = 0;
        this.configPaginador.totalItems = 0;
      } else {
        this.boletines = [];
        this.totalRegistros = 0;
        this.configPaginador.totalItems = 0;
        this.toastr.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
      }
    });
  }

  getFiltroBoletines(ano: Array<any>): void {
    const anos = ano.map(a => a.ano);
    const url = `/boletin/filtro?ano=${anos.toString()}`;
    this.genericoService.get(url).subscribe(res => {
      if (res.message === '200') {
        this.anoList = res.data.anos;
        this.anoList.sort((a, b) => b.ano > a.ano ? 1 : b.ano < a.ano ? -1 : 0);
        this.mesList = res.data.meses;
        this.mesList.sort((a, b) => b.mes < a.mes ? 1 : b.mes > a.mes ? -1 : 0);
      }
      this.prepararFiltro();
    });
  }

  prepararFiltro(): void {
    this.filteredMeses = this.filtroMes.valueChanges.pipe(
      startWith(''),
      map(value => this._filterMes(value))
    );

    this.filteredAno = this.filtroAno.valueChanges.pipe(
      startWith(''),
      map(value => this._filterAno(value))
    );
  }

  removeAno(item: any): void {
    const idx = this.anoSeleted.findIndex(a => a.descripcion === item.descripcion);
    this.anoSeleted.splice(idx);
    this.formFiltroBoletin.get('ano').setValue(this.anoSeleted);
  }
  removeMes(item: any): void {
    const idx = this.mesSeleted.findIndex(a => a.descripcion === item.descripcion);
    this.mesSeleted.splice(idx);
    this.formFiltroBoletin.get('ano').setValue(this.mesSeleted);
  }
  optionAno(ano: any, option: MatOption): string {
    if (this.anoSeleted.some(a => a.ano === ano.ano)) {
      return 'option-selected';
    } else {
      option.deselect();
      return '';
    }
  }
  optionMes(mes: any, option: MatOption): string {
    if (this.mesSeleted.some(m => m.mes === mes.mes)) {
      return 'option-selected';
    } else {
      option.deselect();
      return '';
    }
  }
  limpiarFiltro(): void {
    this.mesSeleted = [];
    this.anoSeleted = [];
    this.formFiltroBoletin.get('ano').setValue(this.anoSeleted);
    this.formFiltroBoletin.get('mes').setValue(this.mesSeleted);
    this.configPaginador.currentPage = 1;
    this.mostrarFiltro = false;
    this.getFiltroBoletines([]);
  }

  pageChanged($event): void {
    this.page = $event;
    this.configPaginador.currentPage = this.page;
    this.getBoletines(this.anoSeleted, this.mesSeleted, this.page - 1, this.nRegistros);
  }

  private _filterMes(value: string): any[] {
    const filterValue = this._normalizeValue(value);
    return this.mesList.filter(mes => this._normalizeValue(mes.mes).includes(filterValue));
  }
  private _filterAno(value: string): any[] {
    const filterValue = this._normalizeValue(value);
    return this.anoList.filter(ano => this._normalizeValue(ano.ano).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    value = value.toString();
    return value.toLowerCase().replace(/\s/g, '');
  }
  getMes(idMes: number): string {
    const mes = this.util.getMes(idMes);
    return mes[0].mes;
  }

  mostrarFiltroBoletines(): any {
    if (
      this.anoSeleted.length === 0 &&
      this.mesSeleted.length === 0) {
      this.mostrarFiltro = false;
    } else {
      this.mostrarFiltro = true;
    }
  }

  loadTableauScript(): void {
    const divElement = document.getElementById('viz1732797204618');
    if (divElement) {
      const vizElement = divElement.getElementsByTagName('object')[0];
      if (divElement.offsetWidth > 800) {
        vizElement.style.width = '1170px';
        vizElement.style.height = '2027px';
      } else if (divElement.offsetWidth > 500) {
        vizElement.style.width = '1170px';
        vizElement.style.height = '2027px';
      } else {
        vizElement.style.width = '100%'; vizElement.style.height = '877px';
      }
      const scriptElement = document.createElement('script');
      scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
      vizElement?.parentNode?.insertBefore(scriptElement, vizElement);
    }
  }
}
