import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {DialogEditarComponent} from '../dialog-editar/dialog-editar.component';
import { DialogEliminarComponent } from '../dialog-eliminar/dialog-eliminar.component';
import { ToastrService } from 'ngx-toastr';
import {Constants} from '../../../common/constants';
import {Documento} from '../../../modelos/documento';
import {LenguajeService} from '../../../servicios/lenguaje.service';


@Component({
  selector: 'app-tarjeta-documentos',
  templateUrl: './tarjeta-documentos.component.html',
  styleUrls: ['./tarjeta-documentos.component.scss']
})
export class TarjetaDocumentosComponent implements OnInit {
  @Input() documento: Documento;
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

  abrirEditar(documento: Documento): void {
    const dialogRef = this.dialog.open(DialogEditarComponent, {
      data: documento,
      panelClass: 'mat-edit-doc-public-diag',
      width: '70%'
    });

    dialogRef.afterClosed();
  }

  abrirEliminar(documento: Documento): void {
    const dialogRef = this.dialog.open(DialogEliminarComponent, {
      data: documento,
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

  getDescripcionCategoria(categoria: any): string {
    try {
      return this.listaCategorias.find(item => item.id === categoria.id).description.trim();
    } catch {
      return categoria.description.trim();
    }
  }

}
