import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CorreccionNombreComponent } from './colonias/components/correccion-nombre/correccion-nombre.component';
import { ColoniaService } from './colonias/services/coloniaService.service';
import { DxListModule, DxTooltipModule, DxTemplateModule, DxDateBoxModule, DxNumberBoxModule, DxLookupModule, DxTextBoxModule, DxTabsModule, DxValidatorModule, DxCheckBoxModule, DxDataGridModule, DxPopupModule, DxLoadPanelModule, DxButtonModule, DxFileUploaderModule, DxSelectBoxModule, DxTextAreaModule, DxAutocompleteModule, DxTabPanelModule, DxChartModule, DxColorBoxModule, DxDropDownBoxModule, DxScrollViewModule, DxFormModule, 
  DxRadioGroupModule,
 } from 'devextreme-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EcommerceRoutes } from '../ecommerce/ecommerce.routing';
import { MaestrosRoutes } from './maestros.routing';
import { ColoniasSadEditarComponent } from './colonias/components/colonias-sad-editar/colonias-sad-editar.component';
import { ColoniasSadAgregarComponent } from './colonias/components/colonias-sad-agregar/colonias-sad-agregar.component';
import { PoliticaVencimientoService } from './politicas-vencimiento/services/politica-vencimiento.service';
import { PoliticasComponent } from './politicas-vencimiento/components/politicas/politicas.component';
import { PoliticasModalComponent } from './politicas-vencimiento/components/politicas-modal/politicas-modal.component';
import { ListasDePreciosComponent } from './listas-de-precios/components/administracion/listas-de-precios.component';
import { ListasPreciosService } from './listas-de-precios/services/listas-precios.service';
import { ProductosModule } from '../productos/productos.module';
import { AdministracionRecargasTelefonicasComponent } from './recargas-telefonicas/components/administracion-recargas-telefonicas/administracion-recargas-telefonicas.component';
import { AdministracionRecargasService } from './recargas-telefonicas/services/administracionRecarga.service';
import { DisableControlDirective } from '../helpers/disablecontrol-directive';
import { ListaColoniasComponent } from './colonias/administracion/lista-colonias.component';
import { ConsultorioAdmin } from './consultorios/components/administrar-consultorio.component';
import { ConsultorioService } from './consultorios/services/administrar-consultorio.service';
import { StickersModule } from './stickers/stickers.module';
import { AdministracionSucursalesSellosComponent } from './sucursales-sellos/components/administracion-sucursales-sellos/administracion-sucursales-sellos.component';
import { SucursalesSellosPopupComponent } from './sucursales-sellos/components/sucursales-sellos-popup/sucursales-sellos-popup.component';
import { AdministracionAgentesFirmasComponent } from './agentes-firmas/components/administracion-agentes-firmas/administracion-agentes-firmas.component';
import { AgentesFirmasPopupComponent } from './agentes-firmas/components/agentes-firmas-popup/agentes-firmas-popup.component';
import { SucursalesSellosService } from './sucursales-sellos/services/sucursales-sellos.service';
import { AgentesFirmasService } from './agentes-firmas/services/agentes-firmas.service';
import { AdministracionDistribuidoresComponent } from './distribuidores-compras-digitales/components/administracion-distribuidores/administracion-distribuidores.component';
import { PopupDistribuidorComponent } from './distribuidores-compras-digitales/components/popup-distribuidor/popup-distribuidor.component';
import { DistribuidoresComprasDigitalesService } from './distribuidores-compras-digitales/services/distribuidores-compras-digitales.service';
import { VariablesDeConfiguracionService } from './variables-de-configuracion/services/variables-de-configuracion.service'
import { VariablesDeConfiguracionComponent } from './variables-de-configuracion/components/variables-de-configuracion/variables-de-configuracion.component'

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
    RouterModule.forChild(MaestrosRoutes),
    ReactiveFormsModule,
    DxDropDownBoxModule,
    DxScrollViewModule,
    ProductosModule,
    DxTooltipModule,
    DxListModule,
    DxTemplateModule,
    StickersModule,
    DxRadioGroupModule
  ],
  declarations: [DisableControlDirective, CorreccionNombreComponent, ColoniasSadEditarComponent,
    ColoniasSadAgregarComponent, PoliticasComponent, PoliticasModalComponent, ListasDePreciosComponent, AdministracionRecargasTelefonicasComponent,
    ListaColoniasComponent, ConsultorioAdmin, AdministracionSucursalesSellosComponent, SucursalesSellosPopupComponent, AdministracionAgentesFirmasComponent, 
    AgentesFirmasPopupComponent, AdministracionDistribuidoresComponent, PopupDistribuidorComponent, VariablesDeConfiguracionComponent],
  providers: [ColoniaService, PoliticaVencimientoService, ListasPreciosService, AdministracionRecargasService, ConsultorioService, SucursalesSellosService, AgentesFirmasService, DistribuidoresComprasDigitalesService,
    VariablesDeConfiguracionService]
})
export class MaestrosModule { }
