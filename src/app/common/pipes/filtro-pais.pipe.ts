import {Pipe, PipeTransform} from '@angular/core';
import {Pais} from '../../modelos/pais';

@Pipe({
  name: 'filtroPais'
})
export class FiltroPaisPipe implements PipeTransform {

  transform(value: Pais[], arg: string): any {

    if (arg === '') {
      return value;
    }

    const result = value.filter(p => p.nombre.toLowerCase().includes(arg.toLowerCase()));
    return result;
  }

}
