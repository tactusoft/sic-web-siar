import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  olvidoContrasena = new EventEmitter<boolean>();

  constructor() { }
}
