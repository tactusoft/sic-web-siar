import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GestionProveedoresService } from '../gestion-proveedores.service';
import { ToastrService } from 'ngx-toastr';
import { Constants } from '../../../common/constants';
import { Documento } from '../../../modelos/documento';
import { GenericoService } from '../../../servicios/generico.service';
import { LenguajeService } from '../../../servicios/lenguaje.service';

@Component({
  selector: 'app-dialog-eliminar',
  templateUrl: './dialog-eliminar.component.html',
  styleUrls: ['./dialog-eliminar.component.scss']
})
export class DialogEliminarComponent implements OnInit {

  documento: Documento;
  idioma: string;
  textos: any = null;
  textosMensajes: any = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private genericoService: GenericoService,
              private toastr: ToastrService,
              private lenguajeService: LenguajeService,
              public dialogRef: MatDialogRef<DialogEliminarComponent>,
              private gestionService: GestionProveedoresService) {
    this.documento = data;
  }

  ngOnInit(): void {

    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {

      this.idioma = data;

      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(this.idioma).subscribe(texts => {
        this.textos = texts;
        this.textosMensajes = texts?.mensajes;
      },
        () => {
          this.toastr.error(this.textosMensajes ? this.textosMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
  }


  eliminarDocumento(): void {
    const url = Constants.PATH_ELIMINAR_HIST_PROVEEDOR;
    const req = {
      id: this.documento.id
    };
    this.genericoService.post(req, url).subscribe(res => {
      if (res.message === '200') {
        this.toastr.success(this.textosMensajes ? this.textosMensajes.MSJ_OPE_REALIZADA : Constants.MSJ_OPE_REALIZADA);
        this.gestionService.recargarDocumentos.emit(true);
      } else {
        this.toastr.error(this.textosMensajes ? this.textosMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
      }
      this.dialogRef.close();
    });
  }
}
