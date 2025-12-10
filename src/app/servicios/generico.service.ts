import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, ReplaySubject} from 'rxjs';
import {environment} from '../../environments/environment';
import {mergeMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GenericoService {

  endPointReplaySubject = new ReplaySubject(1);
  endPoint: string;

  constructor(private http: HttpClient) {
    let configURL;

    // Ambientes qa y prod
    if (environment.config_file === 'test') {
      configURL = './assets/config/config.json';
    }
    // Ambiente de desarrollo
    else if (environment.config_file === 'prod') {
      configURL = `./assets/config/config.dev.json`;
    }
    // Ambiente local
    else {
      configURL = `assets/config/config.${environment.config_file}.json`;
    }

    this.http.get(configURL).subscribe((config: any) => {
      this.endPoint = config.base_url;
      this.endPointReplaySubject.next(true);
    });
  }

  get(url: string): Observable<any> {
    return this.endPointReplaySubject.pipe(mergeMap(() => this.http.get(this.endPoint + url)));
  }

  post(data: any, url: string): Observable<any> {
    return this.endPointReplaySubject.pipe(mergeMap(() => this.http.post(`${this.endPoint}${url}`, data)));
  }

  put(data: any, url: string): Observable<any> {
    return this.endPointReplaySubject.pipe(mergeMap(() => this.http.put(`${this.endPoint}${url}`, data)));
  }

  delete(url: string): Observable<any> {
    return this.endPointReplaySubject.pipe(mergeMap(() => this.http.delete(`${this.endPoint}${url}`)));
  }
}
