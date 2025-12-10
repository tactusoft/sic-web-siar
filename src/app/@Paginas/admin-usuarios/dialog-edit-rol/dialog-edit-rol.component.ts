import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Constants } from '../../../common/constants';
import { Pais } from '../../../modelos/pais';
import { Rol } from '../../../modelos/rol';
import { GenericoService } from '../../../servicios/generico.service';
import { ToastrService } from 'ngx-toastr';
import {LenguajeService} from '../../../servicios/lenguaje.service';

@Component({
  selector: 'app-dialog-edit-rol',
  templateUrl: './dialog-edit-rol.component.html',
  styleUrls: ['./dialog-edit-rol.component.scss']
})

export class DialogEditRolComponent implements OnInit {
  req: any;
  selectedEstado: string;
  formRegistro: FormGroup;
  guardar: boolean;
  paises: Array<Pais>;
  array: Array<any> = [];
  array2: Array<any> = [];
  estados: Array<string>;
  valEstado: string;
  roles: Array<Rol>;
  buscarPais: FormControl;
  buscarRol: FormControl;
  formFiltro: FormGroup;
  formFiltroRol: FormGroup;
  textos: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private genericoService: GenericoService,
    private lenguajeService: LenguajeService,
    private toastrService: ToastrService,
    public dialogRef: MatDialogRef<DialogEditRolComponent>) { }

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
    if (this.data.rol.state === 'A') {
      this.selectedEstado = 'Activo';
    } else {
      this.selectedEstado = 'Inactivo';
    }
    this.consultarPermisos();
    this.estados = ['Activo', 'Inactivo'];
    this.paises = this.data.paises,
    this.roles = this.data.roles,
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
    const index = this.array.findIndex(x => x.menu === item.menu);
    this.array.splice(index, 1);
  }

  borrar(value): void {
    this.array.push(value);
    const index = this.array2.findIndex(x => x.menu === value.menu);
    this.array2.splice(index, 1);
  }
  editarRol(val): void {
    if (val.trim() === '') {
      this.guardar = true;
    } else {
      this.req = null;
      if (this.selectedEstado === 'Activo') {
        this.selectedEstado = 'A';
      } else {
        this.selectedEstado = 'I';
      }
      this.req = {
        id: this.data.rol.id,
        name: val,
        state: this.selectedEstado,
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
    this.array = [];
    const url = `/menu/consultarMenuPorEstado?estado=A`;
    this.genericoService.get(url).subscribe(res => {
      if (res.message === '200') {
        this.array = res.data.menu;
        for (let i = this.data.rol.lstMenu.length - 1; i >= 0; i--) {
          this.cargarPermiso(this.data.rol.lstMenu[i]);
        }

      }
    }, error => {
      console.error(error);
      this.toastrService.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
    });
  }
  cargarEstado(est): void {
    this.valEstado = est;
  }
  onNoClick(rol): void {
    this.editarRol(rol);
  }
}
