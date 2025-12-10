import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {Documento} from '../../../modelos/documento';
import {GenericoService} from '../../../servicios/generico.service';
import {CabeceraService} from '../../../servicios/cabecera.service';
import {LenguajeService} from '../../../servicios/lenguaje.service';
import {Constants} from '../../../common/constants';

@Component({
  selector: 'app-ultimos-documentos',
  templateUrl: './ultimos-documentos.component.html',
  styleUrls: ['./ultimos-documentos.component.scss']
})
export class UltimosDocumentosComponent implements OnInit {
  IMG_EVENTOS_AUDITORIO = window.location.pathname + Constants.PATH_IMG_EVENTOS_AUDITORIO;
  uDocumentosInfo: any = null;
  documentos: Array<Documento> = [];
  pagina = 0;
  registros = 8;
  pais = localStorage.getItem('paisId');
  categoria = '';

  constructor(private genericoService: GenericoService,
              private cabeceraService: CabeceraService,
              private lenguajeService: LenguajeService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.cabeceraService.closeMenu.emit(true);

    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {

      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
          this.uDocumentosInfo = texts;
        },
        () => {
          this.toastr.error(this.uDocumentosInfo?.mensajes ? this.uDocumentosInfo.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
    this.getDocumentos(this.pais, this.pagina, this.categoria, this.registros);
  }

  getDocumentos(pais: string, pagina: number, categoria: string, registros: number): void{
    const url = `/documento/listarDocumento?pais=${pais}&categoria=${categoria}&page=${pagina}&size=${registros}`;
    this.genericoService.get(url).subscribe(res => {
      if (res.message === '200'){
        this.documentos = res.data.documento;
      }
    }, error => {
      console.error(error);
    });
  }
}

