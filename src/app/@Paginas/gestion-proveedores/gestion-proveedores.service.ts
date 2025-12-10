import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GestionProveedoresService {
  recargarDocumentos: EventEmitter<boolean> = new EventEmitter();
  constructor() { }
}
