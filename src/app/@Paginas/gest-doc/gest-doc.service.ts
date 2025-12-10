import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GestDocService {

  constructor(private http: HttpClient) { }

descargarArchivo( url): Observable<any>{
return this.http.get(url, {responseType: 'arraybuffer'});
}
}

