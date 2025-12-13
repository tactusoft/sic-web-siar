import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CursosTalleresService {

  recargarCursosYTalleres: EventEmitter<boolean> = new EventEmitter();

  constructor() { }
}
