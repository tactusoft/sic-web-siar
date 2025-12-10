import { Injectable } from '@angular/core';
import {GenericoService} from './generico.service';
import {Observable, of, ReplaySubject, Subject} from 'rxjs';
import {catchError, mergeMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BusquedaPalabraClaveService {
  resultados: any[] = [];
  resultadosSubject: Subject<any[]> = new Subject<any[]>();
  palabrasBuscadasSubject: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);

  constructor(private genericoService: GenericoService) { }

  buscarPorPalabraClave(palabra: string): Observable<any> {
    this.palabrasBuscadasSubject.next(palabra.split(' '));

    const url = `/textSearch/consultarPalabrasClave?palabraClave=${palabra}`;

    return this.genericoService.get(url).pipe(
      mergeMap((res) => {
        this.resultados = res;
        this.resultadosSubject.next(this.resultados);

        return of({success: true, result: res.length > 0}) ;
    }),
      catchError((e) => {
        return of({success: false, error: e});
      })
    );
  }
}
