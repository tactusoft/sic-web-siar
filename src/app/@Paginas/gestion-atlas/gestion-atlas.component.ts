import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {LenguajeService} from '../../servicios/lenguaje.service';
import {ToastrService} from 'ngx-toastr';
import {PaginationInstance} from 'ngx-pagination';
import {Constants} from '../../common/constants';
import {Pais} from '../../modelos/pais';
import {Router} from '@angular/router';
import {Usuario} from '../../modelos/usuario';

@Component({
  selector: 'app-gestion-atlas',
  templateUrl: './gestion-atlas.component.html',
  styleUrls: ['./gestion-atlas.component.scss']
})
export class GestionAtlasComponent implements OnInit {

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
              private lenguajeService: LenguajeService,
              private router: Router) {
  }

  ngOnInit(): void {

    const user: Usuario = JSON.parse(localStorage.getItem('usuario'));
    this.paisIdUsuario = user !== null ? user.pais.id : 0;

    if (this.paisIdUsuario === 0 || user === null) {
      this.router.navigate(['/']);
      this.toastrService.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
    }

    if (user.rol.id === Constants.ID_ROL_PAIS_W) {
      this.router.navigate(['/gestionAtlas/crear', this.paisIdUsuario]);
    }

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
