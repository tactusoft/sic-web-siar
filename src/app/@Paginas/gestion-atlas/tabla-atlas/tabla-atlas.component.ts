import {Component, OnInit} from '@angular/core';
import {PaginationInstance} from 'ngx-pagination';
import {FormControl} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {LenguajeService} from '../../../servicios/lenguaje.service';
import {Constants} from '../../../common/constants';
import {Pais} from '../../../modelos/pais';
import {GenericoService} from '../../../servicios/generico.service';
import {PaisesService} from '../../../servicios/paises.service';

@Component({
  selector: 'app-tabla-atlas',
  templateUrl: './tabla-atlas.component.html',
  styleUrls: ['./tabla-atlas.component.scss']
})
export class TablaAtlasComponent implements OnInit {

  page = 0;
  nRegistros = 20;
  paises: Array<Pais> = [];
  idPais = 0;
  public configPaginador: PaginationInstance = {
    id: 'custom',
    itemsPerPage: this.nRegistros,
    currentPage: this.page,
    totalItems: 0
  };
  buscarPais: FormControl;
  paisesList: Array<Pais> = [];
  paisesListIdioma: any = [];
  // formFiltro5: FormGroup;
  textos: any;
  idioma: number;
  filtro = '';

  constructor(
    private lenguajeService: LenguajeService,
    private paisesService: PaisesService,
    private genericoService: GenericoService,
    private toastrService: ToastrService) {
  }

  ngOnInit(): void {

    this.lenguajeService.idiomaSubject.subscribe(data => {
      this.idioma = this.lenguajeService.devolverIntIdioma(data);
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
          this.textos = texts;
        },
        () => {
          this.toastrService.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
    this.buscarPais = new FormControl('');
    this.consultarPaises();

    this.paisesService.listaPaises.subscribe(cambio => {
      if (cambio) {
        this.paisesListIdioma = this.paisesService.listadoPaises;
      }
    });
    this.paisesListIdioma = this.paisesService.listadoPaises;

  }

  pageChanged($event): void {
    this.page = $event;
    this.configPaginador.currentPage = $event;
  }

  consultarPaises(): any {
    const region = 'America';
    const url = `${Constants.PATH_LISTAR_PAIS_LANG}?pais=0&lang=${this.idioma}&region=${region}`;
    console.log(url);
    this.genericoService.get(url).subscribe(res => {
      if (res.data && res.success && res.message === '200' && res.status === 'OK') {
        res.data.sort((f, s) => {
          const a = f.nombre.toUpperCase().trim();
          const b = s.nombre.toUpperCase().trim();
          return a < b ? -1 : a > b ? 1 : 0;
        });
        this.paises = res.data;
      }
    });

  }

  getDescripcionPais(pais: any): string {
    try {
      let nombre = '';
      nombre = this.paisesListIdioma.find(item => item.id === pais.id).nombre.trim();

      pais.nombre = nombre;
      return nombre;
    } catch {
      return pais.nombre.trim();
    }
  }

}

