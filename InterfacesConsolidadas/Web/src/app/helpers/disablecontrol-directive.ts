import { Directive, ElementRef, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { DxDateBoxComponent } from 'devextreme-angular';

@Directive({
  selector: '[disableControl]'
})
export class DisableControlDirective {

  @Input('disableControl') set disableControl(condition: boolean) {
    const action = condition ? 'disable' : 'enable';
    // this.ngControl.nativeElement.control[action]();
    this.ngControl.control[action]();
    // this.ngControl.disabled = condition;
  }

  constructor(private ngControl: NgControl) {
  }

}