import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GenericoService } from '../../../servicios/generico.service';
import { Idioma } from '../../../modelos/idioma';
import { ToastrService } from 'ngx-toastr';
import { LenguajeService } from '../../../servicios/lenguaje.service';
import { Constants } from '../../../common/constants';
import { Usuario } from '../../../modelos/usuario';

@Component({
  selector: 'app-dialog-invitacion',
  templateUrl: './dialog-invitacion.component.html',
  styleUrls: ['./dialog-invitacion.component.scss']
})
export class DialogInvitacionComponent implements OnInit {
  usuario: Usuario;
  correoReenvio = '';
  formInvitacion: FormGroup;
  idiomas: Array<Idioma> = [];
  enviarCopia = new FormControl(true);
  buscarIdioma: FormControl;
  formFiltro: FormGroup;
  messageParam: string;
  messageEmail: string;
  idiomaSeleccionado: string;
  submit = false;
  textos: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private lenguajeService: LenguajeService,
    private genericoService: GenericoService,
    public dialogRef: MatDialogRef<DialogInvitacionComponent>,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.lenguajeService.idiomaSubject.subscribe(data => {
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
        this.textos = texts;
      },
        () => {
          this.toastrService.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
    this.buscarIdioma = new FormControl('');
    this.formFiltro = new FormGroup({
      idIdioma: new FormControl(0)
    });
    this.usuario = this.data.usuario;
    this.correoReenvio = this.obtenerCorreoUsuario();
    this.formInvitacion = new FormGroup({
      correoCopia: new FormControl(this.correoReenvio),
      idIdioma: new FormControl(this.idiomaSeleccionado, [Validators.required]),
      idUsuario: new FormControl(this.usuario.id),
      messageParam: new FormControl(this.messageParam, [Validators.required])
    });
    this.consultarIdiomas();
  }

  obtenerCorreoUsuario(): string {
    return localStorage.getItem('usuario') ? JSON.parse(localStorage.getItem('usuario')).email : '';
  }

  enviarInvitacion(data: any): void {
    this.submit = true;
    if (this.messageEmail !== undefined && this.idiomaSeleccionado !== undefined) {
      const req = {
        correoCopia: data.correoCopia,
        idIdioma: parseInt(this.idiomaSeleccionado, 10),
        idUsuario: data.idUsuario,
        mensaje: this.messageEmail,
      };
      if (this.enviarCopia.value) {
        data.correoCopia = this.correoReenvio;
      } else {
        data.correoCopia = null;
      }
      const url = `/usuario/enviarInvitacion`;
      this.genericoService.post(req, url).subscribe(res => {
        if (res.message === '200') {
          const respuesta = {
            estado: true,
            email: this.usuario.email
          };
          this.dialogRef.close(respuesta);
        }
      });
    }
  }
  mostrar(filtro: string = '', campo: string): boolean {
    if (filtro.length > 0) {
      if (campo.toLowerCase().includes(filtro.toLowerCase())) {
        return true;
      }
      else {
        return false;
      }
    }
    return true;
  }
  consultarIdiomas(): void {
    const url = `/idioma/listarIdioma?page=0&size=4`;
    this.genericoService.get(url).subscribe(res => {
      if (res.message === '200') {
        this.idiomas = res.data;
      }
    });
  }

  cambioIdioma(event: any): void {
    const url = `/traduccion/consultaCorreoTraduccion?idLanguage=${event.value}`;
    this.genericoService.get(url).subscribe(res => {
      if (res.message === '200') {
        this.messageParam = res.data.message;
        this.messageEmail = res.data.messageParam;
        this.idiomaSeleccionado = event.value;
      } else if (res.message === '204') {
        this.toastrService.info(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_NO_DATA : Constants.MENSAJE_NO_DATA);
        this.messageParam = '';
        this.messageEmail = undefined;
        this.idiomaSeleccionado = undefined;
      } else {
        this.toastrService.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        this.messageParam = '';
        this.messageEmail = undefined;
        this.idiomaSeleccionado = undefined;
      }
    }, error => {
      console.error(error);
      this.toastrService.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
    });
  }

  nombreIdiomaTraduccion(descripcion: string): any {
    try {
      if (this.textos?.idiomas) {
        return this.textos.idiomas[descripcion.trim()];
      } else {
        return descripcion;
      }
    } catch {
      return descripcion;
    }
  }
}
