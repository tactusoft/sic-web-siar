import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Constants } from '../../../common/constants';
import { Pais } from '../../../modelos/pais';
import { GenericoService } from '../../../servicios/generico.service';
import {LenguajeService} from '../../../servicios/lenguaje.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-nuevo-rol',
  templateUrl: './dialog-nuevo-rol.component.html',
  styleUrls: ['./dialog-nuevo-rol.component.scss']
})

export class DialogNuevoRolComponent implements OnInit {
  req: any;
  guardar: boolean;
  formRegistro: FormGroup;
  estados: Array<string>;
  paises: Array<Pais>;
  array2: Array<any> = [];
  permisos: Array<any>;
  buscarPais: FormControl;
  buscarRol: FormControl;
  formFiltro: FormGroup;
  formFiltroRol: FormGroup;
  textos: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private lenguajeService: LenguajeService,
    private genericoService: GenericoService,
    private toastrService: ToastrService,
    public dialogRef: MatDialogRef<DialogNuevoRolComponent>) { }

  ngOnInit(): void {
    this.lenguajeService.idiomaSubject.subscribe(data => {
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
        this.textos = texts;
        },
        () => {
          this.toastrService.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
    this.buscarPais = new FormControl('');
    this.formFiltro = new FormGroup({
      idPais: new FormControl(0),
      idRol: new FormControl(0)
    });
    this.consultarPermisos();
    this.paises = this.data.paises;
    this.formRegistro = new FormGroup({
      approved: new FormControl(false),
      email: new FormControl('', [Validators.required, Validators.pattern(Constants.PATTERN_EMAIL)]),
      id: new FormControl(),
      idIdioma: new FormControl(),
      idPais: new FormControl(0, Validators.required),
      idRol: new FormControl(0, Validators.required),
      invitation_status: new FormControl(''),
      invitatiton_sent: new FormControl(new Date()),
      last_name: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      password: new FormControl(''),
      state: new FormControl('N'),
    });
  }
  get email(): any {
    return this.formRegistro.get('email');
  }
  get name(): any {
    return this.formRegistro.get('name');
  }
  get lasName(): any {
    return this.formRegistro.get('last_name');
  }
  get pais(): any {
    return this.formRegistro.get('idPais');
  }
  get rol(): any {
    return this.formRegistro.get('idRol');
  }

  guardarUsuario(data: any): void {
    const url = `/usuario/guardarUsuario`;
    this.genericoService.post(data, url).subscribe(
      res => {
        if (res.message === '200') {
          this.dialogRef.close(true);
        } else {
          this.toastrService.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        }
      }, error => {
        console.error(error);
        this.toastrService.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
      });
  }
  mostrar(filtro: string = '', campo: string): boolean {
    if (filtro.length > 0) {
      if (campo.toLowerCase().includes(filtro.toLowerCase())) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }

  cargarPermiso(item): void {
    this.array2.push(item);
    const index = this.permisos.findIndex(x => x.menu === item.menu);
    this.permisos.splice(index, 1);
  }

  borrar(value): void {
    this.permisos.push(value);
    const index = this.array2.findIndex(x => x.menu === value.menu);
    this.array2.splice(index, 1);
  }
  crearRol(rol): void {
    if (rol.trim() === '' ){
      this.guardar = true;
    }else{
    this.req = null;
    this.req = {
      name: rol,
      state: 'A',
      lstMenu: this.array2
    };
    const url = `/rol/guardarRol`;
    this.genericoService.post(this.req, url).subscribe(res => {
      if (res.message === '200') {
        console.log('guardarRol OK');
      }
    });
    setTimeout(() => {
      this.dialogRef.close();
    }, 1000);
  }
  }
  consultarPermisos(): void {
    this.permisos = [];
    const url = `/menu/consultarMenuPorEstado?estado=A`;
    this.genericoService.get(url).subscribe(res => {
      if (res.message === '200') {
        this.permisos = res.data.menu;
      }
    }, error => {
      console.error(error);
      this.toastrService.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
    });
  }
  onNoClick(rol): void {
    this.crearRol(rol);
  }
}
