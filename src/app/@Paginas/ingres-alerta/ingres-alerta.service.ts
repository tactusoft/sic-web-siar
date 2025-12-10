import { Injectable, EventEmitter} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IngresAlertaService {
  recargarLista: EventEmitter<boolean> = new EventEmitter();
  constructor() { }
}
