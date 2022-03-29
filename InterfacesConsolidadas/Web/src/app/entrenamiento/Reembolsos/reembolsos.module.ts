import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IngresoReembolsoService } from './services/ingresosreembolsos/ingresoReembolsoService.service';
import { IngresoReembolsoComponent } from './IngresoReembolsos/components/ingresoreembolso.component'
import { ListadoReembolsoService } from './services/listadoreembolsos/listadoReembolsoService.service';
import {ListadoReembolsoComponent} from './ListaReembolsos/components/listadoreembolso.component'
import{ReporteCompensacionComponent} from './ReporteCompensacion/reportecompesacion.component'
import {MaestrosServices} from './services/maestros/maestrosServices.service'
import{CompensancionReembolsoService} from './services/compensacionreembolsos/compensacionreeembolso.service'


import { IngresoRoutes } from './reembolsos.routing'

import {
  DxLookupModule,
  DxTextBoxModule,
  DxTabsModule,
  DxValidatorModule,
  DxCheckBoxModule,
  DxDataGridModule,
  DxNumberBoxModule,
  DxDateBoxModule,
  DxPopupModule,
  DxButtonModule,
  DxFileUploaderModule,
  DxAutocompleteModule,
  DxTextAreaModule,
  DxSelectBoxModule
} from "devextreme-angular";

import { HttpAuthService } from '../../helpers/http/http-auth.service';
import { FormsModule } from '@angular/forms';
import { ReporteEstadosReembolsosComponent } from './ReporteEstadosReembolsos/reportereembolsoestados.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(IngresoRoutes),
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
    FormsModule
  ],
  providers: [IngresoReembolsoService, HttpAuthService,MaestrosServices,ListadoReembolsoService,CompensancionReembolsoService],
  declarations: [/*MainLoaderComponent,*/ IngresoReembolsoComponent,ListadoReembolsoComponent,ReporteCompensacionComponent,ReporteEstadosReembolsosComponent]
})
export class ReembolsosModule { }
