import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MapaService {

  public endPoint = 'https://nominatim.openstreetmap.org/search.php?';

  constructor(
    private http: HttpClient
  ) { }

  consultarLugar(tipo: string, lugar: string): Observable<any> {
    return this.http.get(this.endPoint + tipo + '=' + lugar + '&polygon_geojson=1&format=jsonv2');
  }


}
