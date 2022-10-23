import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class Shortenstring implements PipeTransform {

    transform(text: any, length: number = 40, suffix: string = '...'): string {
        if (text && text.length > length) {
          let truncated: string = text.substring(0, length).trim() + suffix;
          return truncated;
        }
        return text;
    }
}