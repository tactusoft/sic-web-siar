import { Component, Input, OnInit } from '@angular/core';
import { Comentario } from '../../../../modelos/comentario';

@Component({
  selector: 'app-comentario',
  templateUrl: './comentario.component.html',
  styleUrls: ['./comentario.component.scss']
})
export class ComentarioComponent implements OnInit {

  @Input()
  comentario: Comentario;

  constructor() { }

  ngOnInit(): void {
  }

}
