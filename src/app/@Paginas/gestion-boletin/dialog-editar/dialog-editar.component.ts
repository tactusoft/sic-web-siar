import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GestionBoletinService } from '../gestion-boletin.service';
import { ToastrService } from 'ngx-toastr';
import { Constants } from '../../../common/constants';
import { GestionBoletin } from '../../../modelos/gestion-boletin';
import { LenguajeService } from '../../../servicios/lenguaje.service';
import { GenericoService } from '../../../servicios/generico.service';


@Component({
  selector: 'app-dialog-editar',
  templateUrl: './dialog-editar.component.html',
  styleUrls: ['./dialog-editar.component.scss']
})
export class DialogEditarComponent implements OnInit {
  boletin: GestionBoletin;
  fileToUpload: File = null;
  archivo: any = [];
  contArchivos = 0;
  formEditar: FormGroup;
  NUMERO_ARCHIVOS = 5;
  tituloC = new FormControl('', [Validators.required, Validators.maxLength(800)]);
  fechaC = new FormControl('', Validators.required);
  resumenC = new FormControl('', Validators.required);
  recursos: any = [];
  intentoGuardar = false;
  idioma: string;
  textos: any = null;
  textosMensajes: any = null;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private toastr: ToastrService,
              private genericoService: GenericoService,
              private toastrService: ToastrService,
              private lenguajeService: LenguajeService,
              public dialogRef: MatDialogRef<DialogEditarComponent>,
              private gestionService: GestionBoletinService) {
    this.boletin = data;
    this.tituloC.setValue(this.boletin.boletin.titulo);
    this.fechaC.setValue(new Date(this.boletin.boletin.fecha));
    this.resumenC.setValue(this.boletin.boletin.resumen);
    this.boletin.recursos.forEach(el => {
      this.archivo.push(
        {
          id: el.id,
          nombreRecurso: el.path,
          peso: null
        });
      this.recursos.push(el);
    });
  }

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
  }

  limpiarInput(input: any): void {
    input.setValue('');
  }

  handleFileInput(files: any): void {
    const formatos = ['gif', 'jpg', 'png', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'rtf', 'jpeg', 'pdf'];
    const pesoMax = 5000000;
    for (const file1 of files) {
      if (file1.size > pesoMax) {
        this.toastr.warning(this.textosMensajes ? this.textosMensajes.MSJ_PESO_MAXIMO : Constants.MSJ_PESO_MAXIMO);
        return;
      }
    }

    for (const file1 of files) {
      const name = file1.name.slice(file1.name.lastIndexOf('.') + 1, file1.name.length);
      const esta = formatos.includes(name);
      if (!esta) {
        this.toastr.warning(this.textosMensajes ? this.textosMensajes.FORMATO_DOCUMENTOS_INVALIDO : Constants.FORMATO_DOCUMENTOS_INVALIDO);
        return;
      }
    }

    if ((files.length + this.archivo.length) > this.NUMERO_ARCHIVOS) {
      this.toastr.info(this.textosMensajes ? this.textosMensajes.MSJ_MAXIMO_ARCHIVOS : Constants.MSJ_MAXIMO_ARCHIVOS);
      return;
    }
    for (const file1 of files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageStr = e.target.result;
        const multimedia = {
          id: file1.name,
          path: '',
          tipoMultimedia: file1.type.trim().toString(),
          nombreRecurso: file1.name,
          peso: file1.size,
          base64: imageStr.split(':')[1]
        };
        this.archivo.push(multimedia);
        this.contArchivos += 1;
      };
      reader.readAsDataURL(file1);
    }
  }

  openFileExplorer(): void {
    if (this.archivo.length < this.NUMERO_ARCHIVOS) {
      const input: HTMLElement = document.getElementById('imageInput') as HTMLElement;
      input.click();
    } else {
      this.toastr.info(this.textosMensajes ? this.textosMensajes.MSJ_MAXIMO_ARCHIVOS : Constants.MSJ_MAXIMO_ARCHIVOS);
    }
  }

  eliminarArchivo(arch: any): void {
    const indx = this.archivo.map(res => res.id).indexOf(arch.id);
    if (indx !== -1) {
      this.archivo.splice(indx, 1);
    }
    const indr = this.recursos.map(res => res.id).indexOf(arch.id);
    if (indr !== -1) {
      this.recursos.splice(indr, 1);
    }
  }

  editarBoletin(): void {
    this.intentoGuardar = true;
    this.tituloC.setValue(this.tituloC.value.trim());
    this.resumenC.setValue(this.resumenC.value.trim());
    if (this.resumenC.value.length >= 4000) {
      this.resumenC.setValue(this.resumenC.value.substring(0, 3999));
    }
    if (this.fechaC.valid && this.tituloC.valid && this.resumenC.valid) {
      const url = Constants.PATH_EDITAR_BOLETIN;
      const baseArray = [];
      for (const res of this.archivo) {
        if (res.base64 === undefined) {
          continue;
        } else {
          baseArray.push(res.base64);
        }
      }
      const req = {
        boletin: {
          id: this.boletin.boletin.id,
          titulo: this.tituloC.value,
          resumen: this.resumenC.value,
          fecha: this.fechaC.value,
          archivo: null,
          imagen: null
        },
        recursos: this.recursos,
        base64: baseArray
      };
      this.genericoService.post(req, url).subscribe(res => {
        if (res.message === '200') {
          this.toastr.success(this.textosMensajes ? this.textosMensajes.MSJ_OPE_REALIZADA : Constants.MSJ_OPE_REALIZADA);
          this.gestionService.recargarBoletines.emit(true);
        } else {
          this.toastr.error(this.textosMensajes ? this.textosMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        }
        this.dialogRef.close();
      });
    }
  }
}
