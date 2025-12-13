import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import {LenguajeService} from '../../servicios/lenguaje.service';
import { ToastrService } from 'ngx-toastr';
import { PaginationInstance } from 'ngx-pagination';
import { Constants } from '../../common/constants';
import { Pais } from '../../modelos/pais';

@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.scss']
})
export class AdminUsuariosComponent implements OnInit {
  paises: Array<number> = [];
  paisList: Array<Pais> = [];
  buscarPais: FormControl;
  mostrarConfirmacion = false;
  mostrando = 'usuarios';
  public configPaginador: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 20,
    currentPage: 0,
    totalItems: 0
  };
  textos: any;
  constructor(public dialog: MatDialog,
              private toastrService: ToastrService,
              private lenguajeService: LenguajeService
    ) { }

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
    this.buscarPais = new FormControl('');
  }
  mostrarOk($event): void{
    this.mostrarConfirmacion = $event;
  }

  optionPais(idPais: number, option: MatOption): string {
    if (this.paises.some(p => p === idPais)){
      return 'option-selected';
    } else {
      option.deselect();
      return '';
    }
  }
  mostrar(filtro: string = '', campo: string): boolean{
    if (filtro.length > 0){
      if (campo.toLowerCase().includes(filtro.toLowerCase())){
        return true;
      }else{
        return false;
      }
    }
    return true;
  }

}
