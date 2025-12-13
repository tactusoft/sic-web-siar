import { Component, Input,  OnInit } from '@angular/core';
import { CursosTalleres } from '../../../modelos/cursos-talleres';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { GenericoService } from '../../../servicios/generico.service';
import { ToastrService } from 'ngx-toastr';
import {CabeceraService} from '../../../servicios/cabecera.service';
import {LenguajeService} from '../../../servicios/lenguaje.service';
import {Constants} from '../../../common/constants';
import {Recurso} from '../../../modelos/recurso';

@Component({
  selector: 'app-detalle-curso',
  templateUrl: './detalle-curso.component.html',
  styleUrls: ['./detalle-curso.component.scss']
})
export class DetalleCursoComponent implements OnInit {

  dCursoInfo: any = null;
  @Input()
  curso: CursosTalleres;

  showComentarios = false;
  // tslint:disable-next-line:no-inferrable-types
  calificacion: number = 0;
  estrellaHover = 0;
  formComentario: FormGroup;
  calificar = false;
  comentar = false;
  numcalificacion = 0;

  constructor(private genericoService: GenericoService, public fb: FormBuilder,
              private cabeceraService: CabeceraService,
              private lenguajeService: LenguajeService,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.cabeceraService.closeMenu.emit(true);

    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {

      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
          this.dCursoInfo = texts;
        },
        () => {
          this.toastr.error(this.dCursoInfo?.mensajes ? this.dCursoInfo.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
    this.getCalificacionPromedio();
    this.crearFormulario();
  }


  obtenerNombreEnlace(url: string): string {

    return url.split('/').pop();

  }
  crearFormulario(): void {

    this.formComentario = new FormGroup({
      id: new FormControl(null),
      idCursoTaller: new FormControl(this.curso.id),
      comment: new FormControl('', [Validators.required, Validators.maxLength(250), Validators.minLength(1), this.noWhitespaceValidator]),
      qualification: new FormControl(0),
      date: new FormControl(new Date())
    });

  }

  public noWhitespaceValidator(control: FormControl): any {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  guardarComentario(): void {
    this.formComentario.get('qualification').setValue(this.estrellaHover);
    this.genericoService.post(this.formComentario.value, '/comentario').subscribe(
      res => {
        if (res.message === '200') {
          this.curso.comentarios.push(res.data.comentario);
          this.comentar = false;
          this.calificar = false;
          this.estrellaHover = 0;
          this.formComentario.get('comment').setValue('');
          this.getCalificacionPromedio();
        }
      }
    );
  }

  getEnlaces(recurso: Array<Recurso>): Array<Recurso> {
    return recurso.filter(r => r.resourceTypeId.description === 'Enlaces');
  }

  getDocumentos(recurso: Array<Recurso>): Array<Recurso> {
    return recurso.filter(r => r.resourceTypeId.description === 'Documentos');
  }

  getFotos(recurso: Array<Recurso>): Array<Recurso> {
    return recurso.filter(r => r.resourceTypeId.description === 'Imagenes');
  }

  getVideos(recurso: Array<Recurso>): Array<Recurso> {
    return recurso.filter(r => r.resourceTypeId.description === 'Videos');
  }

  getCalificacionPromedio(): void {
    this.calificacion = 0;
    this.numcalificacion = 0;

    this.curso.comentarios.forEach(element => {
      if (element.qualification > 0) {
        this.numcalificacion++;
      }

      this.calificacion = this.calificacion + element.qualification;
    });

    if (this.numcalificacion > 0) {
      this.calificacion = Math.trunc(this.calificacion / this.numcalificacion);
    }
  }

  redirect(event): void{
    window.open(event, '_blank');

  }
}
