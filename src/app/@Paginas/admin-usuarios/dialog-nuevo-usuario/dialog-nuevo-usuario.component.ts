import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Constants } from '../../../common/constants';
import { Pais } from '../../../modelos/pais';
import { Rol } from '../../../modelos/rol';
import { Usuario } from 'src/app/modelos/usuario';
import { GenericoService } from '../../../servicios/generico.service';
import {LenguajeService} from '../../../servicios/lenguaje.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-nuevo-usuario',
  templateUrl: './dialog-nuevo-usuario.component.html',
  styleUrls: ['./dialog-nuevo-usuario.component.scss']
})
export class DialogNuevoUsuarioComponent implements OnInit {
  formRegistro: FormGroup;
  paises: Array<Pais>;
  roles: Array<Rol>;
  buscarPais: FormControl;
  buscarRol: FormControl;
  formFiltro: FormGroup;
  formFiltroRol: FormGroup;
  errorUsuarioRegistrado: boolean;
  submit = false;
  textos: any;
  usuario: Usuario;
  editar = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private genericoService: GenericoService,
    private lenguajeService: LenguajeService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogNuevoUsuarioComponent>
  ) { }

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
    this.paises = this.data.paises;
    this.roles = this.data.roles;
    this.builderForm();
  }

  builderForm(): void {
    this.usuario =  this.data.usuario;
    if (!this.usuario) {
      this.formRegistro = this.formBuilder.group({
        approved: new FormControl(false),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern(Constants.PATTERN_EMAIL)
        ]),
        id: new FormControl(),
        idIdioma: new FormControl(),
        idPais: new FormControl('', Validators.required),
        idRol: new FormControl('', Validators.required),
        invitation_status: new FormControl(''),
        invitatiton_sent: new FormControl(new Date()),
        last_name: ['', [Validators.required, Validators.minLength(2)]],
        name: ['', [Validators.required, Validators.minLength(2)]],
        password: new FormControl(''),
        state: new FormControl('N')
      });
    }else{
      this.editar = true;
      this.paises = this.data.paises;
      this.roles = this.data.roles;
      this.formRegistro = this.formBuilder.group({
        email: new FormControl( {value: this.usuario.email, disabled: true}, [
          Validators.required,
          Validators.pattern(Constants.PATTERN_EMAIL)
        ]),
        id: new FormControl(this.usuario.id),
        idIdioma: new FormControl(this.usuario.idioma.id),
        idPais: new FormControl(this.usuario.pais.id, Validators.required),
        idRol: new FormControl(this.usuario.rol.id, Validators.required),
        last_name: [this.usuario.last_name, [Validators.required, Validators.minLength(2)]],
        name: [this.usuario.name, [Validators.required, Validators.minLength(2)]]
      });
    }
  }


  get email(): any {
    return this.formRegistro.get('email');
  }
  get name(): any {
    return this.formRegistro.get('name');
  }
  get lastName(): any {
    return this.formRegistro.get('last_name');
  }
  get pais(): any {
    return this.formRegistro.get('idPais');
  }
  get rol(): any {
    return this.formRegistro.get('idRol');
  }

  guardarUsuario(data: any): void {
    this.submit = true;
    if (this.formRegistro.valid) {

      if (this.editar) {
        const body = {
          id: this.usuario.id,
          name: data.name,
          last_name: data.last_name,
          email: this.usuario.email,
          idPais: data.idPais,
          idRol: data.idRol,
          state: this.usuario.state,
          idIdioma: this.usuario.idioma.id,
          approved: this.usuario.approved,
          invitation_status: this.usuario.invitation_status
        };

        this.genericoService.post(body, '/usuario/actualizarUsuarioData').subscribe(
          res => {
            if (res.message === '200') {
              this.dialogRef.close(true);
            }
          });
      } else {
        const url = `/usuario/guardarUsuario`;
        this.genericoService.post(data, url).subscribe(
          res => {
            if (res.message === '200') {
              this.dialogRef.close(true);
            } else if (res.message === 'El email ya se encuentra registrado') {
              this.email.touched = false;
              this.errorUsuarioRegistrado = true;
              this.toastrService.warning(res.message);
            }
            else {
              this.toastrService.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
            }
          },
          error => {
            console.error(error);
            this.toastrService.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
          }
        );
      }
    }
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
}
