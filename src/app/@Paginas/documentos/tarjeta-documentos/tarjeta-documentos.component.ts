import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Documento } from 'src/app/modelos/documento';
import { DetalleTarjetaDocumentosComponent } from '../detalle-tarjeta-documentos/detalle-tarjeta-documentos.component';
import { ToastrService } from 'ngx-toastr';
import { CabeceraService } from '../../../servicios/cabecera.service';
import { LenguajeService } from '../../../servicios/lenguaje.service';
import { Constants } from '../../../common/constants';


@Component({
  selector: 'app-tarjeta-documentos',
  templateUrl: './tarjeta-documentos.component.html',
  styleUrls: ['./tarjeta-documentos.component.scss']
})
export class TarjetaDocumentosComponent implements OnInit {
  tDocumentosInfo: any = null;
  @Input() documento: Documento;
  @Input() listaPaises: any;
  @Input() listaCategorias: any;

  constructor(public dialog: MatDialog,
              private cabeceraService: CabeceraService,
              private lenguajeService: LenguajeService,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.cabeceraService.closeMenu.emit(true);
    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
        this.tDocumentosInfo = texts;
      },
        () => {
          this.toastr.error(this.tDocumentosInfo?.mensajes ? this.tDocumentosInfo.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
  }

  openDialog(documento: Documento): void {
    const dialogRef = this.dialog.open(DetalleTarjetaDocumentosComponent, {
      panelClass: 'mat-dialog-detalle-tarjeta',
      data: {
        documento,
        listaCategorias: this.listaCategorias,
        listaPaises: this.listaPaises
      }
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

  getDescripcionCategoria(categoria: any): string {
    try {
      return this.listaCategorias.find(item => item.id === categoria.id).description.trim();
    } catch {
      return categoria.description.trim();
    }
  }

}
