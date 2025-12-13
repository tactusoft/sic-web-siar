import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  bannerSubject = new BehaviorSubject(true);
  constructor() { }

  mostrarBanner(mostrar: boolean): void{
    this.bannerSubject.next(mostrar);
  }
}
