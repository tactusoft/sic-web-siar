import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {Constants} from '../../../common/constants';
import {ToastrService} from 'ngx-toastr';
import {GenericoService} from '../../../servicios/generico.service';
import {LenguajeService} from '../../../servicios/lenguaje.service';
import {TipoHomologacion} from '../../../modelos/registro-homologacion';

@Component({
  selector: 'app-dialog-gestion-sincronizacion',
  templateUrl: './dialog-gestion-sincronizacion.component.html',
  styleUrls: ['./dialog-gestion-sincronizacion.component.scss']
})
export class DialogGestionSincronizacionComponent implements OnInit {
  // Constantes
  iconoUsuario = Constants.ICON_USUARIO;
  // Variables
  formularioGestion: FormGroup;
  submit = false;
  nuevo = false;
  tipoRegistro = '';
  registro: any = {};
  listaSiar = [];
  idioma: number;
  textos: any = null;
  textosMensajes: any = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder,
              private genericoService: GenericoService,
              private lenguajeService: LenguajeService,
              private toastr: ToastrService,
              public dialogRef: MatDialogRef<DialogGestionSincronizacionComponent>,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('iconoUsuario', sanitizer.bypassSecurityTrustResourceUrl(this.iconoUsuario));
    this.nuevo = data.nuevo;
    this.registro = data.registro_ajuste;
    this.tipoRegistro = data.tipoRegistro;
  }

  // Funciones para usar las validaciones del formulario
  get nombre(): any { return this.formularioGestion.get('nombre'); }
  get elementoSiar(): any { return this.formularioGestion.get('elementoSiar'); }

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

    this.builderForm();
    this.listarElementosSiar();
  }

  builderForm(): void {
    this.formularioGestion = this.formBuilder.group({
      nombre: new FormControl(this.nuevo && this.registro === null ? '' : this.registro.externalField
        , [Validators.required, Validators.pattern(Constants.PATTERN_WHITE_SPACE), Validators.maxLength(500)]),
      elementoSiar: new FormControl(this.nuevo && this.registro === null
        ? ''
        : this.registro.idSiar, [Validators.required])
    });
  }

  guardar(): void {
    this.submit = true;
  }

  guardarHomologacion(): void {
    this.submit = true;
    if (this.formularioGestion.valid) {
      const request = {
        id: this.nuevo ? null : this.registro.id,
        idSiar: this.elementoSiar.value,
        externalField: this.nombre.value,
        type: this.tipoRegistro,
        idCountry: 11
      };
      const url = Constants.PATH_SAVE_HOMOLOGACION;
      this.genericoService.post(request, url).subscribe(respuesta => {
        if (respuesta.message === '200') {
          this.toastr.success(this.textosMensajes ? this.textosMensajes.MSJ_OPE_REALIZADA : Constants.MSJ_OPE_REALIZADA);
          this.dialogRef.close(true);
        }
      }, error => {
        console.error(error);
        this.toastr.error(this.textosMensajes ? this.textosMensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR, '¡Error', {
          closeButton: true,
          titleClass: 'toast-tittle-error'
        });
      });
    }
  }

  listarElementosSiar(): void {
    if (this.tipoRegistro === TipoHomologacion.TipoP) {
      const urlPaises = `${Constants.PATH_LISTAR_PAIS_LANG}?pais=0&lang=${this.idioma}`;
      this.genericoService.get(urlPaises).subscribe(respuesta => {
        this.listaSiar = respuesta.data;
        this.listaSiar = this.listaSiar.sort((a, b) => a.nombre.localeCompare(b.nombre));
      });
    } else {
      const urlCategorias = `${Constants.PATH_LISTAR_DOMINIO_NOMBRE_LANG}?nombre=Categoria&idioma=${this.idioma}`;
      this.genericoService.get(urlCategorias).subscribe(respuesta => {
        this.listaSiar = respuesta.data.dominio;
        this.listaSiar = this.listaSiar[0].subDominio.sort((a, b) => a.description.localeCompare(b.description));
      });
    }
  }
}
