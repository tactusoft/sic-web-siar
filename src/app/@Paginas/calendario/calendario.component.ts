import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { CabeceraService } from '../../servicios/cabecera.service';
import { LenguajeService } from '../../servicios/lenguaje.service';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss']
})
export class CalendarioComponent implements OnInit, AfterViewInit {

  calendarioInfo: any = null;

  constructor(
    private cabeceraService: CabeceraService,
    private lenguajeService: LenguajeService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.cabeceraService.closeMenu.emit(true);
    this.lenguajeService.idiomaSubject.subscribe(data => {
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
        this.calendarioInfo = texts;
      }, () => {
      });
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadTableauScript();
    }, 1000);
  }

  loadTableauScript(): void {
    const divElement = document.getElementById('viz1717677779625');
    const vizElement = divElement.getElementsByTagName('object')[0];

    if (divElement.offsetWidth > 800) {
      vizElement.style.width = '999px';
      vizElement.style.height = '1427px';
    } else if (divElement.offsetWidth > 500) {
      vizElement.style.width = '999px';
      vizElement.style.height = '1427px';
    } else {
      vizElement.style.width = '100%';
      vizElement.style.height = '3627px';
    }

    const scriptElement = this.renderer.createElement('script');
    scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
    this.renderer.appendChild(vizElement.parentNode, scriptElement);
  }

}
