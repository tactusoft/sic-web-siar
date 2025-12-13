import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Constants } from '../../../common/constants';
import { LenguajeService } from '../../../servicios/lenguaje.service';
import { Proveedor } from 'src/app/modelos/proveedor';
import { DialogAgregarComponent } from '../dialog-agregar/dialog-agregar.component';

@Component({
  selector: 'app-tarjeta-registro',
  templateUrl: './tarjeta-registro.component.html',
  styleUrls: ['./tarjeta-registro.component.scss']
})
export class TarjetaRegistroComponent implements OnInit {
  @Input() registro: Proveedor;
  @Input() listaPaises: any;
  @Input() listaCategorias: any;
  over = false;
  idioma: string;
  textos: any = null;

  constructor(
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private lenguajeService: LenguajeService) {
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
  }

  abrirEditar(registro: Proveedor): void {
    const dialogRef = this.dialog.open(DialogAgregarComponent, {
      data: registro,
      panelClass: 'mat-edit-doc-public-diag',
      width: '70%'
    });

    dialogRef.afterClosed();
  }

  getDescripcionPais(pais: any): string {
    try {
      return this.listaPaises.find(item => item.id === pais.id).nombre.trim();
    } catch {
      return pais.nombre.trim();
    }
  }

}
