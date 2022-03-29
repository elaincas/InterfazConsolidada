import { Component } from "@angular/core";
import { DxValidatorComponent } from "devextreme-angular/ui/validator";
import { NestedOptionHost } from "devextreme-angular/core/nested-option";
import { DxTemplateHost } from "devextreme-angular/core/template-host";
import { WatcherHelper } from "devextreme-angular/core/watcher-helper";
import { IterableDifferHelper } from "devextreme-angular/core/iterable-differ-helper";

@Component({
  selector: "product-dx-validator",
  template: "",
  providers: [
    NestedOptionHost,
    DxTemplateHost,
    WatcherHelper,
    IterableDifferHelper
  ]
})
export class ProductValidationComponent extends DxValidatorComponent {}
