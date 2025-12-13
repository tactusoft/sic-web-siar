import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DiagMiembroComponent } from '../diag-miembro/diag-miembro.component';
import { Miembro } from '../../../modelos/miembro';
import { PaisesService } from 'src/app/servicios/paises.service';

@Component({
  selector: 'app-tarjeta-miembro',
  templateUrl: './tarjeta-miembro.component.html',
  styleUrls: ['./tarjeta-miembro.component.scss']
})
export class TarjetaMiembroComponent implements OnInit {
  @Input() administrar = false;
  @Input() miembro: Miembro;
  @Output()
  editar = new EventEmitter<Miembro>();
  @Output()
  eliminar = new EventEmitter<Miembro>();
  paisMiembro = '';
  over: boolean;
  image: string;
  BANDERA = 'bandera';
  LOGO = 'logo';
  FONDO = 'fondo';

  constructor(
    public dialog: MatDialog,
    private paisesService: PaisesService,
  ) {
    this.over = false;
  }
  ngOnInit(): void {
    this.image = this.getRecurso(this.miembro, this.FONDO);
    this.paisesService.listaPaises.subscribe(cambio => {
      if (cambio) {
        this.paisMiembro = this.getDescripcionPais();
      }
    });
    this.paisMiembro = this.getDescripcionPais();
  }

  openDialog(miembro: Miembro): void {
    const dialogRef = this.dialog.open(DiagMiembroComponent, {
      data: {
        miembro,
        title: miembro.nombre,
        logo: this.getRecurso(this.miembro, this.LOGO),
        image: this.getRecurso(this.miembro, this.BANDERA)
      },
      maxWidth: 'unset',
      panelClass: 'mat-dialog-miembro-detalle'
    });
    dialogRef.afterClosed();
  }

  getRecurso(miembro: Miembro, tipoRecurso: string): string {
    let fondoEn = '';
    if ('recursos' in miembro) {
      miembro.recursos.forEach(recurso => {
        if ('resourceTypeId' in recurso) {
          if (recurso.resourceTypeId.description === tipoRecurso) {
            fondoEn = recurso.path;
          }
        }
      });
    }
    return fondoEn;
  }

  getDescripcionPais(): string {
    try {
      this.miembro.nombre = this.paisesService.listadoPaises.find(item => item.id === this.miembro.id).nombre.trim();
      return this.miembro.nombre;
    } catch {
      return this.miembro ? this.miembro?.nombre.trim() : '';
    }
  }

  edita(): void {
    this.editar.emit(this.miembro);
  }
  elimina(): void {
    this.eliminar.emit(this.miembro);
  }

}
