import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CabeceraService {
  closeMenu = new EventEmitter<boolean>();
  userLogged = new EventEmitter<boolean>();

  constructor() { }
}
