import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { Constants } from '../../../common/constants';
import { Pais } from '../../../modelos/pais';
import { GenericoService } from '../../../servicios/generico.service';
import { ToastrService } from 'ngx-toastr';
import {LenguajeService} from '../../../servicios/lenguaje.service';

@Component({
  selector: 'app-dialog-eliminar-doc',
  templateUrl: './dialog-eliminar-doc.component.html',
  styleUrls: ['./dialog-eliminar-doc.component.scss']
})

export class DialogEliminarDocComponent implements OnInit {

  formRegistro: FormGroup;
  paises: Array<Pais>;
  roles: any;
  buscarPais: FormControl;
  buscarRol: FormControl;
  formFiltro: FormGroup;
  formFiltroRol: FormGroup;
  carpeta: string;
  idioma: string;
  textos: any = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private genericoService: GenericoService,
    private lenguajeService: LenguajeService,
    private toastrService: ToastrService,
    public dialogRef: MatDialogRef<DialogEliminarDocComponent>) { }

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
    this.carpeta = this.data.valor.nombre;
  }

  eliminarFolder(): void {
    const url = `/folder/eliminarFolder?id=${this.data.valor.id}`;
    this.genericoService.get(url).subscribe(res => {
      if (res.message === '200') {
        this.dialogRef.close(true);
      } else {
        this.toastrService.error(this.textos?.mensajes ? this.textos?.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
      }
    }, error => {
      console.error(error);
      this.toastrService.error(this.textos?.mensajes ? this.textos?.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
    });
  }
  onNoClick(): void {
    setTimeout(() => {
      this.dialogRef.close();
    }, 1000);

  }

}
