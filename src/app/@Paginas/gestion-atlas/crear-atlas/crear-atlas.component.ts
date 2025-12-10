import {Component, OnInit} from '@angular/core';
import {Constants} from '../../../common/constants';
import {LenguajeService} from '../../../servicios/lenguaje.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-crear-atlas',
  templateUrl: './crear-atlas.component.html',
  styleUrls: ['./crear-atlas.component.scss']
})
export class CrearAtlasComponent implements OnInit {

  idPais = 0;
  textos: any;
  mapIds: Map<number, number>;
  paisesListIdioma: any = [];

  idioma: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private lenguajeService: LenguajeService,
    private toastrService: ToastrService,
  ) {
  }

  ngOnInit(): void {

    // const user: Usuario = JSON.parse(localStorage.getItem('usuario'));

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

    this.activatedRoute.paramMap.subscribe(params => {
      this.idPais = parseInt(params.get('id'), 0);
    });

  }

}


