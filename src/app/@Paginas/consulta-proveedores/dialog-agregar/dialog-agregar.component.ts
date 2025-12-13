import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { GenericoService } from '../../../servicios/generico.service';
import { ToastrService } from 'ngx-toastr';
import { Constants } from '../../../common/constants';
import { LenguajeService } from '../../../servicios/lenguaje.service';
import { Proveedor } from 'src/app/modelos/proveedor';
import { Alerta } from 'src/app/modelos/alerta';
import { PaginationInstance } from 'ngx-pagination';

@Component({
  selector: 'app-dialog-agregar',
  templateUrl: './dialog-agregar.component.html',
  styleUrls: ['./dialog-agregar.component.scss']
})
export class DialogAgregarComponent implements OnInit {

  registro: Proveedor;
  mode: number;
  alertas: Array<Alerta> = [];
  alerta: Alerta;

  NUMERO_ARCHIVOS = 10;
  NUMERO_IMAGENES = 5;

  idioma: number;
  textos: any = null;

  size = 18;
  page = 0;
  public configPaginador: PaginationInstance = {
    id: 'custom',
    itemsPerPage: this.size,
    currentPage: 0,
    totalItems: 0
  };
  mostrarPaginador: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private lenguajeService: LenguajeService,
              private toastr: ToastrService,
              private genericoService: GenericoService,
              public dialogRef: MatDialogRef<DialogAgregarComponent>
  ) {
    this.mode = 0;
    if (data) {
      this.registro = data;
    }
  }

  ngOnInit(): void {
    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      this.idioma = this.lenguajeService.devolverIntIdioma(data);
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
        this.textos = texts;
        this.getAlertas(0, this.size);
      },
        () => {
          this.toastr.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
  }

  getAlertas(page: number, size: number): void {
    const url = `/alerta/listarAlertasPorProveedor?page=${page}&supplierId=${this.registro.id}&size=${size}&lang=${this.idioma}`;
    this.genericoService.get(url).subscribe(
      res => {
        if (res.message === '200') {
          this.mostrarPaginador = true;
          this.alertas = res.data.Alertas;
          // this.configPaginador.totalItems = res.data.totalItems;
        } else {
          this.mostrarPaginador = false;
          this.alertas = [];
          // this.configPaginador.totalItems = 0;
          // this.toastr.info(this.textosMensajes ? this.textosMensajes.MENSAJE_NO_DATA : Constants.MENSAJE_NO_DATA);
          // this.toastr.error(this.textosMensajes ? this.textosMensajes.MENSAJE_NO_DATA : Constants.MENSAJE_NO_DATA);
        }
      }, error => {
        console.error(error);
        // this.toastr.error(this.textosMensajes ? this.textosMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
      }
    );
  }

  guardarClick(): void {
    this.mode = 1;
  }

  redirect(event): void {
    window.open(event, '_blank');
  }
}
