import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { GenericoService } from '../../../servicios/generico.service';
import { GestionDocPubliService } from '../gestion-doc-publi.service';
import { ToastrService } from 'ngx-toastr';
import {Constants} from '../../../common/constants';
import {Documento} from '../../../modelos/documento';
import {Pais} from '../../../modelos/pais';
import {LenguajeService} from '../../../servicios/lenguaje.service';

@Component({
  selector: 'app-dialog-editar',
  templateUrl: './dialog-editar.component.html',
  styleUrls: ['./dialog-editar.component.scss']
})
export class DialogEditarComponent implements OnInit {

  documentoActual: Documento;
  anexos: any = [];
  imagenes: any = [];
  formEditar: FormGroup;
  NUMERO_ARCHIVOS = 10;
  NUMERO_IMAGENES = 5;
  tituloC = new FormControl('',  [Validators.required, Validators.maxLength(200)]);
  paisC = new FormControl('',  [Validators.required]);
  categoriaC = new FormControl('',  [Validators.required]);
  enlacesC = new FormControl();
  intentoGuardar = false;
  paises: Pais[];
  categorias: any = [];
  enlacesAnexos: string[] = [];
  form = new FormGroup({
    titulo: this.tituloC,
    pais: this.paisC,
    categoria: this.categoriaC,
    enlaces: this.enlacesC
  });
  ENLACE = 'Enlaces';
  ANEXO = 'Anexos';
  IMAGEN = 'Imagenes';
  anexosEntrantes: any = [];
  imagenesEntrantes: any = [];
  enlacesEntrantes: any = [];
  recursosEliminados: any = [];
  idioma: number;
  textos: any = null;
  textosMensajes: any = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private toastr: ToastrService,
              private genericoService: GenericoService,
              private lenguajeService: LenguajeService,
              public dialogRef: MatDialogRef<DialogEditarComponent>,
              private gestionService: GestionDocPubliService
              )
    {
      this.documentoActual = data;
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
          this.toastr.error(this.textosMensajes ? this.textosMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });

    this.tituloC.setValue(this.documentoActual.title);
    this.enlacesEntrantes = this.getRecurso(this.documentoActual, this.ENLACE);
    this.anexosEntrantes = this.getRecurso(this.documentoActual, this.ANEXO);
    this.imagenesEntrantes = this.getRecurso(this.documentoActual, this.IMAGEN);
    this.listarPaises();
    this.listarCategorias();
  }

  limpiarInput(input: any): void{
    input.setValue('');
  }


  getRecurso(documento: Documento , tipoRecurso: string): Array<string>{
    const listado = [];
    if ('recursos' in documento) {
      documento.recursos.forEach( recurso => {
        if ('resourceTypeId' in recurso){
          if (recurso.resourceTypeId.description === tipoRecurso){
            listado.push(recurso);
          }
        }
      });
    }
    return listado;
  }

  handleFileInput(files: any): void {
    const formatos = ['png', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'rtf', 'pdf'];
    const pesoMax =  5000000;
    for (const file1  of files){
      if (file1.size > pesoMax){
        this.toastr.warning(this.textosMensajes ? this.textosMensajes.MSJ_PESO_MAXIMO : Constants.MSJ_PESO_MAXIMO);
        return;
      }
    }

    for (const file1 of files){
      const name = file1.name.slice(file1.name.lastIndexOf('.') + 1, file1.name.length );
      const esta = formatos.includes(name.toLowerCase());
      if (!esta) {
        this.toastr.warning(this.textosMensajes ? this.textosMensajes.FORMATO_DOCUMENTOS_INVALIDO : Constants.FORMATO_DOCUMENTOS_INVALIDO);
        return;
      }
    }

    if ( (files.length + this.anexos.length + this.anexosEntrantes.length) > this.NUMERO_ARCHIVOS){
      this.toastr.info(this.textosMensajes ? this.textosMensajes.MSJ_MAXIMO_ARCHIVOS : Constants.MSJ_MAXIMO_ARCHIVOS);
      return;
    }
    for (const file1  of files){
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
        this.anexos.push(multimedia);
      };
      reader.readAsDataURL(file1);
    }
  }

  handleImagenInput(files: any): void {
    const formatos = ['png', 'gif', 'jpg', 'jpeg'];
    const pesoMax =  5000000;
    for (const file1  of files){
      if (file1.size > pesoMax){
        this.toastr.warning(this.textosMensajes ? this.textosMensajes.MSJ_PESO_MAXIMO : Constants.MSJ_PESO_MAXIMO);
        return;
      }
    }

    for (const file1 of files){
      const name = file1.name.slice(file1.name.lastIndexOf('.') + 1, file1.name.length );
      const esta = formatos.includes(name.toLowerCase());
      if (!esta) {
        this.toastr.warning(this.textosMensajes ? this.textosMensajes.FORMATO_DOCUMENTOS_INVALIDO : Constants.FORMATO_DOCUMENTOS_INVALIDO);
        return;
      }
    }

    if ( (files.length + this.imagenes.length + this.imagenesEntrantes.length) > this.NUMERO_IMAGENES){
      this.toastr.info(this.textosMensajes ? this.textosMensajes.MSJ_MAXIMO_ARCHIVOS : Constants.MSJ_MAXIMO_ARCHIVOS);
      return;
    }
    for (const file1  of files){
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

  openFileExplorer(): void {
    if ((this.anexos.length + this.anexosEntrantes.length) < this.NUMERO_ARCHIVOS) {
      const input: HTMLElement = document.getElementById('anexoInput') as HTMLElement;
      input.click();
    }else{
      this.toastr.info(this.textosMensajes ? this.textosMensajes.MSJ_MAXIMO_ARCHIVOS : Constants.MSJ_MAXIMO_ARCHIVOS);
    }
  }
  openImagenExplorer(): void {
    if ((this.imagenes.length + this.imagenesEntrantes.length) < this.NUMERO_IMAGENES) {
      const input: HTMLElement = document.getElementById('imageInput') as HTMLElement;
      input.click();
    }else{
      this.toastr.info(this.textosMensajes ? this.textosMensajes.MSJ_MAXIMO_ARCHIVOS : Constants.MSJ_MAXIMO_ARCHIVOS);
    }
  }

  eliminarArchivo(arch: any): void{
    const indx = this.anexos.map(res => res.nombre).indexOf(arch.nombre);
    this.anexos.splice(indx, 1);
  }

  eliminarImagen(arch: any): void{
    const indx = this.imagenes.map(res => res.nombre).indexOf(arch.nombre);
    this.imagenes.splice(indx, 1);
  }

  eliminarArchivoExistente(arch: any): void{
    const indx = this.anexosEntrantes.map(res => res.id).indexOf(arch.id);
    this.anexosEntrantes.splice(indx, 1);
    this.recursosEliminados.push(arch.id);
  }

  eliminarImagenExistente(arch: any): void{
    const indx = this.imagenesEntrantes.map(res => res.id).indexOf(arch.id);
    this.imagenesEntrantes.splice(indx, 1);
    this.recursosEliminados.push(arch.id);
  }

  removeEnlaceExistente(arch: any): void{
    const indx = this.enlacesEntrantes.map(res => res.nombre).indexOf(arch.nombre);
    this.enlacesEntrantes.splice(indx, 1);
    this.recursosEliminados.push(arch.id);
  }

  eliminarPais(pais: any): void{
    const soporte =  this.paisC.value;
    const indx = soporte.map(res => res.id).indexOf(pais.id);
    soporte.splice(indx, 1);
    this.paisC.reset();
    this.paisC.setValue(soporte);
  }

  eliminarCategoria(categoria: any): void{
    const soporte =  this.categoriaC.value;
    const indx = soporte.map(res => res.id).indexOf(categoria.id);
    soporte.splice(indx, 1);
    this.categoriaC.reset();
    this.categoriaC.setValue(soporte);
  }

  removeEnlace(enlace): void{
    const index = this.enlacesAnexos.findIndex(e => e === enlace);
    this.enlacesAnexos.splice(index, 1);
  }

  agregarDocumento(): void{
    this.intentoGuardar = true;
    this.tituloC.setValue(this.tituloC.value.trim());
    if (this.form.valid){
      const url = Constants.PATH_GUARDAR_DOCUMENTO;
      const baseArray = [];
      this.anexos.forEach(res => baseArray.push(res.base64));
      const categoriasEnv = [];
      this.categoriaC.value.forEach(res => categoriasEnv.push(res.id));
      const paisesEnv = [];
      this.paisC.value.forEach(res => paisesEnv.push(res.id));
      const req = {
        id: this.documentoActual.id,
        title: this.tituloC.value,
        summary: '',
        categorias: categoriasEnv,
        state: 'A',
        paises: paisesEnv,
        archivos: this.anexos.concat(this.imagenes),
        enlaces: this.enlacesAnexos,
        eliminar:  this.recursosEliminados
      };
      this.genericoService.post(req, url).subscribe( res => {
        if (res.message === '200'){
          this.toastr.success(this.textosMensajes ? this.textosMensajes.MSJ_OPE_REALIZADA : Constants.MSJ_OPE_REALIZADA);
          this.gestionService.recargarDocumentos.emit(true);
        }else{
          this.toastr.error(this.textosMensajes ? this.textosMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        }
        this.dialogRef.close();
      });
    }
  }

  listarPaises(): void{
    this.genericoService.get(`${Constants.PATH_LISTAR_PAIS_LANG}?pais=0&lang=${this.idioma}`).subscribe( res => {
      this.paises = res.data;
      const paisesLista = [];
      for (const doc of this.documentoActual.paises) {
        const indx = this.paises.findIndex(ind => doc.id === ind.id);
        paisesLista.push(this.paises[indx]);
      }
      this.paisC.setValue(paisesLista);
    });
  }


  listarCategorias(): void{
    this.genericoService.get(`${Constants.PATH_LISTAR_DOMINIO_NOMBRE_LANG}?nombre=Categoria Documentos&idioma=${this.idioma}`)
    .subscribe( res => {
      this.categorias = res.data.dominio[0].subDominio;
      this.categorias.sort((a, b) => b.description > a.description ? -1 : b.description > a.description ? 1 : 0);
      const categoriaLista = [];
      for (const doc of this.documentoActual.categorias) {
        const indx = this.categorias.findIndex(ind => doc.id === ind.id);
        categoriaLista.push(this.categorias[indx]);
      }
      this.categoriaC.setValue(categoriaLista);
    });
  }

  agregarEnlace(enlace: string): void{
    if (enlace.trim().length !== 0){
      this.enlacesAnexos.push(enlace);
      this.enlacesC.setValue('');
    }
  }

  redirect(event): void{
    window.open(event, '_blank');
  }
}
