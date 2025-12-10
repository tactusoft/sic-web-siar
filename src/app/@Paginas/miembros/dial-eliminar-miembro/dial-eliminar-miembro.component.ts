import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GenericoService } from '../../../servicios/generico.service';
import {Constants} from '../../../common/constants';
import { ToastrService } from 'ngx-toastr';
import {LenguajeService} from '../../../servicios/lenguaje.service';
import { Miembro } from 'src/app/modelos/miembro';

@Component({
  selector: 'app-dial-eliminar-miembro',
  templateUrl: './dial-eliminar-miembro.component.html',
  styleUrls: ['./dial-eliminar-miembro.component.scss']
})
export class DialEliminarMiembroComponent implements OnInit {

  miembro: Miembro;
  idioma: string;
  textos: any = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private genericoService: GenericoService,
    private lenguajeService: LenguajeService,
    private toastrService: ToastrService,
    private dialogRef: MatDialogRef<DialEliminarMiembroComponent>) { }

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

    this.miembro = this.data.miembro;
  }

  eliminarMiembro(): void{
    const url = `/gestion/pais/eliminarMiembro?idMiembro=${this.miembro.id}`;
    this.genericoService.delete(url).subscribe(
      res => {
        if (res){
          this.dialogRef.close(res);
        }
      });
  }


}
