import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GestionBoletinService {
  recargarBoletines: EventEmitter<boolean> = new EventEmitter();
  constructor() { }
}
