import { Component, OnInit } from '@angular/core';
import { SubdomainDTO, SubDomainID } from '../../clases/subdomainDTO';
import { MatDialog } from '@angular/material/dialog';
import { ModalGestionAlertasComponent } from './modal-gestion-alertas/modal-gestion-alertas.component';
import { GenericoService } from '../../servicios/generico.service';
import { ToastrService } from 'ngx-toastr';
import { Constants } from '../../common/constants';
import { LenguajeService } from '../../servicios/lenguaje.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-gestion-alertas',
  templateUrl: './gestion-alertas.component.html',
  styleUrls: ['./gestion-alertas.component.scss']
})
export class GestionAlertasComponent implements OnInit {
  /**
   * Los ID de dominio se configuran en clases/subdomainDTO en el enumerable SubDomainID
   */
  /**
   * Constantes
   */
  idCategoria = SubDomainID.Categoria;
  idNivelRiesgo = SubDomainID.NivelRiesgo;
  idRiesgos = SubDomainID.Riesgos;
  idTipoMedida = SubDomainID.TipoMedida;
  idProveedores = SubDomainID.Proveedores;
  idCategoriaDirectorio = SubDomainID.CategoriaDirectorio;
  estadoActivo = 'A';
  estadoInactivo = 'I';
  /**
   * Variables
   */
  subdomainListCategoria: Array<SubdomainDTO> = [];
  subdomainListProveedores: Array<SubdomainDTO> = [];
  subdomainListRiesgo: Array<SubdomainDTO> = [];
  subdomainListNivRiesgo: Array<SubdomainDTO> = [];
  subdomainListTipMedida: Array<SubdomainDTO> = [];
  subdomainListCategoriaDirectorio: Array<SubdomainDTO> = [];
  alerta: any;
  buscarRiesgo = false;
  buscarNivelRiesgo = false;
  buscarCategoriaDirectorio = false;
  buscarTipMed = false;
  buscarProv = false;
  buscarCateg = false;
  dataUsuario; any;
  idiomaUsuario: any;
  idioma: string;
  textos: any = null;
  textosMensajes: any = null;
  iconoEditar = Constants.ICON_EDITAR;

  constructor(
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private lenguajeService: LenguajeService,
    private genericoService: GenericoService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer) {
      iconRegistry.addSvgIcon('iconoEditar', sanitizer.bypassSecurityTrustResourceUrl(this.iconoEditar));
  }

  ngOnInit(): void {
    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      this.idioma = data;
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(this.idioma).subscribe(texts => {
        this.textos = texts;
        this.textosMensajes = texts?.mensajes;
        this.idiomaUsuario = this.lenguajeService.devolverIntIdioma(this.idioma);
        this.obtenerDominiosIniciales(this.idiomaUsuario.toString());
      },
        () => {
          this.toastrService.error(this.textosMensajes ? this.textosMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
    this.idiomaUsuario = this.lenguajeService.devolverIntIdioma(this.idioma);
    this.obtenerDominiosIniciales(this.idiomaUsuario.toString());
  }

  obtenerDominiosIniciales(idioma: string): void {
    this.getDomain(idioma, this.idCategoria, '');
    this.getDomain(idioma, this.idProveedores, '');
    this.getDomain(idioma, this.idRiesgos, '');
    this.getDomain(idioma, this.idNivelRiesgo, '');
    this.getDomain(idioma, this.idTipoMedida, '');
    this.getDomain(idioma, this.idCategoriaDirectorio, '');
  }

  activarBusqueda(val): void {
    if (val === this.idCategoria) {
      this.buscarCateg = true;
    }
    else if (val === this.idProveedores) {
      this.buscarProv = true;
    }
    else if (val === this.idRiesgos) {
      this.buscarRiesgo = true;
    }
    else if (val === this.idNivelRiesgo) {
      this.buscarNivelRiesgo = true;
    }
    else if (val === this.idTipoMedida) {
      this.buscarTipMed = true;
    }
  }

  buscarCategoria(val): void {
    if (val === this.idCategoria) {
      this.buscarCateg = !this.buscarCateg;
      this.getDomain(this.idiomaUsuario, this.idCategoria, '');
    }
    else if (val === this.idProveedores) {
      this.buscarProv = !this.buscarProv;
      this.getDomain(this.idiomaUsuario, this.idProveedores, '');
    }
    else if (val === this.idRiesgos) {
      this.buscarRiesgo = !this.buscarRiesgo;
      this.getDomain(this.idiomaUsuario, this.idRiesgos, '');
    }
    else if (val === this.idNivelRiesgo) {
      this.buscarNivelRiesgo = !this.buscarNivelRiesgo;
      this.getDomain(this.idiomaUsuario, this.idNivelRiesgo, '');
    }
    else if (val === this.idTipoMedida) {
      this.buscarTipMed = !this.buscarTipMed;
      this.getDomain(this.idiomaUsuario, this.idTipoMedida, '');
    }
    else if (val === this.idTipoMedida) {
      this.buscarTipMed = !this.buscarTipMed;
      this.getDomain(this.idiomaUsuario, this.idTipoMedida, '');
    }
    else if (val === this.idCategoriaDirectorio) {
      this.buscarCategoriaDirectorio = !this.buscarCategoriaDirectorio;
      this.getDomain(this.idiomaUsuario, this.idCategoriaDirectorio, '');
    }
  }

  openDialogEditAlert(value): void {
    const url = `${Constants.PATH_CONSULT_PARAMETROS_ALERTAS}?idSubDominioLeng=${value.id}`;
    this.genericoService.get(url).subscribe(res => {
      value.subDominioLeng = res.data.subDominioLeng;
      const dialogRef = this.dialog.open(ModalGestionAlertasComponent, {
        width: '95%',
        panelClass: 'my-dialog',
        data: { cod: value, subdom: this.subdomainListCategoria }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result){
          this.getDomain(this.idiomaUsuario, value.idDomain, '');
          this.toastrService.success(this.textos?.mensajes ? this.textos?.mensajes?.USUARIO_CREADO_MSJ : 'Alerta modificada exitósamente');
        }
      });
    }, error => {
      console.error(error);
    });
  }

  openDialog(value): void {
    const dialogRef = this.dialog.open(ModalGestionAlertasComponent, {
      width: '95%',
      panelClass: 'my-dialog',
      data: { subdom: this.subdomainListCategoria, cod: value }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getDomain(this.idiomaUsuario, value, '');
    });
  }

  filtro(text, com): void {
    this.getDomain(this.idiomaUsuario, com, text);
  }

  getDomain(idioma: string, dominio: number, filtro: string): void {
    const url = `${Constants.PATH_GET_PARAMETROS_ALERTAS_FILTRO}?idioma=${idioma}&dominio=${dominio}&filtro=${filtro}`;
    this.genericoService.get(url).subscribe(res => {
      if (res.message === '200') {
        if (dominio === this.idCategoria) {
          this.subdomainListCategoria = [];
          this.subdomainListCategoria = res.data.Dominios[0].subDominio;
        }
        else if (dominio === this.idProveedores) {
          this.subdomainListProveedores = [];
          this.subdomainListProveedores = res.data.Dominios[0].subDominio;
        }
        else if (dominio === this.idRiesgos) {
          this.subdomainListRiesgo = [];
          this.subdomainListRiesgo = res.data.Dominios[0].subDominio;
        }
        else if (dominio === this.idNivelRiesgo) {
          this.subdomainListNivRiesgo = [];
          this.subdomainListNivRiesgo = res.data.Dominios[0].subDominio;
        }
        else if (dominio === this.idTipoMedida) {
          this.subdomainListTipMedida = [];
          this.subdomainListTipMedida = res.data.Dominios[0].subDominio;
        }
        else if (dominio === this.idCategoriaDirectorio) {
          this.subdomainListCategoriaDirectorio = [];
          this.subdomainListCategoriaDirectorio = res.data.Dominios[0].subDominio;
        }
      }
      else {
        if (dominio === this.idCategoria) {
          this.subdomainListCategoria = [];
        }
        else if (dominio === this.idProveedores) {
          this.subdomainListProveedores = [];
        }
        else if (dominio === this.idRiesgos) {
          this.subdomainListRiesgo = [];
        }
        else if (dominio === this.idNivelRiesgo) {
          this.subdomainListNivRiesgo = [];
        }
        else if (dominio === this.idTipoMedida) {
          this.subdomainListTipMedida = [];
        }
        else if (dominio === this.idCategoriaDirectorio) {
          this.subdomainListCategoriaDirectorio = [];
        }
      }
    }, error => {
      console.error(error);
    });
  }

  cambiarEstado(alerta): void {
    console.log(alerta);
    const req = {
      id: alerta.id,
      estado: alerta.estado === this.estadoActivo ? this.estadoInactivo : this.estadoActivo,
    };
    const url = Constants.PATH_UPDATE_EDO_PARAMETRO_ALERTA;
    this.genericoService.put(req, url).subscribe(res => {
      if (res.message === '200') {
        this.getDomain(this.idiomaUsuario, alerta.idDomain, '');
        this.toastrService.success(this.textosMensajes ? this.textosMensajes.MSJ_OPE_REALIZADA : Constants.MSJ_OPE_REALIZADA);
      }
    });
  }
}
