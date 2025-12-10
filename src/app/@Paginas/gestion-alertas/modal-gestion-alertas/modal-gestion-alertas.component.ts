import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { Constants } from '../../../common/constants';
import { LenguajeService } from '../../../servicios/lenguaje.service';
import { GenericoService } from '../../../servicios/generico.service';
import { SubdomainDTO, SubDomainID } from 'src/app/clases/subdomainDTO';


@Component({
  selector: 'app-modal-gestion-alertas',
  templateUrl: './modal-gestion-alertas.component.html',
  styleUrls: ['./modal-gestion-alertas.component.scss']
})


export class ModalGestionAlertasComponent implements OnInit, AfterViewInit  {
 /**
  * Constantes
  */
  idCategoria = SubDomainID.Categoria;
  idNivelRiesgo = SubDomainID.NivelRiesgo;
  idRiesgos = SubDomainID.Riesgos;
  idTipoMedida = SubDomainID.TipoMedida;
  idProveedores = SubDomainID.Proveedores;
  idCategoriaDirectorio = SubDomainID.CategoriaDirectorio;

  subdomainListCategoria: SubdomainDTO;
  subdomainListProveedores: SubdomainDTO;
  subdomainListRiesgo: SubdomainDTO;
  subdomainListNivRiesgo: SubdomainDTO;
  subdomainListTipMedida: SubdomainDTO;
  subdomainListCategoriaDirectorio: SubdomainDTO;

  @ViewChild('comPor') comPorRef: ElementRef;
  @ViewChild('comIng') comIngRef: ElementRef;
  @ViewChild('comFra') comFraRef: ElementRef;
  @ViewChild('comEsp') comEspRef: ElementRef;
  @Output() cambio = new EventEmitter();
  @Input() codigoEmpresaSeleccionada: any;
  idioma: string;
  textos: any = null;
  textosMensajes: any = null;
  req: any;
  campo: string;
  guardar = false;
  editar = false;
  comEspTxt = '';
  comIngTxt = '';
  comFraTxt = '';
  comPorTxt = '';

  constructor(private snackBar: MatSnackBar,
              public dialogRef: MatDialogRef<ModalGestionAlertasComponent>,
              private toastrService: ToastrService,
              private lenguajeService: LenguajeService,
              private genericoService: GenericoService,
              @Inject(MAT_DIALOG_DATA) public data: any
              ) {}

  ngOnInit(): void {
    this.lenguajeService.idiomaSubject.subscribe(data => {
      this.idioma = data;
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(this.idioma).subscribe(texts => {
        this.textos = texts;
        this.textosMensajes = texts?.mensajes;
      },
        () => {
          this.toastrService.error(this.textosMensajes ? this.textosMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
    this.builderForm();
  }

  ngAfterViewInit(): void {
    this.comPorRef.nativeElement.value = this.comPorTxt;
    this.comEspRef.nativeElement.value = this.comEspTxt;
    this.comFraRef.nativeElement.value = this.comFraTxt;
    this.comIngRef.nativeElement.value = this.comIngTxt;
    console.log('hola');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  builderForm(): void {
    if (this.data.cod.id == null){
      if (this.data.cod === this.idCategoria) {
        this.campo = this.textos.gestion_alertas.categoria;
      }
      else if (this.data.cod === this.idProveedores) {
        this.campo = this.textos.gestion_alertas.proveedores;
      }
      else if (this.data.cod === this.idRiesgos) {
        this.campo = this.textos.gestion_alertas.riesgo;
      }
      else if (this.data.cod === this.idNivelRiesgo) {
        this.campo = this.textos.gestion_alertas.nivelRiesgo;
      }
      else if (this.data.cod === this.idTipoMedida) {
        this.campo = this.textos.gestion_alertas.tipoMedidas;
      }
      else if (this.data.cod === this.idCategoriaDirectorio) {
        this.campo = this.textos.gestion_alertas.catDir;
      }
    }else{
      console.log(this.data);
      this.editar = true;
      if (this.data.cod.idDomain === this.idCategoria) {
        this.campo = this.textos.gestion_alertas.categoria;
      }
      else if (this.data.cod.idDomain === this.idProveedores) {
        this.campo = this.textos.gestion_alertas.proveedores;
      }
      else if (this.data.cod.idDomain === this.idRiesgos) {
        this.campo = this.textos.gestion_alertas.riesgo;
      }
      else if (this.data.cod.idDomain === this.idNivelRiesgo) {
        this.campo = this.textos.gestion_alertas.nivelRiesgo;
      }
      else if (this.data.cod.idDomain === this.idTipoMedida) {
        this.campo = this.textos.gestion_alertas.tipoMedidas;
      }
      else if (this.data.cod.idDomain === this.idCategoriaDirectorio) {
        this.campo = this.textos.gestion_alertas.catDir;
      }
      for (const lenguage of this.data.cod.subDominioLeng) {
        switch (lenguage.lenguaje){
          case '1':
          this.comEspTxt = lenguage.description;
          break;
          case '2':
          this.comIngTxt = lenguage.description;
          break;
          case '3':
          this.comFraTxt = lenguage.description;
          break;
          case '4':
          this.comPorTxt = lenguage.description;
          break;
        }
      }
    }
  }

  guardarComp(compEsp, compIng, compFra, compPor): void {
    if (compEsp.trim() === '' || compIng.trim() === '' || compFra.trim() === '' || compPor.trim() === '') {
      this.guardar = true;
    } else {
      this.crearAlertaLeng(compEsp, compIng, compFra, compPor);
      this.dialogRef.close();
    }
  }

  crearAlertaLeng(compEsp, compIng, compFra, compPor): void {
    this.req = {
      description: compEsp,
      order: 1,
      idDomain: this.data.cod,
      estado: 'A',
      subDominioLeng: [
        {
          lenguaje: Constants.ID_IDIOMA_ESP,
          description: compEsp
        },
        {
          lenguaje: Constants.ID_IDIOMA_ENG,
          description: compIng
        },
        {
          lenguaje: Constants.ID_IDIOMA_FRA,
          description: compFra
        },
        {
          lenguaje: Constants.ID_IDIOMA_POR,
          description: compPor
        }
      ]
    };
    if (this.editar){
      this.req = {
        description: compEsp,
        order: 1,
        idDomain: this.data.cod.idDomain,
        estado: 'A',
        subDominioLeng: [
          {
            lenguaje: Constants.ID_IDIOMA_ESP,
            description: compEsp,
            id: this.data.cod.id
          },
          {
            lenguaje: Constants.ID_IDIOMA_ENG,
            description: compIng,
            id: this.data.cod.id
          },
          {
            lenguaje: Constants.ID_IDIOMA_FRA,
            description: compFra,
            id: this.data.cod.id
          },
          {
            lenguaje: Constants.ID_IDIOMA_POR,
            description: compPor,
            id: this.data.cod.id
          }
        ]
      };
      const url = Constants.PATH_EDIT_PARAMETROS_ALERTAS;
      this.genericoService.put(this.req, url).subscribe(respuesta => {
        if (respuesta.message === '200'){
          this.toastrService.success(this.textosMensajes ? this.textosMensajes.MSJ_OPE_REALIZADA : Constants.MSJ_OPE_REALIZADA);
        }
        console.log(respuesta);
      }, error => {
        console.log(error);
        this.toastrService.error(this.textosMensajes ? this.textosMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
      });
    }else{
      const url = Constants.PATH_CREATE_PARAMETROS_ALERTAS;
      this.genericoService.post(this.req, url).subscribe(respuesta => {
        if (respuesta.message === '200'){
          this.toastrService.success(this.textosMensajes ? this.textosMensajes.MSJ_OPE_REALIZADA : Constants.MSJ_OPE_REALIZADA);
        }
        console.log(respuesta);
      }, error => {
        console.log(error);
        this.toastrService.error(this.textosMensajes ? this.textosMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
      });
    }
  }
}
