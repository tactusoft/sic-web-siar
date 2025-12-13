import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {GenericoService} from '../../../servicios/generico.service';
import {Constants} from '../../../common/constants';
import {ToastrService} from 'ngx-toastr';
import {LenguajeService} from '../../../servicios/lenguaje.service';
import {Directorio} from '../../../modelos/directorio';

@Component({
  selector: 'app-dialog-eliminar-directorio',
  templateUrl: './dialog-eliminar-directorio.component.html',
  styleUrls: ['./dialog-eliminar-directorio.component.scss']
})
export class DialogEliminarDirectorioComponent implements OnInit {

  directorio: Directorio;
  idioma: string;
  textos: any = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private genericoService: GenericoService,
    private lenguajeService: LenguajeService,
    private toastrService: ToastrService,
    private dialogRef: MatDialogRef<DialogEliminarDirectorioComponent>) {
  }

  ngOnInit(): void {

    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {

      this.idioma = data;

      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(this.idioma).subscribe(texts => {
          this.textos = texts;
        },
        () => {
          this.toastrService.error(this.textos?.mensajes ? this.textos?.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });

    this.directorio = this.data.directorio;
  }

  eliminarEvento(): void {
    const url = `/directorio/eliminar?idDirectorio=${this.directorio.id}`;
    this.genericoService.delete(url).subscribe(
      res => {
        if (res) {
          this.dialogRef.close(res);
        }
      });
  }

}
