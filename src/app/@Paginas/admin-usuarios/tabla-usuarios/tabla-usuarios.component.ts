import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PaginationInstance } from 'ngx-pagination';
import { DialogInvitacionComponent } from '../dialog-invitacion/dialog-invitacion.component';
import { DialogNuevoUsuarioComponent } from '../dialog-nuevo-usuario/dialog-nuevo-usuario.component';
import { GenericoService } from '../../../servicios/generico.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Rol } from '../../../modelos/rol';
import { Usuario } from '../../../modelos/usuario';
import { ToastrService } from 'ngx-toastr';
import {LenguajeService} from '../../../servicios/lenguaje.service';
import { Constants } from '../../../common/constants';
import {Pais} from '../../../modelos/pais';

@Component({
  selector: 'app-tabla-usuarios',
  templateUrl: './tabla-usuarios.component.html',
  styleUrls: ['./tabla-usuarios.component.scss']
})
export class TablaUsuariosComponent implements OnInit {

  page = 0;
  nRegistros = 8;
  usuarios: Array<Usuario>;
  mostrarConfirmacion = false;
  correoUsuario: string;
  idPais = 0;
  idRol = 0;
  buscarNombre = '';
  public configPaginador: PaginationInstance = {
    id: 'custom',
    itemsPerPage: this.nRegistros,
    currentPage: this.page,
    totalItems: 0
  };
  buscarPais: FormControl;
  buscarRol: FormControl;
  paises: Array<number> = [];
  paisesList: Array<Pais> = [];
  roles: Array<Rol> = [];
  formFiltro: FormGroup;
  textos: any;
  idioma: number;
  iconoEditar = Constants.ICON_EDITAR;

  constructor(
    public dialog: MatDialog,
    private lenguajeService: LenguajeService,
    private genericoService: GenericoService,
    private toastrService: ToastrService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer) {
      iconRegistry.addSvgIcon('iconoEditar', sanitizer.bypassSecurityTrustResourceUrl(this.iconoEditar));
    }

  ngOnInit(): void {
    this.lenguajeService.idiomaSubject.subscribe(data => {
      this.idioma = this.lenguajeService.devolverIntIdioma(data);
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
        this.textos = texts;
        },
        () => {
          this.toastrService.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
    this.buscarPais = new FormControl('');
    this.buscarRol = new FormControl('');
    this.formFiltro = new FormGroup({
      idPais: new FormControl(0),
      idRol: new FormControl(0),
      buscarNombre: new FormControl(''),
    });
    this.consultarPais();
    this.consultarRoles();
    this.consultarUsuarios(this.page, this.nRegistros, this.idPais, this.idRol, this.buscarNombre);
    this.formFiltro.get('idPais').valueChanges.subscribe(data => {
      this.page = 0;
      this.idPais = data;
      this.consultarUsuarios(this.page, this.nRegistros, this.idPais, this.idRol, this.buscarNombre);
    });

    this.formFiltro.get('idRol').valueChanges.subscribe(data => {
      this.page = 0;
      this.idRol = data;
      this.consultarUsuarios(this.page, this.nRegistros, this.idPais, this.idRol, this.buscarNombre);
    });
  }
  onNameChange($event): void{
    if ($event.length > 4){
      this.buscarNombre = $event;
      this.consultarUsuarios(this.page, this.nRegistros, this.idPais, this.idRol , this.buscarNombre);
    }
    if ($event.length === 0){
      this.buscarNombre = '';
      this.consultarUsuarios(this.page, this.nRegistros, this.idPais, this.idRol);
    }
  }

  pageChanged($event): void{
    this.page = $event;
    this.configPaginador.currentPage = $event;
    this.consultarUsuarios(this.page - 1, this.nRegistros, this.idPais, this.idRol);
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
  consultarPais(): void{
    const url = `${Constants.PATH_LISTAR_PAIS_LANG}?pais=0&lang=${this.idioma}`;
    this.genericoService.get(url).subscribe(res => {
      this.paisesList = res.data;
    });
  }
  consultarRoles(): void{
    const url = `/rol/listarRoles`;
    this.genericoService.get(url).subscribe(res => {
      this.roles = res.data;
    });
  }
  openDialogCrear(): void {
    const dialogRef = this.dialog.open(DialogNuevoUsuarioComponent, {
      data: {
        paises: this.paisesList,
        roles: this.roles
      },
      width: '95%',
      maxWidth: '1132px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.toastrService.success(this.textos?.mensajes ? this.textos?.mensajes?.USUARIO_CREADO_MSJ : 'Usuario creado exitósamente');
        this.consultarUsuarios(this.page, this.nRegistros, this.idPais, this.idRol);
      }
    });
  }

  openDialogEditUser(valor): void {
    const dialogRef = this.dialog.open(DialogNuevoUsuarioComponent, {
      data: {
        usuario: valor,
        paises: this.paisesList,
        roles: this.roles
      },
      width: '80%',
      maxWidth: '1132px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.toastrService.success(this.textos?.mensajes ? this.textos?.mensajes?.USUARIO_MODIF_MSJ : 'Usuario actualizado exitósamente');
        this.consultarUsuarios(this.page, this.nRegistros, this.idPais, this.idRol);
      }
    });
  }

  openDialogInvitacion(usuario: Usuario): void {
    const dialogRef = this.dialog.open(DialogInvitacionComponent, {
      data: {
        usuario
      },
      width: '95%',
      maxWidth: '1132px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.estado){
        this.mostrarConfirmacion = true;
        this.correoUsuario = result.email;
        setTimeout(() => {
          this.mostrarConfirmacion = false;
        }, 6000);
        this.consultarUsuarios(this.page , this.nRegistros, this.idPais, this.idRol);
      }
    });
  }
  consultarUsuarios(page: number, size: number, idPais: number, idRol: number = 0, buscarNombre: string = ''): void{
    this.usuarios = [];
    const url = `/usuario/listarUsuarios?idPais=${idPais}&page=${page}&size=${size}&idRol=${idRol}&nombre=${buscarNombre}`;
    this.genericoService.get(url).subscribe( res => {
      if (res.message === '200'){
        this.usuarios = res.data.usuario;
        this.page = res.data.currentPage;
        this.configPaginador.totalItems = res.data.totalItems;
      } else if (res.message === '204') {
        this.toastrService.info(this.textos?.mensajes ? this.textos.mensajes.NO_DATA : Constants.MENSAJE_NO_DATA);
      } else {
        this.toastrService.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
      }
    }, error => {
      console.error(error);
      this.toastrService.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
    });
  }
  cambiarEstado(usuario: Usuario): void{
    let estado;
    if (usuario.state === 'A'){
      estado = 'I';
    } else {
      estado = 'A';
    }
    const data = {
        approved: usuario.approved,
        email: usuario.email,
        id: usuario.id,
        idIdioma: usuario.idioma ? usuario.idioma.id : null,
        idPais: usuario.pais.id,
        idRol: usuario. rol.id,
        invitation_status: usuario.invitation_status,
        invitation_sent: usuario.invitation_sent,
        last_name: usuario.last_name,
        name: usuario.name,
        password: usuario.password,
        state: estado
    };
    const url = `/usuario/guardarUsuario`;
    this.genericoService.post(data, url).subscribe(res => {
      if (res.message === '200'){
        this.consultarUsuarios(this.page, this.nRegistros, this.idPais, this.idRol);
      }
    });
  }
  getLabelBtn(status: string): string{
    if (status === 'E'){
      return this.textos?.admin_usuarios?.enviado ? this.textos?.admin_usuarios?.enviado : 'Enviado';
    } else if (status === 'R') {
      return this.textos?.admin_usuarios?.reenviar ? this.textos?.admin_usuarios?.reenviar : 'Re enviar';
    }
    return this.textos?.admin_usuarios?.enviar ? this.textos?.admin_usuarios?.enviar : 'Enviar';
  }
}
