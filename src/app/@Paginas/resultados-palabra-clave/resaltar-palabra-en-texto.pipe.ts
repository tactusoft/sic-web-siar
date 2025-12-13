import { Pipe, PipeTransform } from '@angular/core';
import {SafeHtml} from '@angular/platform-browser';

@Pipe({
  name: 'resaltarPalabraEnTexto'
})
export class ResaltarPalabraEnTextoPipe implements PipeTransform {

  transform(contentString: string = null, stringsToHighlight: string[] = []): SafeHtml {
    if (stringsToHighlight.length > 0 && contentString) {
      if (contentString.length > 300) {
        const index = contentString.indexOf(stringsToHighlight[0]);

        if (index > 280) {
          contentString = `...${contentString.slice(150)}`;
        }
      }

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
