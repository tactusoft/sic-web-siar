import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Boletin } from '../../../modelos/boletin';
import { DialogBoletinDetalleComponent } from '../dialog-boletin-detalle/dialog-boletin-detalle.component';
import { ToastrService } from 'ngx-toastr';
import { Constants } from '../../../common/constants';
import { LenguajeService } from '../../../servicios/lenguaje.service';
import { GestionBoletin } from 'src/app/modelos/gestion-boletin';

@Component({
  selector: 'app-boletin',
  templateUrl: './boletin.component.html',
  styleUrls: ['./boletin.component.scss']
})
export class BoletinComponent implements OnInit {

  @Input()
  boletin: GestionBoletin;
  textos: any;
  constructor(
    public dialog: MatDialog,
    private toastr: ToastrService,
    private lenguajeService: LenguajeService,
  ) { }

  ngOnInit(): void {
    this.lenguajeService.idiomaSubject.subscribe(data => {
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
        this.textos = texts;
      }, () => {
        this.toastr.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
      });
    });
  }
  openDialog(boletin: Boletin): void {
    const dialogRef = this.dialog.open(DialogBoletinDetalleComponent, {
      data: boletin,
      width: '80%'
    });

    dialogRef.afterClosed();
  }

}
