import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {GenericoService} from './generico.service';
import {mergeMap} from 'rxjs/operators';
import {Constants} from '../common/constants';

@Injectable({
  providedIn: 'root'
})
export class LenguajeService {
  idiomaActual = this.verificarIdiomaPrevio();
  idiomaSubject = new BehaviorSubject(this.idiomaActual);
  translationTexts: any = null;

  constructor(private genericoService: GenericoService) { }

  cambiarIdioma(idioma: string): void{
    this.idiomaSubject.next(idioma);
  }

  getTranslationTexts(language): Observable<any> {
    if (this.idiomaActual === language) {
      if (this.translationTexts) {
        return of(this.translationTexts);
      }
      else {
        return this.getLanguageTexts(language);
      }
    }
    else {
      this.idiomaActual = language;
      this.translationTexts = null;
      return this.getLanguageTexts(language);
    }
  }

  getLanguageTexts(language): Observable<any> {
    return this.genericoService.get(`/traduccionTextos?idioma=${language}`).pipe(
      mergeMap(res => {
        if (res.data && res.success && res.message === '200' && res.status === 'OK') {
          this.translationTexts = JSON.parse(res.data);
          return of(this.translationTexts);
        }
        else {
          throw Error(Constants.MENSAJE_NO_DATA);
        }
      })
    );
  }

  devolverIntIdioma(idioma: string): number{
    let intIdioma: number;
    switch (idioma) {
      case 'en':
        intIdioma = 2;
        break;
      case 'es':
        intIdioma = 1;
        break;
      case 'pt':
        intIdioma = 4;
        break;
      case 'fr':
        intIdioma = 3;
        break;
      default:
        intIdioma = 1;
        break;
    }
    return intIdioma;
  }

  devolverStringIdioma(idioma: string): string {
    let stringIdioma: string;
    switch (idioma.trim()) {
      case 'Inglés':
        stringIdioma = 'en';
        break;
      case 'Francés':
        stringIdioma = 'fr';
        break;
      case 'Portugués':
        stringIdioma = 'pt';
        break;
      case 'Español':
      default:
        stringIdioma = 'es';
        break;
    }
    return stringIdioma;
  }

  devolverSubStringIdiomaPorId(idIdioma: number): string{
    let stringIdioma: string;
    switch (idIdioma.toString()) {
      case '2':
        stringIdioma = 'en';
        break;
      case '3':
        stringIdioma = 'fr';
        break;
      case '4':
        stringIdioma = 'pt';
        break;
      case '1':
      default:
        stringIdioma = 'es';
        break;
    }
    return stringIdioma;
  }

  verificarIdiomaPrevio(): string{
    try{
      return this.devolverSubStringIdiomaPorId(Number(localStorage.getItem('idioma')));
    } catch {
      return 'es';
    }
  }
}
