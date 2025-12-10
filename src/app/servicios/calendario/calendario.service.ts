import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {mergeMap} from 'rxjs/operators';
import {GenericoService} from '../generico.service';


@Injectable({
  providedIn: 'root'
})
export class CalendarioService {

  public url = '/evento';

  constructor(
    private http: HttpClient,
    private genericoService: GenericoService
  ) { }

  listarEventos(evento: number, page: number, pais: number, size: number, start: string, end: string): Observable<any> {
    return this.genericoService.endPointReplaySubject.pipe(mergeMap(() =>
      this.http.get(this.genericoService.endPoint + this.url + '/listarEvento?event='
        + evento
        + '&page=' + page
        + '&pais=' + pais
        + '&size=' + size
        + '&start=' + start
        + '&end=' + end)
    ));
  }


}
