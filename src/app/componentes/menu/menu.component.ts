import { Component, OnInit } from '@angular/core';
import { LenguajeService } from '../../servicios/lenguaje.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(
    private lenguajeServiceService: LenguajeService
  ) {}

  ngOnInit(): void {
  }

  cambiarIdioma(idioma: string): void{
    this.lenguajeServiceService.cambiarIdioma(idioma);
  }

}
