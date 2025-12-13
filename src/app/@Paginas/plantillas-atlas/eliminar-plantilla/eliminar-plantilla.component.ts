import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Constants} from '../../../common/constants';
import {ToastrService} from 'ngx-toastr';
import {LenguajeService} from '../../../servicios/lenguaje.service';
import {AtlasService} from '../../../servicios/atlas/atlas.service';
import {AtlasPlantilla} from '../../../modelos/atlasPlantilla';

@Component({
  selector: 'app-eliminar-plantilla',
  templateUrl: './eliminar-plantilla.component.html',
  styleUrls: ['./eliminar-plantilla.component.scss']
})
export class EliminarPlantillaComponent implements OnInit {

  plantilla: AtlasPlantilla;
  idioma: string;
  textos: any = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private atlasService: AtlasService,
    private lenguajeService: LenguajeService,
    private toastrService: ToastrService,
    private dialogRef: MatDialogRef<EliminarPlantillaComponent>) {
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

    this.plantilla = this.data.plantilla;
  }

  eliminarEvento(): void {

    this.atlasService.eliminarPlantilla(this.plantilla.id).subscribe(
      res => {
        console.log(res);
        if (res && res.message === '200') {
          this.toastrService.success(this.textos?.mensajes ? this.textos?.mensajes?.MENSAJE_ELIMINADO_OK : Constants.MENSAJE_ELIMINADO_OK);
          this.dialogRef.close(res);
        } else {
          this.toastrService.error(this.textos?.mensajes ? this.textos?.mensajes?.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        }
      }, () => {
        this.toastrService.error(this.textos?.mensajes ? this.textos?.mensajes?.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
      });
  }

}

