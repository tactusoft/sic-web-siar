import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { AlertaDto } from '../../../modelos/alerta-dto';
import { GenericoService } from '../../../servicios/generico.service';
import { AdjuntoDTO } from '../../../modelos/adjuntoDto';
import { IngresAlertaService } from '../ingres-alerta.service';
import { Constants } from '../../../common/constants';
import { ToastrService } from 'ngx-toastr';
import { LenguajeService } from '../../../servicios/lenguaje.service';

@Component({
  selector: 'app-dialog-editar-alerta',
  templateUrl: './dialog-editar-alerta.component.html',
  styleUrls: ['./dialog-editar-alerta.component.scss']
})
export class DialogEditarAlertaComponent implements OnInit {
  IMAGEN = 'Imagenes';
  ARCHIVO = 'Anexos';
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
  imagenesEntrantes: any = [];
  archivos: any = [];
  archivosEntrantes: any = [];
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
  textosMensajes: any = null;

  constructor(public dialogRef: MatDialogRef<DialogEditarAlertaComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private genericoService: GenericoService,
              private toastrService: ToastrService,
              private lenguajeService: LenguajeService,
              private alertaService: IngresAlertaService
  ) {
    this.alerta.paisOrigen = [];
    this.alerta.riesgos = [];
    this.alerta.paisAfectado = [];
    this.imagenesEntrantes = [];
    this.archivosEntrantes = [];
    this.inicializarAlerta(data);
    this.rolUsuarioActual = JSON.parse(localStorage.getItem('usuario')).rol;
  }

  ngOnInit(): void {
    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      this.idioma = this.lenguajeService.devolverIntIdioma(data);
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
        this.textos = texts;
        this.textosMensajes = texts?.mensajes;
      },
        () => {
          this.toastrService.error(this.textosMensajes ? this.textosMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });

    this.getDominios('Categoria');
    this.getDominios('Nivel de Riesgo');
    this.getDominios('Riesgos');
    this.getDominios('Tipo de Medida');
    this.getDominios('Fuente');
    this.getDominios('Proveedores');
    this.getPaises();
    this.getPaisesNotificantes();
    this.getProveedores();
    this.imagenesEntrantes = this.getRecurso(this.alerta.otrosRecurs, this.IMAGEN);
    this.archivosEntrantes = this.getRecurso(this.alerta.otrosRecurs, this.ARCHIVO);
  }

  inicializarAlerta(alerta): void {
    this.alerta.codigoSiar = alerta.id;
    this.alerta.contentLanguageId = alerta.contentLanguageId;
    this.alerta.paisNotific = alerta.idCountry;
    this.alerta.nombreProd = alerta.productName;
    this.alerta.categoria = alerta.categoryId;
    this.alerta.paisOrigen = alerta.productOriginCountry;
    this.alerta.paisAfectado = alerta.sourceCountry;
    this.alerta.fechaPubl = alerta.publicationDate;
    this.alerta.descripProd = alerta.productDescription;
    this.alerta.marcaProd = alerta.productBrand;
    this.alerta.urlFuente = alerta.urlSource;
    this.alerta.nombHistProd = alerta.proveedor;
    this.alerta.unidades = alerta.units;
    this.alerta.periodoVent = alerta.periodSold;
    this.alerta.tipNumMode = alerta.typeNumberModel;
    this.alerta.numLote = alerta.batchNumberBarcode;
    this.alerta.fabricante = alerta.manufacturerer;
    this.alerta.inportador = alerta.importer;
    this.alerta.distribuidor = alerta.distributor;
    this.alerta.descDefecto = alerta.defectDescription;
    this.alerta.accidReport = alerta.accidentsReported;
    this.alerta.recomAdvert = alerta.recommendationsWarnings;
    this.alerta.observacion = alerta.additionalInformation;
    this.alerta.nivelRiesg = alerta.nivelRiesgo;
    this.alerta.riesgos = alerta.riesgo;
    this.alerta.tipMedida = alerta.measureTypeId;
    this.alerta.medidas = alerta.measures;
    this.alerta.otrosRecurs = alerta.recursos;
    this.alerta.fuente = alerta.source;
    this.alerta.americas = alerta.americas;
    this.alerta.creationDate = alerta.creationDate;
    this.alerta.creationUser = alerta.creationUser;
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
        }
        let paisesRes = [];
        for (const pais of this.alerta.paisOrigen) {
          const indx = this.paisList.find(ind => pais.id === ind.id);
          paisesRes.push(indx);
        }
        this.alerta.paisOrigen = paisesRes;

        paisesRes = [];
        for (const pais of this.alerta.paisAfectado) {
          const indx = this.paisList.find(ind => pais.id === ind.id);
          paisesRes.push(indx);
        }
        this.alerta.paisAfectado = paisesRes;
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
        const indx = this.proveedorList.find(ind => this.alerta.nombHistProd?.id === ind.id);
        this.alerta.nombHistProd = indx;
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
      if (this.rolUsuarioActual.id === this.ID_ROL_EDITOR_PAIS) {
        const actualPais = JSON.parse(localStorage.getItem('usuario')).pais.id;
        this.paisNotificante = this.paisesNotificanteList.find(el => el.id === actualPais);
      }
      const indx1 = this.paisesNotificanteList.find(ind => this.alerta.paisNotific?.id === ind.id);
      this.alerta.paisNotific = indx1;
    });
  }

  getRecurso(data: any[], tipoRecurso: string): Array<string> {
    const listado = [];
    data.forEach(recurso => {
      if ('resourceTypeId' in recurso) {
        if (recurso.resourceTypeId.description === tipoRecurso) {
          listado.push(recurso);
        }
      }
    });
    return listado;
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
          const indx = this.categoriaList.find(ind => this.alerta.categoria?.id === ind.id);
          this.alerta.categoria = indx;
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
            const indx = this.nivRiesgoList.find(ind => this.alerta.nivelRiesg?.id === ind.id);
            this.alerta.nivelRiesg = indx;
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
              const riesgosAux = [];
              for (const riesgo of this.alerta.riesgos) {
                riesgosAux.push(this.riesgoList.find(index => riesgo.id === index.id));
              }
              this.alerta.riesgos = riesgosAux;
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
                const indx = this.tipMedList.find(ind => this.alerta.tipMedida?.id === ind.id);
                this.alerta.tipMedida = indx;
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
                  const indx = this.fuentList.find(ind => this.alerta.fuente?.id === ind.id);
                  this.alerta.fuente = indx;
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
      id: this.alerta.codigoSiar === undefined ? null : this.alerta.codigoSiar,
      contentLanguageId: 1,
      idCountry: this.alerta.paisNotific === undefined ? null : this.alerta.paisNotific,
      productName: this.alerta.nombreProd === undefined ? null : this.alerta.nombreProd,
      categoryId: this.alerta.categoria === undefined ? null : this.alerta.categoria,
      productOriginCountry: this.alerta.paisOrigen === undefined ? null : this.alerta.paisOrigen.map(a => a.id),
      sourceCountry: this.alerta.paisAfectado === undefined ? null : this.alerta.paisAfectado.map(a => a.id),
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
      riesgo: this.alerta.riesgos === undefined ? null : this.alerta.riesgos.map(a => a.id),
      measureTypeId: this.alerta.tipMedida === undefined ? null : this.alerta.tipMedida,
      measures: this.alerta.medidas === undefined ? null : this.alerta.medidas,
      source: this.alerta.fuente === undefined ? null : this.alerta.fuente,
      americas: this.alerta.americas === undefined ? null : this.alerta.americas,
      recursos: this.imagenesEntrantes.concat(this.archivosEntrantes),
      creationDate: this.alerta.creationDate === undefined ? null : this.alerta.creationDate,
      creationUser: this.alerta.creationUser === undefined ? null : this.alerta.creationUser,
    };

    this.req = {
      alerta: alert,
      galeria: this.imagenes,
      adjuntos: this.archivos
    };
    this.crearAlerta();
  }

  openImagenExplorer(): void {
    if ((this.imagenes.length + this.imagenesEntrantes.length) < this.NUMERO_IMAGENES) {
      const input: HTMLElement = document.getElementById('imageInput') as HTMLElement;
      input.click();
    } else {
      this.toastrService.info(this.textosMensajes ? this.textosMensajes.MSJ_MAXIMO_ARCHIVOS : Constants.MSJ_MAXIMO_ARCHIVOS);
    }
  }

  handleImagenInput(files: any): void {
    const formatos = ['png', 'gif', 'jpg', 'jpeg'];
    const pesoMax = 5000000;
    for (const file1 of files) {
      if (file1.size > pesoMax) {
        this.toastrService.warning(this.textosMensajes ? this.textosMensajes.MSJ_PESO_MAXIMO : Constants.MSJ_PESO_MAXIMO);
        return;
      }
    }

    for (const file1 of files) {
      const name = file1.name.slice(file1.name.lastIndexOf('.') + 1, file1.name.length);
      const esta = formatos.includes(name.toLowerCase());
      if (!esta) {
        this.toastrService.warning(this.textosMensajes
          ? this.textosMensajes.FORMATO_DOCUMENTOS_INVALIDO : Constants.FORMATO_DOCUMENTOS_INVALIDO);
        return;
      }
    }

    if ((files.length + this.imagenes.length + this.imagenesEntrantes.length) > this.NUMERO_IMAGENES) {
      this.toastrService.info(this.textosMensajes ? this.textosMensajes.MSJ_MAXIMO_ARCHIVOS : Constants.MSJ_MAXIMO_ARCHIVOS);
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

  redirect(event): void {
    window.open(event, '_blank');
  }

  eliminarImagen(arch: any): void {
    const indx = this.imagenes.map(res => res.nombre).indexOf(arch.nombre);
    this.imagenes.splice(indx, 1);
  }

  eliminarImagenExistente(arch: any): void {
    const indx = this.imagenes.map(res => res.nombre).indexOf(arch.nombre);
    this.imagenesEntrantes.splice(indx, 1);
  }

  handleFileInput(files: any): void {
    const formatos = ['gif', 'jpg', 'png', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'rtf', 'jpeg', 'pdf'];
    const pesoMax = 5000000;
    for (const file1 of files) {
      if (file1.size > pesoMax) {
        this.toastrService.warning(this.textosMensajes ? this.textosMensajes.MSJ_PESO_MAXIMO : Constants.MSJ_PESO_MAXIMO);
        return;
      }
    }

    for (const file1 of files) {
      const name = file1.name.slice(file1.name.lastIndexOf('.') + 1, file1.name.length);
      const esta = formatos.includes(name.toLowerCase());
      if (!esta) {
        this.toastrService.warning(this.textosMensajes
          ? this.textosMensajes.FORMATO_DOCUMENTOS_INVALIDO : Constants.FORMATO_DOCUMENTOS_INVALIDO);
        return;
      }
    }

    if ((files.length + this.archivos.length + this.archivosEntrantes.length) > this.NUMERO_ARCHIVOS) {
      this.toastrService.info(this.textosMensajes ? this.textosMensajes.MSJ_MAXIMO_ARCHIVOS : Constants.MSJ_MAXIMO_ARCHIVOS);
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
    if ((this.archivos.length + this.archivosEntrantes.length) < this.NUMERO_ARCHIVOS) {
      const input: HTMLElement = document.getElementById('fileInput') as HTMLElement;
      input.click();
    } else {
      this.toastrService.info(this.textosMensajes ? this.textosMensajes.MSJ_MAXIMO_ARCHIVOS : Constants.MSJ_MAXIMO_ARCHIVOS);
    }
  }

  eliminarArchivo(arch: any): void {
    const indx = this.archivos.map(res => res.id).indexOf(arch.id);
    this.archivos.splice(indx, 1);
  }

  eliminarArchivoExistente(arch: any): void {
    const indx = this.archivosEntrantes.map(res => res.id).indexOf(arch.id);
    this.archivosEntrantes.splice(indx, 1);
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
    } else {
      return true;
    }
  }

  crearAlerta(): void {
    this.guardando = true;
    if (this.validCamp()) {
      const url = `/alerta/modificarAlerta`;
      this.genericoService.post(this.req, url).subscribe(
        res => {
          if (res.message === '200') {
            this.toastrService.success(this.textosMensajes ? this.textosMensajes.MSJ_OPE_REALIZADA : Constants.MSJ_OPE_REALIZADA);
            this.alertaService.recargarLista.emit(true);
            this.dialogRef.close(true);
          } else {
            this.toastrService.error(this.textosMensajes ? this.textosMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
          }
        }, error => {
          console.error(error);
          this.toastrService.error(this.textosMensajes ? this.textosMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    } else {
      this.toastrService.warning(this.textosMensajes ? this.textosMensajes.MENSAJE_CAMPOS_FALTANTES : Constants.MENSAJE_CAMPOS_FALTANTES);
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
