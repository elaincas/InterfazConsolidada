import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReporteInicioComponent } from "./reporte-meta-oncologicos/components/reporte-inicio/reporte-inicio.component";
import { ReporteSucursalComponent } from "./reporte-meta-oncologicos/components/reporte-sucursal/reporte-sucursal.component";
import { RouterModule } from "@angular/router";
import { MetasRoutes } from "./metas.routing";
import {
  DxAutocompleteModule,
  DxButtonModule,
  DxChartModule,
  DxCheckBoxModule,
  DxColorBoxModule,
  DxDataGridModule,
  DxDateBoxModule,
  DxDropDownBoxModule,
  DxFileUploaderModule,
  DxFormModule,
  DxListModule,
  DxLoadPanelModule,
  DxLookupModule,
  DxNumberBoxModule,
  DxPopupModule,
  DxRadioGroupModule,
  DxScrollViewModule,
  DxSelectBoxModule,
  DxTabPanelModule,
  DxTabsModule,
  DxTemplateModule,
  DxTextAreaModule,
  DxTextBoxModule,
  DxTooltipModule,
  DxValidatorModule,
} from "devextreme-angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ReporteMetaOncologicosService } from "./reporte-meta-oncologicos/services/reporte-meta-oncologicos.service";
import { ReporteBusquedaComponent } from './reporte-meta-oncologicos/components/reporte-busqueda/reporte-busqueda.component';
import { ReporteZonaComponent } from './reporte-meta-oncologicos/components/reporte-zona/reporte-zona.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MetasRoutes),
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
    ReactiveFormsModule,
    DxDropDownBoxModule,
    DxScrollViewModule,
    DxTooltipModule,
    DxListModule,
    DxTemplateModule,
    DxRadioGroupModule,
  ],
  declarations: [ReporteInicioComponent, ReporteSucursalComponent, ReporteBusquedaComponent, ReporteZonaComponent],
  providers: [ReporteMetaOncologicosService],
})
export class MetasModule {}
