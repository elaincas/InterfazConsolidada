import { ReactiveFormsModule } from '@angular/forms';
import { MercadeoService } from './services/mercadeo.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MomentModule} from 'angular2-moment'
import { HttpClientModule } from '@angular/common/http';
import {
  DxCheckBoxModule,
  DxDataGridModule,
  DxLookupModule,
  DxNumberBoxModule,
  DxPopupModule,
  DxTabsModule,
  DxTextBoxModule,
  DxValidatorModule,
  DxDateBoxModule,
  DxFileUploaderModule,
  DxTooltipModule,
  DxDropDownBoxModule,
  DxListModule,
  DxSwitchModule,
  DxButtonModule,
  DxSelectBoxModule,
  DxTextAreaModule,
  DxTabPanelModule,
  DxAutocompleteModule,
  DxFormModule,
  DxRadioGroupModule,
  DxSliderModule
} from 'devextreme-angular';
import { RouterModule } from '@angular/router';
import { MercadeoRoutes } from './mercadeo.routing';
import { CuponesAdminComponent } from './cupones/cupones-admin/cupones-admin.component';
import { ListaCuponesComponent } from './cupones/lista-cupones/lista-cupones.component';
import { CuponDigitalAdminComponent } from './cupones-digitales/cupon-digital-admin/cupon-digital-admin.component';
import { ProductosModule } from '../productos/productos.module';
import { EncuestasComponent } from './encuestas/components/administracion-pedidos/encuestas.component';
import { EncuestasService } from './encuestas/services/encuestas.service';
import { ReportesComponent as ReportesEncuestasPedidosComponent } from './encuestas/components/reportes-administracion-pedidos/reportes/reportes.component';
import { ReportePedidosNpsComponent } from './encuestas/components/reporte-pedidos-nps/reporte-pedidos-nps.component';
import { TruncarADosDecimales } from "./encuestas/pipes/dos-decimales.pipe";

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
    DxNumberBoxModule,
    DxDateBoxModule,
    DxButtonModule,
    DxFileUploaderModule,
    HttpClientModule,
    DxSelectBoxModule,
    DxTooltipModule,
    DxDropDownBoxModule,
    DxTextAreaModule,
    DxAutocompleteModule,
    DxTabPanelModule,
    DxFormModule,
    DxListModule,
    DxRadioGroupModule,
    DxSwitchModule,
    ProductosModule,
    RouterModule.forChild(MercadeoRoutes),
    ReactiveFormsModule,
    MomentModule,
    DxSliderModule
  ],
  declarations: [
    CuponesAdminComponent,
    ListaCuponesComponent,
    CuponDigitalAdminComponent,
    EncuestasComponent,
    ReportesEncuestasPedidosComponent,
    ReportePedidosNpsComponent,
    TruncarADosDecimales
  ],
  providers: [MercadeoService, EncuestasService],
})
export class MercadeoModule {}
