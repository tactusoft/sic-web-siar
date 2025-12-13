import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GenericoService } from '../../../servicios/generico.service';
import { ToastrService } from 'ngx-toastr';
import { Constants } from '../../../common/constants';
import { LenguajeService } from '../../../servicios/lenguaje.service';

// tslint:disable-next-line:class-name
interface dato {
  nombre: string;
  url: string;
  id: number;
}

@Component({
  selector: 'app-dialog-edit-doc',
  templateUrl: './dialog-edit-doc.component.html',
  styleUrls: ['./dialog-edit-doc.component.scss']
})

export class DialogEditDocComponent implements OnInit {
  maxSize = 5000000;
  req: any;
  arch: any;
  guardar = false;
  guardar2 = false;
  nombreCarp: string;
  imgBase64Path: any;
  fileList: File[] = [];
  listArch: dato[] = [];
  listBorr: number[] = [];
  idioma: string;
  textos: any = null;
  textosMensajes: any = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private genericoService: GenericoService,
    private toastrService: ToastrService,
    private lenguajeService: LenguajeService,
    public dialogRef: MatDialogRef<DialogEditDocComponent>) { }

  ngOnInit(): void {
    // Se subscribe al cambio de idioma
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
    this.req = [];
    this.arch = [];
    for (const file of this.data.valor.hijos){
      this.listArch.push({ nombre: file.archivo, id: file.id, url: file.url });
    }
  }

  onNoClick(): void {
    setTimeout(() => {
      this.dialogRef.close();
    }, 1000);
  }

  onFileChange(fileInput): void {
    if (fileInput.target.files && fileInput.target.files[0]) {
      if (this.arch.length >= 5) {
        this.toastrService.error(this.textosMensajes ? this.textosMensajes.NUMERO_MAXIMO_ARCHIVO_5 : Constants.NUMERO_MAXIMO_ARCHIVO_5);
        return;
      }
      for (const file of fileInput.target.files) {
        if (!Constants.tipoArchivosValidos.includes(file.type)) {
          this.toastrService.error(this.textosMensajes
              ? this.textosMensajes.FORMATO_DOCUMENTOS_INVALIDO : Constants.FORMATO_DOCUMENTOS_INVALIDO);
          return;
        }
      }
      for (const file of fileInput.target.files) {
        if (file.size > this.maxSize) {
          this.toastrService.error(this.textosMensajes ? this.textosMensajes.TAMANO_SUPERADO : Constants.TAMANO_SUPERADO);
          return;
        }
      }
      for (const file of fileInput.target.files) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.listArch.push({ nombre: file.name, url: file.url, id: (this.listArch.length + 1) });
          this.arch.push(
            {
              base64: String(reader.result).trim(),
              extension: file.type,
              tamano: file.size,
              nombre: file.name
            });
        };
      }
    }
  }

  omitSpecialChar(event): boolean {
    const k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k === 8 || k === 32 || (k >= 48 && k <= 57));
  }

  guardarFolder(nomb): void {
    if (nomb.trim() === '') {
      this.guardar = true;
    } else {
      this.req.push({
        id: this.data.valor.id,
        nombre: nomb,
        archivos: this.arch,
        fecha: new Date(),
        lstElimina: this.listBorr
      });
      const url = `/folder/guardarFolder`;
      this.genericoService.post(this.req[0], url).subscribe(res => {
        if (res.message === '200') {
          this.toastrService.success(this.textosMensajes ? this.textosMensajes.MSJ_OPE_REALIZADA : Constants.MSJ_OPE_REALIZADA);
          this.dialogRef.close(true);
        } else {
          this.toastrService.error(this.textosMensajes ? this.textosMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        }
      }, () => {
        this.toastrService.error(this.textosMensajes ? this.textosMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
      });
    }
  }

  eliminarArchivo(val, index): void {
    this.arch.splice(this.arch.indexOf(index), 1);
    this.listArch.splice(index, 1);
    if (val.id > 10) {
      this.listBorr.push(val.id);
    }
  }
}
