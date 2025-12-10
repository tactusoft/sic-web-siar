import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AlertaDto } from '../../../modelos/alerta-dto';
import { GenericoService } from '../../../servicios/generico.service';
import { AdjuntoDTO } from '../../../modelos/adjuntoDto';
import { IngresAlertaService } from '../ingres-alerta.service';
import { Constants } from '../../../common/constants';
import { ToastrService } from 'ngx-toastr';
import { LenguajeService } from '../../../servicios/lenguaje.service';

@Component({
  selector: 'app-dialog-ingresar-alerta',
  templateUrl: './dialog-ingresar-alerta.component.html',
  styleUrls: ['./dialog-ingresar-alerta.component.scss']
})


export class DialogIngresarAlertaComponent implements OnInit {

  ID_ROL_ADMIN_PRINC = 1;
  ID_ROL_ADMIN = 2;
  ID_ROL_EDITOR_PAIS = 3;

  categoriaList: Array<any> = [];
  paisList: Array<any> = [];
  paisesNotificanteList: Array<any> = [];
  nivRiesgoList: Array<any> = [];
  riesgoList: Array<any> = [];
  tipMedList: Array<any> = [];
  dominioList: Array<any> = [];
  fuentList: Array<any> = [];
  rolUsuarioActual: any;
  proveedorList: Array<any> = [];
  imgBase64Path: any;
  fileList: File[] = [];
  listArch: AdjuntoDTO[] = [];
  req: any;
  arch: any = [];
  imagenes: any = [];
  archivos: any = [];
  NUMERO_IMAGENES = 10;
  NUMERO_ARCHIVOS = 4;
  guardar1 = false;
  guardar2 = false;
  guardar3 = false;
  guardar4 = false;
  guardar5 = false;
  alerta = new AlertaDto();
  AdjuntoDTO: AdjuntoDTO;
  paisNotificante: any;
  guardando = false;
  idioma: number;
  textos: any = null;

  constructor(public dialogRef: MatDialogRef<DialogIngresarAlertaComponent>,
              private genericoService: GenericoService,
              private lenguajeService: LenguajeService,
              private toastrService: ToastrService,
              private alertaService: IngresAlertaService
  ) {
    this.alerta.paisOrigen = [];
    this.alerta.paisAfectado = [];
    this.alerta.riesgos = [];
    this.rolUsuarioActual = JSON.parse(localStorage.getItem('usuario')).rol;
  }

  ngOnInit(): void {
    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      this.idioma = this.lenguajeService.devolverIntIdioma(data);
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
        this.textos = texts;
      },
        () => {
          this.toastrService.error(this.textos?.mensajes ? this.textos.mensaje.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });

    this.getDominios('Categoria');
    this.getDominios('Nivel de Riesgo');
    this.getDominios('Riesgos');
    this.getDominios('Tipo de Medida');
    this.getDominios('Fuente');
    this.getPaises();
    this.getPaisesNotificantes();
    this.getProveedores();
  }

  guardarAlert(): void {
    this.dialogRef.close(true);
  }

  getPaises(): void {
    const url = `${Constants.PATH_LISTAR_PAIS_LANG}?pais=0&lang=${this.idioma}`;
    this.genericoService.get(url).subscribe(res => {
      if (res.message === '200') {
        this.paisList = res.data;
        this.paisList.sort((a, b) => {
          if (a.nombre > b.nombre) {
            return 1;
          }
          if (a.nombre < b.nombre) {
            return -1;
          }
          return 0;
        });
        if (this.rolUsuarioActual.id === this.ID_ROL_EDITOR_PAIS) {
          const actualPais = JSON.parse(localStorage.getItem('usuario')).pais.id;
          this.paisNotificante = this.paisList.find(el => el.id === actualPais);
          this.alerta.paisNotific = this.paisNotificante;
        }
      }
    }, error => {
      console.error(error);
    });
  }

  getProveedores(): void {
    const url = `/proveedor/listar?page=0&size=100`;
    this.genericoService.get(url).subscribe(res => {
      if (res.message === '200') {
        this.proveedorList = res.data.result;
        this.proveedorList.sort((a, b) => {
          if (a.title > b.title) {
            return 1;
          }
          if (a.title < b.title) {
            return -1;
          }
          return 0;
        });
      }
    }, error => {
      console.error(error);
    });
  }

  getPaisesNotificantes(): void {
    const region = 'America';
    const url = `/pais/filtrarPaises?region=${region}`;
    this.genericoService.get(url).subscribe(res => {
      res.data.sort((f, s) => {
        const a = f.nombre.toUpperCase().trim();
        const b = s.nombre.toUpperCase().trim();
        return a < b ? -1 : a > b ? 1 : 0;
      });
      this.paisesNotificanteList = res.data;
    });
  }

  getDominios(nombre: string): void {
    const url = `${Constants.PATH_LISTAR_DOMINIO_NOMBRE_LANG}?nombre=${nombre}&idioma=${this.idioma}`;
    this.genericoService.get(url).subscribe(res => {
      if (res.message === '200') {
        if (nombre === 'Categoria') {
          this.categoriaList = res.data.dominio[0].subDominio;
          this.categoriaList.sort((a, b) => {
            if (a.description.toLowerCase().trim() > b.description.toLowerCase().trim()) {
              return 1;
            }
            if (a.description.toLowerCase().trim() < b.description.toLowerCase().trim()) {
              return -1;
            }
            return 0;
          });
        } else
          if (nombre === 'Nivel de Riesgo') {
            this.nivRiesgoList = res.data.dominio[0].subDominio;
            this.nivRiesgoList.sort((a, b) => {
              if (a.description.toLowerCase().trim() > b.description.toLowerCase().trim()) {
                return 1;
              }
              if (a.description.toLowerCase().trim() < b.description.toLowerCase().trim()) {
                return -1;
              }
              return 0;
            });
          } else
            if (nombre === 'Riesgos') {
              this.riesgoList = res.data.dominio[0].subDominio;
              this.riesgoList.sort((a, b) => {
                if (a.description.toLowerCase().trim() > b.description.toLowerCase().trim()) {
                  return 1;
                }
                if (a.description.toLowerCase().trim() < b.description.toLowerCase().trim()) {
                  return -1;
                }
                return 0;
              });
            } else
              if (nombre === 'Tipo de Medida') {
                this.tipMedList = res.data.dominio[0].subDominio;
                this.tipMedList.sort((a, b) => {
                  if (a.description.toLowerCase().trim() > b.description.toLowerCase().trim()) {
                    return 1;
                  }
                  if (a.description.toLowerCase().trim() < b.description.toLowerCase().trim()) {
                    return -1;
                  }
                  return 0;
                });
              } else
                if (nombre === 'Fuente') {
                  this.fuentList = res.data.dominio[0].subDominio;
                  this.fuentList.sort((a, b) => {
                    if (a.description.toLowerCase().trim() > b.description.toLowerCase().trim()) {
                      return 1;
                    }
                    if (a.description.toLowerCase().trim() < b.description.toLowerCase().trim()) {
                      return -1;
                    }
                    return 0;
                  });
                }
      }
    }, error => {
      console.error(error);
    });
  }


  agregarEnlace(enlace: string): void {
    if (enlace.trim().length !== 0) {
      this.alerta.urlFuente = enlace;
    }
  }

  getDominio(): void {
    const url = `${Constants.PATH_LISTAR_DOMINIO_NOMBRE_LANG}?nombre=Categoria&idioma=${this.idioma}`;
    this.genericoService.get(url).subscribe(res => {
      if (res.message === '200') {
        this.dominioList = [];
      }
    }, error => {
      console.error(error);
    });
  }
  guardarAlerta(): void {
    const alert = {
      id: null,
      contentLanguageId: 1,
      idCountry: this.alerta.paisNotific === undefined ? null : this.alerta.paisNotific,
      productName: this.alerta.nombreProd === undefined ? null : this.alerta.nombreProd,
      categoryId: this.alerta.categoria === undefined ? null : this.alerta.categoria,
      productOriginCountry: this.alerta.paisOrigen === undefined ? null : this.alerta.paisOrigen,
      sourceCountry: this.alerta.paisAfectado === undefined ? null : this.alerta.paisAfectado,
      publicationDate: this.alerta.fechaPubl === undefined ? null : this.alerta.fechaPubl,
      productDescription: this.alerta.descripProd === undefined ? null : this.alerta.descripProd,
      productBrand: this.alerta.marcaProd === undefined ? null : this.alerta.marcaProd,
      urlSource: this.alerta.urlFuente === undefined ? null : this.alerta.urlFuente,
      proveedor: this.alerta.nombHistProd === undefined ? null : this.alerta.nombHistProd,
      units: this.alerta.unidades === undefined ? null : this.alerta.unidades,
      periodSold: this.alerta.periodoVent === undefined ? null : this.alerta.periodoVent,
      typeNumberModel: this.alerta.tipNumMode === undefined ? null : this.alerta.tipNumMode,
      batchNumberBarcode: this.alerta.numLote === undefined ? null : this.alerta.numLote,
      manufacturerer: this.alerta.fabricante === undefined ? null : this.alerta.fabricante,
      importer: this.alerta.inportador === undefined ? null : this.alerta.inportador,
      distributor: this.alerta.distribuidor === undefined ? null : this.alerta.distribuidor,
      defectDescription: this.alerta.descDefecto === undefined ? null : this.alerta.descDefecto,
      accidentsReported: this.alerta.accidReport === undefined ? null : this.alerta.accidReport,
      recommendationsWarnings: this.alerta.recomAdvert === undefined ? null : this.alerta.recomAdvert,
      additionalInformation: this.alerta.observacion === undefined ? null : this.alerta.observacion,
      nivelRiesgo: this.alerta.nivelRiesg === undefined ? null : this.alerta.nivelRiesg,
      riesgo: this.alerta.riesgos === undefined ? null : this.alerta.riesgos,
      measureTypeId: this.alerta.tipMedida === undefined ? null : this.alerta.tipMedida,
      measures: this.alerta.medidas === undefined ? null : this.alerta.medidas,
      source: this.alerta.fuente === undefined ? null : this.alerta.fuente,
      americas: this.alerta.americas === undefined ? null : this.alerta.americas,
      recursos: []
    };

    this.req = {
      alerta: alert,
      galeria: this.imagenes,
      adjuntos: this.archivos
    };
    this.crearAlerta();
  }

  openImagenExplorer(): void {
    if (this.imagenes.length < this.NUMERO_IMAGENES) {
      const input: HTMLElement = document.getElementById('imageInput') as HTMLElement;
      input.click();
    } else {
      this.toastrService.info(this.textos?.mensajes ? this.textos.mensajes.MSJ_MAXIMO_ARCHIVOS : Constants.MSJ_MAXIMO_ARCHIVOS);
    }
  }

  handleImagenInput(files: any): void {
    const formatos = ['png', 'gif', 'jpg', 'jpeg'];
    const pesoMax = 5000000;
    for (const file1 of files) {
      if (file1.size > pesoMax) {
        this.toastrService.warning(this.textos?.mensajes ? this.textos.mensajes.MSJ_PESO_MAXIMO : Constants.MSJ_PESO_MAXIMO);
        return;
      }
    }

    for (const file1 of files) {
      const name = file1.name.slice(file1.name.lastIndexOf('.') + 1, file1.name.length);
      const esta = formatos.includes(name.toLowerCase());
      if (!esta) {
        this.toastrService.warning(this.textos?.mensajes
          ? this.textos.mensajes.FORMATO_DOCUMENTOS_INVALIDO
          : Constants.FORMATO_DOCUMENTOS_INVALIDO);
        return;
      }
    }

    if ((files.length + this.imagenes.length) > this.NUMERO_IMAGENES) {
      this.toastrService.info(this.textos?.mensajes ? this.textos.mensajes.MSJ_MAXIMO_ARCHIVOS : Constants.MSJ_MAXIMO_ARCHIVOS);
      return;
    }
    for (const file1 of files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageStr = e.target.result;
        const multimedia = {
          extension: file1.type.trim().toString(),
          nombre: file1.name,
          tamano: file1.size,
          tipo: 'Imagenes',
          base64: imageStr.split(':')[1]
        };
        this.imagenes.push(multimedia);
      };
      reader.readAsDataURL(file1);
    }
  }

  eliminarImagen(arch: any): void {
    const indx = this.imagenes.map(res => res.nombre).indexOf(arch.nombre);
    this.imagenes.splice(indx, 1);
  }

  handleFileInput(files: any): void {
    const formatos = ['gif', 'jpg', 'png', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'rtf', 'jpeg', 'pdf'];
    const pesoMax = 5000000;
    for (const file1 of files) {
      if (file1.size > pesoMax) {
        this.toastrService.warning(this.textos?.mensajes ? this.textos.mensajes.MSJ_PESO_MAXIMO : Constants.MSJ_PESO_MAXIMO);
        return;
      }
    }

    for (const file1 of files) {
      const name = file1.name.slice(file1.name.lastIndexOf('.') + 1, file1.name.length);
      const esta = formatos.includes(name.toLowerCase());
      if (!esta) {
        this.toastrService.warning(this.textos?.mensajes
          ? this.textos.mensajes.FORMATO_DOCUMENTOS_INVALIDO : Constants.FORMATO_DOCUMENTOS_INVALIDO);
        return;
      }
    }

    if ((files.length + this.archivos.length) > this.NUMERO_ARCHIVOS) {
      this.toastrService.info(this.textos?.mensajes ? this.textos.mensajes.MSJ_MAXIMO_ARCHIVOS : Constants.MSJ_MAXIMO_ARCHIVOS);
      return;
    }
    for (const file1 of files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageStr = e.target.result;
        const multimedia = {
          extension: file1.type.trim().toString(),
          nombre: file1.name,
          tamano: file1.size,
          tipo: 'Anexos',
          base64: imageStr.split(':')[1]
        };
        this.archivos.push(multimedia);
      };
      reader.readAsDataURL(file1);
    }
  }

  openFileExplorer(): void {
    if (this.archivos.length < this.NUMERO_ARCHIVOS) {
      const input: HTMLElement = document.getElementById('fileInput') as HTMLElement;
      input.click();
    } else {
      this.toastrService.info(this.textos?.mensajes ? this.textos.mensajes.MSJ_MAXIMO_ARCHIVOS : Constants.MSJ_MAXIMO_ARCHIVOS);
    }
  }

  eliminarArchivo(arch: any): void {
    const indx = this.archivos.map(res => res.id).indexOf(arch.id);
    this.archivos.splice(indx, 1);
  }

  validCamp(): boolean {
    if (this.alerta.categoria === '' || this.alerta.categoria === undefined) {
      return false;
    } else if (this.alerta.fechaPubl === '' || this.alerta.fechaPubl === undefined) {
      return false;
    } else if (this.alerta.nombreProd === '' || this.alerta.nombreProd === undefined) {
      return false;
    } else if (this.alerta.descDefecto === '' || this.alerta.descDefecto === undefined) {
      return false;
    } else if (this.alerta.riesgos.length === 0 || this.alerta.riesgos === undefined) {
      return false;
    } else if (this.alerta.tipMedida === '' || this.alerta.tipMedida === undefined) {
      return false;
    } else if (this.alerta.descripProd === '' || this.alerta.descripProd === undefined) {
      return false;
    } else if (this.alerta.nivelRiesg === '' || this.alerta.nivelRiesg === undefined) {
      return false;
    } else if ((this.alerta.paisNotific === '' || this.alerta.paisNotific === undefined)
      && (this.alerta.fuente === '' || this.alerta.fuente === undefined)) {
      return false;
    } else if ((this.rolUsuarioActual.id === this.ID_ROL_ADMIN_PRINC || this.rolUsuarioActual.id === this.ID_ROL_ADMIN)
      && this.alerta.americas === undefined) {
      return false;
    } else {
      return true;
    }
  }
  crearAlerta(): void {
    this.guardando = true;
    if (this.validCamp()) {
      const url = `/alerta/crearAlerta`;
      this.genericoService.post(this.req, url).subscribe(
        res => {
          if (res.message === '200') {
            this.toastrService.success(this.textos?.mensajes ? this.textos.mensajes.MSJ_OPE_REALIZADA : Constants.MSJ_OPE_REALIZADA);
            this.alertaService.recargarLista.emit(true);
            this.dialogRef.close(true);
          } else {
            this.toastrService.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
          }
        }, error => {
          console.error(error);
          this.toastrService.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    } else {
      this.toastrService.warning(this.textos?.mensajes
        ? this.textos.mensajes.MENSAJE_CAMPOS_FALTANTES : Constants.MENSAJE_CAMPOS_FALTANTES);
    }
  }

  getTraduccionPaisNotificante(pais: any): string {
    try {
      return this.paisList.find(item => item.id === pais.id).nombre.trim();
    } catch {
      return pais.nombre;
    }
  }

}
