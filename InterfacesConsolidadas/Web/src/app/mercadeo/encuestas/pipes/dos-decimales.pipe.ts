import {Pipe, PipeTransform} from '@angular/core';
@Pipe ({
   name : 'fixed'
})
export class TruncarADosDecimales implements PipeTransform {
   transform(val : number) : number {
      return parseFloat(val.toFixed(2));
   }
}
