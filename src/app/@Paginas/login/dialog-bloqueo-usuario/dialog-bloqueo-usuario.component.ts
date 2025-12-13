import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import {Constants} from '../../../common/constants';
import {LoginService} from '../../../servicios/login.service';
import {LenguajeService} from '../../../servicios/lenguaje.service';
import {CabeceraService} from '../../../servicios/cabecera.service';


@Component({
  selector: 'app-dialog-bloqueo-usuario',
  templateUrl: './dialog-bloqueo-usuario.component.html',
  styleUrls: ['./dialog-bloqueo-usuario.component.scss']
})
export class DialogBloqueoUsuarioComponent implements OnInit {

  // Constantes
  iconoContrasena = Constants.ICON_CONTRASENA;
  // Variables
  bloqueoInfo: any = null;
  segundos = 0;


  constructor(
              private loginService: LoginService,
              private lenguajeService: LenguajeService,
              private cabeceraService: CabeceraService,
              private toastr: ToastrService,
              public dialogRef: MatDialogRef<DialogBloqueoUsuarioComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.segundos = data.segundos;
  }

  ngOnInit(): void {
    this.cabeceraService.closeMenu.emit(true);
    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
          this.bloqueoInfo = texts;
        },
        () => {
          this.toastr.error(this.bloqueoInfo?.mensajes ? this.bloqueoInfo?.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
  }

  eventosContador(event): void{
    if (event.action === 'done'){
      this.dialogRef.close();
      window.location.reload();
    }
  }

  recuperarClave(): void{
    console.log('RecuperaPass');
    this.loginService.olvidoContrasena.emit(true);
    this.dialogRef.close();
  }
}
