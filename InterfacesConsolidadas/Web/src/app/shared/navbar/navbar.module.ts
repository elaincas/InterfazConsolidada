import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import {
    DxCheckBoxModule,
    DxLookupModule,
    DxTabsModule, DxTextBoxModule,
    DxValidatorModule,
    DxDataGridModule,
    DxPopupModule,
    DxNumberBoxModule,
    DxDateBoxModule,
    DxFileUploaderModule,
    DxButtonModule,
    DxSelectBoxModule,
    DxTextAreaModule,
    DxAutocompleteModule,
    DxTabPanelModule,
    DxChartModule,
    DxListModule,
    DxFormModule,
    DxTagBoxModule,
    DxColorBoxModule, DxDropDownBoxModule, DxLoadPanelModule, DxScrollViewComponent, DxScrollViewModule, DxPieChartModule, DxRadioGroupModule, DxGalleryComponent, DxGalleryModule, DxTemplateModule,
  } from 'devextreme-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        DxLookupModule,
        DxTextBoxModule,
        DxTabsModule,
        DxValidatorModule,
        DxCheckBoxModule,
        DxDataGridModule,
        DxTemplateModule,
        DxPopupModule,
        DxLoadPanelModule,
        DxNumberBoxModule,
        DxDateBoxModule,
        DxButtonModule,
        DxFileUploaderModule,
        DxSelectBoxModule,
        DxTextAreaModule,
        DxAutocompleteModule,
        DxTabPanelModule,
        DxChartModule,
        DxColorBoxModule,
        FormsModule,
        DxTabPanelModule,
        RouterModule,
        ReactiveFormsModule,
        DxDropDownBoxModule,
        DxScrollViewModule,
        DxPieChartModule,
        DxRadioGroupModule,
        DxListModule,
        DxFormModule,
        DxTagBoxModule,
        DxGalleryModule,        
      ],
    declarations: [ NavbarComponent ],
    exports: [ NavbarComponent ]
})

export class NavbarModule {}
