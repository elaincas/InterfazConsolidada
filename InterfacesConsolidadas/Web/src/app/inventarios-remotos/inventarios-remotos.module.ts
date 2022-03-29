import { NgModule, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InventariosRemotosRoutes } from './inventarios-remotos.routing';
import {
  DxDateBoxModule, DxNumberBoxModule, DxLookupModule, DxTextBoxModule, DxTabsModule, DxValidatorModule, DxCheckBoxModule,
  DxDataGridModule, DxPopupModule, DxLoadPanelModule, DxButtonModule, DxFileUploaderModule, DxSelectBoxModule, DxTextAreaModule,
  DxAutocompleteModule, DxTabPanelModule, DxChartModule, DxColorBoxModule, DxDropDownBoxModule, DxScrollViewModule, DxFormModule,
  DxValidationSummaryModule,
  DxResponsiveBoxModule
}
  from 'devextreme-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InventariosRemotosService } from './inventarios-remotos.service';
import { TrasladoProductoInventarioRemotoComponent } from './inventarios/components/traslados-productos/traslados-productos.component';
import { AuxiliarProductoRemotoComponent } from './inventarios/components/auxiliar-productos/auxiliar-productos.component';
import { DevolverTrasladoRemotoComponent } from './inventarios/components/devolver-traslado/devolver-traslados.component';
@NgModule({
  imports: [
    CommonModule,
    DxLookupModule,
    DxTextBoxModule,
    DxTabsModule,
    DxValidatorModule,
    DxCheckBoxModule,
    DxDataGridModule,
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
    DxFormModule,
    FormsModule,
    DxTabPanelModule,
    RouterModule.forChild(InventariosRemotosRoutes),
    ReactiveFormsModule,
    DxDropDownBoxModule,
    DxScrollViewModule,
    DxResponsiveBoxModule,
    DxValidationSummaryModule,
  ],
  declarations: [
    TrasladoProductoInventarioRemotoComponent,
    AuxiliarProductoRemotoComponent,
    DevolverTrasladoRemotoComponent
    ],
  providers: [
    InventariosRemotosService
  ]
})
export class InventariosRemotosModule {
}