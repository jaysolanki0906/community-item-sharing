import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titleCase',
  standalone: true
})
@Injectable({ providedIn: 'root' }) 
export class TitleCasePipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/\w\S*/g, (txt) =>
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }
}
