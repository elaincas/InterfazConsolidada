import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { PlanimetriaRoute } from './planimetria.routing';

import {
    DxLookupModule,
    DxTextBoxModule,
    DxCheckBoxModule,
    DxDataGridModule,
    DxNumberBoxModule,
    DxDateBoxModule,
    DxPopupModule,
    DxButtonModule,
    DxFileUploaderModule,
    DxAutocompleteModule,
    DxSelectBoxModule,
    DxGalleryModule,
    DxTextAreaModule,
  } from "devextreme-angular";
import { IngresarPlanimetria } from './Componentes/Ingresar-Planimetria/ingresar-planimetria.component';
import { HttpAuthService } from '../../helpers/http/http-auth.service';
import { IngresarPlanimetriaService } from './Componentes/Ingresar-Planimetria/ingresar-planimetria.service';
import { IngresarVisualizarPlanimetria } from './Componentes/Retroalimentar_Visualizar-Planimetria-JT/retroalimentar_visualizar-planimetria.component';
import { VisualizarRetroalimentarPlanimetriaService } from './Componentes/Retroalimentar_Visualizar-Planimetria-JT/retroalimentar_visualizar-planimetria.service';
import { RptSucursalesRetroalimentacion } from './Componentes/Reportes/Sucursales-Retroalimentacion/rpt-sucursales-retroalimentacion.component';
import { RptSucursalesRetroalimentacionService } from './Componentes/Reportes/Sucursales-Retroalimentacion/rpt-sucursales-retroalimentacion.service';

  
@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      HttpModule,
      RouterModule.forChild(PlanimetriaRoute),
      DxLookupModule,
      DxDataGridModule,
      DxButtonModule,
      DxDateBoxModule,
      DxSelectBoxModule,
      DxNumberBoxModule,
      DxPopupModule,
      DxTextBoxModule,
      DxAutocompleteModule,
      DxLookupModule,
      DxDataGridModule,
      DxButtonModule,
      DxDateBoxModule,
      DxSelectBoxModule,
      DxNumberBoxModule,
      DxPopupModule,
      DxTextBoxModule,
      DxFileUploaderModule,
      DxAutocompleteModule,
      DxCheckBoxModule,
      DxTextAreaModule,
      DxGalleryModule
    ],
    providers: [HttpAuthService,IngresarPlanimetriaService,VisualizarRetroalimentarPlanimetriaService,RptSucursalesRetroalimentacionService],
    declarations: [IngresarPlanimetria,IngresarVisualizarPlanimetria,RptSucursalesRetroalimentacion]
  })

export class PlanimetriaModule { }
  