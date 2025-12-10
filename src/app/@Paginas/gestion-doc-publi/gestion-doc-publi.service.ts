import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GestionDocPubliService {
  recargarDocumentos: EventEmitter<boolean> = new EventEmitter();
  constructor() { }
}
