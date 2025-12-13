import {Pipe, PipeTransform} from '@angular/core';
import {AtlasPlantilla} from '../../modelos/atlasPlantilla';

@Pipe({
  name: 'filtroPlantillaAtlas'
})
export class FiltroPlantillaAtlasPipe implements PipeTransform {

  transform(value: AtlasPlantilla[], arg: string): any {

    if (arg === '') {
      return value;
    }

    const result = value.filter(p => (p.codigo + ' ' + p.subdominio.description).toLowerCase().includes(arg.toLowerCase()));
    return result;

  }

}
