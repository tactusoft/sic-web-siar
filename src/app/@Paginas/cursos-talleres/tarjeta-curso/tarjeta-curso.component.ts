import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CursosTalleres } from '../../../modelos/cursos-talleres';
import { ModalGestionCursosComponent } from './modal-gestion-cursos-talleres/modal-cursos-talleres.component';
import { ToastrService } from 'ngx-toastr';
import {Constants} from '../../../common/constants';
import {CabeceraService} from '../../../servicios/cabecera.service';
import {LenguajeService} from '../../../servicios/lenguaje.service';
import {Usuario} from '../../../modelos/usuario';
import { PaisesService } from 'src/app/servicios/paises.service';

@Component({
  selector: 'app-tarjeta-curso',
  templateUrl: './tarjeta-curso.component.html',
  styleUrls: ['./tarjeta-curso.component.scss']
})
export class TarjetaCursoComponent implements OnInit {
  tCursoInfo: any = null;
  iconoEditar = Constants.ICON_EDITAR_NEW;
  iconoEliminar = Constants.ICON_ELIMINAR_NEW;
  iconocargueFile = Constants.ICON_CARGAR_FILE;
  paisCurso = '';
  tipoCursoTaller = '';

  @Input() isAdmin = false;

  @Input() idTipoSecion;

  @Input() curso: CursosTalleres;

  @Input() listaTipos: any;

  @Output()
  mostrarDetalle = new EventEmitter<CursosTalleres>();
  over   = false;

  hover = true;
  calificacion = 0;
  constructor( private router: Router,
               public dialog: MatDialog, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer,
               private cabeceraService: CabeceraService, private lenguajeService: LenguajeService,
               private paisesService: PaisesService,
               private toastr: ToastrService) {
    iconRegistry.addSvgIcon('iconoEditar', sanitizer.bypassSecurityTrustResourceUrl(this.iconoEditar));
    iconRegistry.addSvgIcon('iconoEliminar', sanitizer.bypassSecurityTrustResourceUrl(this.iconoEliminar));
    iconRegistry.addSvgIcon('iconocargueFile', sanitizer.bypassSecurityTrustResourceUrl(this.iconocargueFile));
  }

  ngOnInit(): void {
    this.cabeceraService.closeMenu.emit(true);

    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {

      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
          this.tCursoInfo = texts;
        },
        () => {
          this.toastr.error(this.tCursoInfo?.mensajes ? this.tCursoInfo.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });


    this.paisesService.listaPaises.subscribe(cambio => {
      if (cambio){
        this.getDescripcionesTarjeta();
      }
    });
    this.getDescripcionesTarjeta();
    this.getCalificacionPromedio();
  }

  getDescripcionesTarjeta(): void{
    this.paisCurso = this.getDescripcionPais();
    this.tipoCursoTaller = this.getDescripcionTipo();
  }

  getCalificacionPromedio(): void {
    this.calificacion = 0;
    let numcalificacion = 0;

    this.curso.comentarios.forEach(element => {
      if (element.qualification > 0) {
        numcalificacion++;
      }

      this.calificacion = this.calificacion + element.qualification;
    });

    if (numcalificacion > 0) {
      this.calificacion = Math.trunc(this.calificacion / numcalificacion);
    }
  }


  userIsAdmin(): boolean {
    const user: Usuario = JSON.parse(localStorage.getItem('usuario'));
    if (user === null ) {
      return false;
    }
    if ( user.rol.id === 1 || user.rol.id === 2 ) {
      return true;
    }
    else{
      return false;
    }

  }

  abrirDetalle(): void {
    if (!this.isAdmin){
      this.mostrarDetalle.emit(this.curso);
    }
  }


  openDialog(value): void {
    this.curso.multimedia = [];
    if (value === 1) {
      const dialogRef = this.dialog.open(ModalGestionCursosComponent, {
        width: '1112px',
        height: '80%',
        panelClass: 'my-dialog',
        data: { subdom: this.curso, cod: value }
      });

      dialogRef.afterClosed().subscribe(() => {
        this.router.navigate(['/cursosTalleres']);
      });
    } else {
      const dialogRef =  this.dialog.open(ModalGestionCursosComponent, {
        width: '1132.5px',
        height: '538.3px',
        panelClass: 'my-dialog',
        data: { subdom: this.curso, cod: value }
      });
      dialogRef.afterClosed().subscribe(() => {
        this.router.navigate(['/cursosTalleres']);
      });
    }

  }

  getDescripcionPais(): string {
    try {
      return this.paisesService.listadoPaises.find(item => item.id === this.curso.country.id).nombre.trim();
    } catch {
      return this.curso.country.nombre.trim();
    }
  }

  getDescripcionTipo(): string{
    try {
      return this.listaTipos.find(item => item.id === this.curso.type.id).description.trim();
    } catch {
      return this.curso.type.description.trim();
    }
  }


}
