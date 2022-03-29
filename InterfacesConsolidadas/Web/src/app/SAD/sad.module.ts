import { LoginService } from './../login/services/login.service';
import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  DxColorBoxModule, DxDropDownBoxModule, DxLoadPanelModule, DxScrollViewComponent, DxScrollViewModule, DxPieChartModule, DxRadioGroupModule, DxGalleryComponent, DxGalleryModule, DxTemplateModule, DxProgressBarModule,
  DxTreeViewModule,
  DxToolbarModule,
  DxMapModule,
  DxLoadIndicatorModule,
} from 'devextreme-angular';
import { HttpAuthService } from '../helpers/http/http-auth.service';
import { SadRoutes } from './sad.routing';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrarConserjeComponent } from './Conserjes/Administrar-Conserjes/components/registrar-conserje/registrar-conserje.component';
import { ListaConserjesComponent } from './Conserjes/Administrar-Conserjes/components/lista-conserjes/lista-conserjes.component';
import { EditarConserjeComponent } from './Conserjes/Administrar-Conserjes/components/editar-conserje/editar-conserje.component';
import { AdministrarConserjesService } from './Conserjes/Administrar-Conserjes/services/administrar.conserjes.service';
import { ReporteAdministracionPedidosComponent } from './administracion-pedidos/components/reporte-administracion-pedidos/reporte-administracion-pedidos.component';
import { MapaConserjesComponent } from './Conserjes/mapa-conserjes/mapa-conserjes.component';
import { DashboardComponent } from './Conserjes/dashboard/dashboard.component';
import { DashboardService } from './Conserjes/dashboard/services/dashboard.service';
import { MapaPedidosComponent } from './Conserjes/dashboard/components/mapa-pedidos/mapa-pedidos.component';
import { ConserjesActivosComponent } from './Conserjes/dashboard/components/conserjes-activos/conserjes-activos.component'

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
    RouterModule.forChild(SadRoutes),
    ReactiveFormsModule,
    DxDropDownBoxModule,
    DxScrollViewModule,
    DxPieChartModule,
    DxRadioGroupModule,
    DxListModule,
    DxFormModule,
    DxTagBoxModule,
    DxGalleryModule,
    DxProgressBarModule,
    DxTreeViewModule,
    DxToolbarModule,
    DxMapModule,
    DxLoadIndicatorModule,
  ],
  declarations: [
    RegistrarConserjeComponent,
    ListaConserjesComponent,
    EditarConserjeComponent,
    ReporteAdministracionPedidosComponent,
    MapaConserjesComponent,
    DashboardComponent,
    MapaPedidosComponent,
    ConserjesActivosComponent,
  ],
  providers: [HttpAuthService, LoginService, AdministrarConserjesService, DashboardService, { provide: LOCALE_ID, useValue: 'es'}],
})
export class SadModule { }
