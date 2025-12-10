import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import {Evento} from '../../../../modelos/evento';
import {CabeceraService} from '../../../../servicios/cabecera.service';
import {LenguajeService} from '../../../../servicios/lenguaje.service';
import {Constants} from '../../../../common/constants';
import {DialogEventoDetalleComponent} from '../../../eventos/dialog-evento-detalle/dialog-evento-detalle.component';
import { PaisesService } from 'src/app/servicios/paises.service';

@Component({
  selector: 'app-tarjeta-evento',
  templateUrl: './tarjeta-evento.component.html',
  styleUrls: ['./tarjeta-evento.component.scss']
})
export class TarjetaEventoComponent implements OnInit {
  tEventoInfo: any = null;
  @Input() evento: Evento;
  paisesEvento = '';

  estadoEvento: boolean;
  today: Date;
  constructor(public dialog: MatDialog,
              private cabeceraService: CabeceraService,
              private lenguajeService: LenguajeService,
              private paisesService: PaisesService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.cabeceraService.closeMenu.emit(true);

    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {

      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
          this.tEventoInfo = texts;
        },
        () => {
          this.toastr.error(this.tEventoInfo?.mensajes ? this.tEventoInfo?.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
    this.paisesService.listaPaises.subscribe(cambio => {
      if (cambio){
        this.paisesEvento = this.getDescripcionPais();
      }
    });
    this.paisesEvento = this.getDescripcionPais();
    this.evento.startDate = new Date(this.evento.startDate).toISOString().slice(0, 10);
    this.evento.endDate = new Date(this.evento.endDate).toISOString().slice(0, 10);
  }
  openDialog(evento: Evento): void {
    const dialogRef = this.dialog.open(DialogEventoDetalleComponent, {
      panelClass: 'mat-dialog-detalle-eventos',
      data: {
        evento
      },
    });

    dialogRef.afterClosed();
  }
  eventoPasado(evento: Evento): boolean {
    this.estadoEvento = moment(evento.startDate).isAfter(moment(this.today));
    return this.estadoEvento;
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
