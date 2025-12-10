import { DialogAddCalendarComponent } from '../dialog-add-calendar/dialog-add-calendar.component';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogEventoDetalleComponent } from '../dialog-evento-detalle/dialog-evento-detalle.component';
import * as moment from 'moment';
import { Constants } from '../../../common/constants';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '../../../modelos/evento';
import { LenguajeService } from '../../../servicios/lenguaje.service';
import { PaisesService } from 'src/app/servicios/paises.service';

@Component({
  selector: 'app-card-evento',
  templateUrl: './card-evento.component.html',
  styleUrls: ['./card-evento.component.scss']
})
export class CardEventoComponent implements OnInit {

  today: Date;
  idioma: string;
  textos: any = null;

  @Input() evento: Evento;
  paisesEvento = '';
  @Input() administrar = false;

  constructor(
    public dialog: MatDialog,
    private lenguajeService: LenguajeService,
    private paisesService: PaisesService,
    private toastrService: ToastrService) { }

  @Output()
  editar = new EventEmitter<Evento>();

  @Output()
  eliminar = new EventEmitter<Evento>();

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
      if (cambio){
        this.paisesEvento = this.getDescripcionPais();
      }
    });
    this.paisesEvento = this.getDescripcionPais();
    this.today = new Date();
    this.evento.startDate = new Date(this.evento.startDate).toISOString().slice(0, 10);
    this.evento.endDate = new Date(this.evento.endDate).toISOString().slice(0, 10);
  }

  openDialog(evento: Evento): void {
    const dialogRef = this.dialog.open(DialogEventoDetalleComponent, {
      panelClass: 'mat-dialog-detalle-eventos',
      data: {
        evento,
        title: this.textos?.mensajes ? this.textos?.mensajes?.EDICION_EVENTO_MSJ : 'Detalle Evento'
      }
    });
    dialogRef.afterClosed();
  }

  openDialogAddCalendar(evento: Evento): void {
    const dialogRef = this.dialog.open(DialogAddCalendarComponent, {
      data: {
        evento,
      },
      width: '70%'
    });
    dialogRef.afterClosed();
  }

  eventoPasado(evento: Evento): boolean {
    return moment(evento.startDate).isAfter(moment(this.today));
  }

  edita(): void {
    this.editar.emit(this.evento);
  }
  elimina(): void {
    this.eliminar.emit(this.evento);
  }

  getDescripcionPais(): string {
    try {
      this.evento.pais.nombre = this.paisesService.listadoPaises.find(item => item.id === this.evento.pais.id).nombre.trim();
      return this.evento.pais.nombre;
    } catch {
      return this.evento?.pais ? this.evento.pais.nombre.trim() : '';
    }
  }
}
