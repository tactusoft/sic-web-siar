import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DiagAutoridadComponent } from './diag-autoridad/diag-autoridad.component';
import {ToastrService} from 'ngx-toastr';
import {Constants} from '../../common/constants';
import {LenguajeService} from '../../servicios/lenguaje.service';
import {Pais} from '../../modelos/pais';
import {Autoridad} from '../../modelos/autoridad';
import {GenericoService} from '../../servicios/generico.service';

@Component({
  selector: 'app-autoridades',
  templateUrl: './autoridades.component.html',
  styleUrls: ['./autoridades.component.scss']
})
export class AutoridadesComponent implements OnInit {

  paises: Pais[];
  autoridades: Autoridad;
  paisId = Number(localStorage.getItem('paisId'));
  imageBg: string;
  textos: any;
  idioma: number;
  constructor(
    private toastr: ToastrService,
    private genericoService: GenericoService,
    private lenguajeService: LenguajeService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.lenguajeService.idiomaSubject.subscribe(data => {
      this.idioma = this.lenguajeService.devolverIntIdioma(data);
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
        this.textos = texts;
        }, () => {
          this.toastr.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
    this.getPaises(this.paisId);
  }

  getPaises(pais: number): void {
    const url = `${Constants.PATH_LISTAR_PAIS_LANG}?pais=${pais}&lang=${this.idioma}`;
    this.genericoService.get(url).subscribe(res => {
      if (res.message === '200') {
        this.paises = res.data;
        console.log(this.paises);
        this.imageBg = `url(${this.paises[0].recursos[1].path})`;
      }
    }, error => {
      console.error(error);
    });
  }

  openDialog(autoridad: Autoridad): void {
    const dialogRef = this.dialog.open(DiagAutoridadComponent, {
      data: {
        autoridad,
        title: this.paises[0].nombre,
        image: this.paises[0].recursos[1].path,
        logo: this.paises[0].recursos[0].path
      },
      maxWidth: 'unset',
      panelClass: 'mat-dialog-autoridad'
    });
    dialogRef.afterClosed();
  }
}
