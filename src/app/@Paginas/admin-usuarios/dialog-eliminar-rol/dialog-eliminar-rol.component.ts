import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Constants } from '../../../common/constants';
import { Pais } from '../../../modelos/pais';
import { GenericoService } from '../../../servicios/generico.service';
import { ToastrService } from 'ngx-toastr';
import {LenguajeService} from '../../../servicios/lenguaje.service';

@Component({
  selector: 'app-dialog-eliminar-rol',
  templateUrl: './dialog-eliminar-rol.component.html',
  styleUrls: ['./dialog-eliminar-rol.component.scss']
})

export class DialogEliminarRolComponent implements OnInit {

  formRegistro: FormGroup;
  paises: Array<Pais>;
  roles: any;
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
    public dialogRef: MatDialogRef<DialogEliminarRolComponent>) { }

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
    this.paises = this.data.paises;
    this.roles = this.data.valor.name;
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

guardarUsuario(data: any): void{
  const url = `/usuario/guardarUsuario`;
  this.genericoService.post(data, url).subscribe(
    res => {
      if (res.message === '200'){
        this.dialogRef.close(true);
      } else {
        this.toastrService.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
      }
    }, error => {
      console.error(error);
      this.toastrService.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
    });
}
mostrar(filtro: string = '', campo: string): boolean{
  if (filtro.length > 0){
    if (campo.toLowerCase().includes(filtro.toLowerCase())){
      return true;
    }else{
      return false;
    }
  }
  return true;
}
eliminarRol(): void{
  const url = `/rol/eliminarRol?rol=` + this.data.valor.id;
  this.genericoService.get(url).subscribe((res) => {
    if (res.message === '200') {
      console.log('eliminar OK');
    }
  });
}
onNoClick(): void {
  this.eliminarRol();
  setTimeout(() => {
    this.dialogRef.close();
  }, 1000);

}

}
