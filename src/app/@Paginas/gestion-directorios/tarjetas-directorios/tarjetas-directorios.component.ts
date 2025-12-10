import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';


import {Constants} from '../../../common/constants';
import {ToastrService} from 'ngx-toastr';
import {Directorio} from '../../../modelos/directorio';
import {LenguajeService} from '../../../servicios/lenguaje.service';
import {PaisesService} from 'src/app/servicios/paises.service';
import {DialogDetalleDirectorioComponent} from '../dialog-detalle-directorio/dialog-detalle-directorio.component';

@Component({
  selector: 'app-tarjetas-directorios',
  templateUrl: './tarjetas-directorios.component.html',
  styleUrls: ['./tarjetas-directorios.component.scss']
})
export class TarjetasDirectoriosComponent implements OnInit {

  today: Date;
  idioma: string;
  textos: any = null;

  @Input() directorio: Directorio;
  paisesDirectorio = '';
  @Input() administrar = false;

  @Input() consulta = true;

  constructor(
    public dialog: MatDialog,
    private lenguajeService: LenguajeService,
    private paisesService: PaisesService,
    private toastrService: ToastrService) {
  }

  @Output()
  editar = new EventEmitter<Directorio>();

  @Output()
  eliminar = new EventEmitter<Directorio>();

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
    this.paisesService.listaPaises.subscribe(cambio => {
      if (cambio) {
        this.paisesDirectorio = this.getDescripcionPais();
      }
    });
    this.paisesDirectorio = this.getDescripcionPais();
    this.today = new Date();
  }

  openDialogDetalle(directorio: Directorio): void {
    const dialogRef = this.dialog.open(DialogDetalleDirectorioComponent, {
      data: {
        directorio
      }
    });

    dialogRef.afterClosed();
  }

  edita(): void {
    this.editar.emit(this.directorio);
  }

  elimina(): void {
    this.eliminar.emit(this.directorio);
  }

  getDescripcionPais(): string {
    try {
      this.directorio.pais.nombre = this.paisesService.listadoPaises.find(item => item.id === this.directorio.pais.id).nombre.trim();
      return this.directorio.pais.nombre;
    } catch {
      return this.directorio?.pais ? this.directorio.pais.nombre.trim() : '';
    }
  }
}
