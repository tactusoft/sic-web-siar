import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {PaginationInstance} from 'ngx-pagination';
import {Pais} from '../../../modelos/pais';
import {LenguajeService} from '../../../servicios/lenguaje.service';
import {Constants} from '../../../common/constants';


@Component({
  selector: 'app-consultar-atlas',
  templateUrl: './consultar-atlas.component.html',
  styleUrls: ['./consultar-atlas.component.scss']
})
export class ConsultarAtlasComponent implements OnInit {

  paises: Array<number> = [];
  paisList: Array<Pais> = [];
  buscarPais: FormControl;
  mostrarConfirmacion = false;
  paisIdUsuario = 0;
  textos: any;
  idPais1 = 0;
  idPais2 = 0;

  public configPaginador: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 20,
    currentPage: 0,
    totalItems: 0
  };

  constructor(public dialog: MatDialog,
              private toastrService: ToastrService,
              private lenguajeService: LenguajeService) {
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

  }

  cancelar(): void {
    this.idPais1 = 0;
    this.idPais2 = 0;
  }

}

