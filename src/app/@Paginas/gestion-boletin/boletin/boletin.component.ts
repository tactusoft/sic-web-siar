import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditarComponent } from '../dialog-editar/dialog-editar.component';
import { DialogEliminarComponent } from '../dialog-eliminar/dialog-eliminar.component';
import { ToastrService } from 'ngx-toastr';
import { Constants } from '../../../common/constants';
import { GestionBoletin } from '../../../modelos/gestion-boletin';
import { LenguajeService } from '../../../servicios/lenguaje.service';

@Component({
  selector: 'app-boletin',
  templateUrl: './boletin.component.html',
  styleUrls: ['./boletin.component.scss']
})
export class BoletinComponent implements OnInit {

  @Input()
  boletin: GestionBoletin;
  over = false;
  idioma: string;
  textos: any = null;
  constructor(
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private lenguajeService: LenguajeService) { }

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
  }
  openDialog(boletin: GestionBoletin): void {
    console.log(boletin);
    /*
    const dialogRef = this.dialog.open(DialogBoletinDetalleComponent, {
      data: boletin,
      width: '80%'
    });

    dialogRef.afterClosed();
    */
  }

  abrirEditar(boletin: GestionBoletin): void {
    const dialogRef = this.dialog.open(DialogEditarComponent, {
      data: boletin,
      width: '80%'
    });

    dialogRef.afterClosed();
  }

  abrirEliminar(boletin: GestionBoletin): void {
    const dialogRef = this.dialog.open(DialogEliminarComponent, {
      data: boletin,
      width: '80%'
    });

    dialogRef.afterClosed();
  }
}
