import { Pipe, PipeTransform } from '@angular/core';
import {SafeHtml} from '@angular/platform-browser';

@Pipe({
  name: 'resaltarPalabraEnTitulo'
})
export class ResaltarPalabraEnTituloPipe implements PipeTransform {

  transform(contentString: string = null, stringsToHighlight: string[] = []): SafeHtml {
    if (stringsToHighlight.length > 0 && contentString) {
      for (const stringToHighlight of stringsToHighlight) {
        const regex = new RegExp(stringToHighlight, 'i');
        contentString = contentString.replace(
          regex,
          (match) => `<b>${match}</b>`
        );
      }
    }

    return contentString;
  }

}
