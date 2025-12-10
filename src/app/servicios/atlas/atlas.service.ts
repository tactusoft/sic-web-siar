import {Injectable} from '@angular/core';
import {GenericoService} from '../generico.service';
import {Constants} from '../../common/constants';
import {Atlas} from '../../modelos/atlas';
import {Observable} from 'rxjs';
import {AtlasPlantilla} from '../../modelos/atlasPlantilla';
import {SubdomainDTO} from '../../clases/subdomainDTO';
import {PlantillaAtlasDTO} from '../../clases/plantillaAtlasDTO';

@Injectable({
  providedIn: 'root'
})
export class AtlasService {

  public NOMBRE_DOMINIO = 'Títulos preguntas atlas';
  public plantillas: AtlasPlantilla[];
  public respuestas: Atlas[];
  public subdominios: SubdomainDTO[];


  constructor(private genericoService: GenericoService) {
  }

  consultarSubdominios(idioma: number): Observable<any> {

    const url = `${Constants.PATH_LISTAR_DOMINIO_NOMBRE_LANG}?nombre=${this.NOMBRE_DOMINIO}&idioma=${idioma}`;
    console.log(url);
    return this.genericoService.get(url);

  }

  consultarSubdominiosLeng(idSubdominio: number): Observable<any> {

    const url = `${Constants.PATH_LISTAR_SUBDOMINIOS_LANG}?idSubdominio=${idSubdominio}`;
    console.log(url);
    return this.genericoService.get(url);

  }

  consultarPlantillas(estado: string): Observable<any> {

    let e = '';
    if (estado != null) {
      e = estado;
    }
    const url = `/atlas/listarPlantillas?estado=${e}`;
    return this.genericoService.get(url);

    /* subscribe(res => {

      if (res.message === '200' && res.data !== null) {
        console.log('plantillas');
        console.log(res.data.plantillas);
        return res.data.plantillas;
      }

    });

    return [];*/

  }

  consultarAtlasRespuestas(idPais: number): Observable<any> {

    let url = '/atlas/listarRespuestas?idPais=0';

    if (idPais) {
      url = `/atlas/listarRespuestas?idPais=${idPais}`;
    }

    return this.genericoService.get(url);

    /*subscribe(res => {

      if (res.message === '200' && res.data !== null) {
        console.log('respuestas');
        console.log(res.data.respuestas);
        // this.atlasPlantillas = res.data.respuestas;
      }

    });*/

  }

  guardarAtlasRespuestas(respuestas: Atlas[]): Observable<any> {

    const data = {
      respuestas
    };

    const url = `/atlas/guardarRespuestas`;
    return this.genericoService.post(data, url);

  }

  guardarPlantilla(plantilla: PlantillaAtlasDTO): Observable<any> {

    if (plantilla.id) {
      return this.genericoService.put(plantilla, Constants.PATH_EDITAR_PLANTILLA_ATLAS);
    }
    return this.genericoService.post(plantilla, Constants.PATH_CREAR_PLANTILLA_ATLAS);

  }

  eliminarPlantilla(idPlantilla: number): Observable<any> {

    return this.genericoService.delete(Constants.PATH_ELIMINAR_PLANTILLA_ATLAS + `?idPlantilla=${idPlantilla}`);

  }

}
