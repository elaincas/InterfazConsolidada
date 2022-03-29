import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SubirImagenesFacturaImpresaComponent} from "./ImagenesFacturaImpresa/subir-imagenes-factura-impresa/subir-imagenes-factura-impresa.component";
import {RouterModule} from "@angular/router";

import {ConfiguracionRoutes} from "./configuraciones-farmacia.routing";
import { FormsModule } from '@angular/forms';
import {
  DxTextBoxModule, DxValidatorModule, DxCheckBoxModule, DxDataGridModule, DxPopupModule, DxDateBoxModule,
  DxButtonModule, DxSelectBoxModule, DxTextAreaModule, DxFileUploaderModule, DxAutocompleteModule, DxLookupModule,
  DxNumberBoxModule, DxTabsModule, DxValidationSummaryModule
} from 'devextreme-angular';
import { HttpAuthService } from '../helpers/http/http-auth.service';
import { HttpModule } from '@angular/http';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DescuentosComponent } from './Descuentos/descuentos.component';
import { DescuentoAdicionalPorDiaComponent } from './Descuentos/DescuentoAdicionalPorDia/Components/descuento-adicional-dia/descuento-adicional-dia.component';
import { DescuentoAdicionalService } from './Descuentos/DescuentoAdicionalPorDia/Services/descuento-adicional-dia.service';
import { ListadoDescuentoAdicionalPorDiaComponent } from './Descuentos/DescuentoAdicionalPorDia/Components/descuento-adicional-dia-listado/descuento-adicional-dia-listado.component';

@NgModule({
  imports: [
    CommonModule,
    DxLookupModule,
    DxTextBoxModule,
    DxTabsModule,
    DxValidatorModule,
    DxValidationSummaryModule,
    DxCheckBoxModule,
    DxDataGridModule,
    DxPopupModule,
    DxNumberBoxModule,
    DxDateBoxModule,
    DxButtonModule,
    DxFileUploaderModule,
    DxSelectBoxModule,
    DxTextAreaModule,
    DxAutocompleteModule,
    FormsModule,
    RouterModule.forChild(ConfiguracionRoutes),
  ],
  providers:[ DescuentoAdicionalService ],
  declarations: [
    SubirImagenesFacturaImpresaComponent,
    DescuentosComponent,
    DescuentoAdicionalPorDiaComponent,
    ListadoDescuentoAdicionalPorDiaComponent,
  ]
})
export class ConfiguracionesFarmaciaModule { }
