import {Component, OnInit} from '@angular/core';
import {Pais} from '../../modelos/pais';
import {FormControl} from '@angular/forms';
import {PaginationInstance} from 'ngx-pagination';
import {ToastrService} from 'ngx-toastr';
import {LenguajeService} from '../../servicios/lenguaje.service';
import {Constants} from '../../common/constants';

@Component({
  selector: 'app-plantillas-atlas',
  templateUrl: './plantillas-atlas.component.html',
  styleUrls: ['./plantillas-atlas.component.scss']
})
export class PlantillasAtlasComponent implements OnInit {

  paises: Array<number> = [];
  paisList: Array<Pais> = [];
  buscarPais: FormControl;
  mostrarConfirmacion = false;
  paisIdUsuario = 0;
  textos: any;

  public configPaginador: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 20,
    currentPage: 0,
    totalItems: 0
  };

  constructor(// public dialog: MatDialog,
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

}
