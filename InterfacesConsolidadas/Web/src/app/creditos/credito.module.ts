import { NgModule } from '@angular/core';
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
  DxColorBoxModule, DxDropDownBoxModule,
} from 'devextreme-angular';
import {HttpAuthService} from '../helpers/http/http-auth.service';
import {CreditoRoutes} from './credito.routing';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AgregarComunicadoComponent } from './agregar-comunicado/agregar-comunicado.component';
import { EditarComunicadoComponent } from './editar-comunicado/editar-comunicado.component';
import { ComunicadoCreditoService } from './comunicado-credito.service';

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
    DxSelectBoxModule,
    DxTextAreaModule,
    DxAutocompleteModule,
    DxTabPanelModule,
    DxChartModule,
    DxColorBoxModule,
    FormsModule,
    RouterModule.forChild(CreditoRoutes),
    ReactiveFormsModule,
    DxDropDownBoxModule,
  ],
  declarations: [
    AgregarComunicadoComponent,
    EditarComunicadoComponent
  ],
  providers: [HttpAuthService,ComunicadoCreditoService],
})
export class CreditoCobroModule { }
