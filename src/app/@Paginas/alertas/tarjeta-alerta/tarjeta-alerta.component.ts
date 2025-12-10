import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAlertaComponent } from '../dialog-alerta/dialog-alerta.component';
import { Alerta } from '../../../modelos/alerta';
import {LenguajeService} from '../../../servicios/lenguaje.service';
import { ToastrService } from 'ngx-toastr';
import {Constants} from '../../../common/constants';
import {Recurso} from '../../../modelos/recurso';

@Component({
  selector: 'app-tarjeta-alerta',
  templateUrl: './tarjeta-alerta.component.html',
  styleUrls: ['./tarjeta-alerta.component.scss']
})
export class TarjetaAlertaComponent implements OnInit {

  @Input() alerta: Alerta;
  @Input() listaPaises: any;
  @Input() listaNivelRiesgo: any;
  @Input() listaRiesgo: any;
  @Input() listaCategoria: any;
  @Input() listaTipoMedidas: any;
  @Input() listaProveedor: any;

  textos: any;

  constructor(
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private lenguajeService: LenguajeService) { }

  ngOnInit(): void {
    this.lenguajeService.idiomaSubject.subscribe(data => {
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
        this.textos = texts;
        },
        () => {
          this.toastrService.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
  }

  openDialog(alerta: Alerta): void {
    const dialogRef = this.dialog.open(DialogAlertaComponent, {
      data: {
        alerta,
        listaPaises: this.listaPaises,
        listaNivelRiesgo: this.listaNivelRiesgo,
        listaRiesgo: this.listaRiesgo,
        listaCategoria: this.listaCategoria,
        listaTipoMedidas: this.listaTipoMedidas,
        listaProveedor: this.listaProveedor
      },
      panelClass: 'mat-detalle-alerta',
      maxWidth: 'unset'
    });

    dialogRef.afterClosed();
  }

  getImagenes(recurso: Array<Recurso>): string{
    if (recurso){
      const rec = recurso.filter(r => r.resourceTypeId.description === 'Imagenes');
      if (rec.length > 0){
        return rec[0].path;
      }
      return 'assets/img/noImagen.png';
    } else {
      return 'assets/img/noImagen.png';
    }
  }

  getDescripcionPais(pais: any): string{
    try{
      return this.listaPaises.find(item => item.id === pais.id).nombre.trim();
    } catch {
      return pais.nombre.trim();
    }
  }

  getDescripcionNivelRiesgo(nivelRiesgo: any): string{
    try {
      return this.listaNivelRiesgo[0].subDominio.find(item => item.id === nivelRiesgo.id).description;
    } catch {
      return nivelRiesgo.description;
    }
  }

}
