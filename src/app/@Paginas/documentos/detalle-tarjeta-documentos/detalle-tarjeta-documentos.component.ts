import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import {Documento} from '../../../modelos/documento';
import {CabeceraService} from '../../../servicios/cabecera.service';
import {LenguajeService} from '../../../servicios/lenguaje.service';
import {Constants} from '../../../common/constants';

@Component({
  selector: 'app-detalle-tarjeta-documentos',
  templateUrl: './detalle-tarjeta-documentos.component.html',
  styleUrls: ['./detalle-tarjeta-documentos.component.scss']
})
export class DetalleTarjetaDocumentosComponent implements OnInit {

  dDocumentosInfo: any = null;
  documento: Documento;
  anexos: Array<string>;
  enlaces: Array<string>;
  imagenes: Array<string>;
  ENLACE = 'Enlaces';
  ANEXO = 'Anexos';
  IMAGEN = 'Imagenes';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private cabeceraService: CabeceraService,
              private lenguajeService: LenguajeService,
              private toastr: ToastrService) {
    this.documento = null;
    this.documento =  data.documento;
  }

  ngOnInit(): void {
    this.cabeceraService.closeMenu.emit(true);

    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {

      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
          this.dDocumentosInfo = texts;
        },
        () => {
          this.toastr.error(this.dDocumentosInfo?.mensajes ? this.dDocumentosInfo.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
    this.anexos = this.getRecurso(this.documento, this.ANEXO);
    this.enlaces = this.getRecurso(this.documento, this.ENLACE);
    this.imagenes = this.getRecurso(this.documento, this.IMAGEN);
  }

  getRecurso(documento: Documento , tipoRecurso: string): Array<string>{
    const listado = [];
    if ('recursos' in documento) {
      documento.recursos.forEach( recurso => {
        if ('resourceTypeId' in recurso){
          if (recurso.resourceTypeId.description === tipoRecurso){
            listado.push(recurso.path);
          }
        }
      });
    }
    return listado;
  }

  redirect(event): void{
    window.open(event, '_blank');
  }

  getDescripcionPais(pais: any): string {
    try {
      return this.data.listaPaises.find(item => item.id === pais.id).nombre.trim();
    } catch {
      return pais.nombre.trim();
    }
  }

  getDescripcionCategoria(categoria: any): string {
    try {
      return this.data.listaCategorias.find(item => item.id === categoria.id).descripcion.trim();
    } catch {
      return categoria.description.trim();
    }
  }

}
