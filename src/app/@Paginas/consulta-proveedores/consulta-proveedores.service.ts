import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConsultaProveedoresService {
  recargarDocumentos: EventEmitter<boolean> = new EventEmitter();
  constructor() { }
}
