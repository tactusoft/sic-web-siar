import { EventEmitter, Injectable } from '@angular/core';
import { GenericoService } from './generico.service';
import { Constants } from '../common/constants';

@Injectable({
    providedIn: 'root'
})
export class PaisesService {
    listaPaises = new EventEmitter<boolean>();
    listadoPaises: any = [];

    constructor(private genericoService: GenericoService) { }

    obtenerPaises(idIdioma): any {
        const url = `${Constants.PATH_LISTAR_PAIS_LANG}?pais=0&lang=${idIdioma}`;
        this.genericoService.get(url).subscribe(res => {
            if (res.data && res.success && res.message === '200' && res.status === 'OK') {
                res.data.sort((f, s) => {
                    const a = f.nombre.toUpperCase().trim();
                    const b = s.nombre.toUpperCase().trim();
                    return a < b ? -1 : a > b ? 1 : 0;
                });
                this.listadoPaises = res.data;
                this.listaPaises.emit(true);
            }
        });

    }
}
