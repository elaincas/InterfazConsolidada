import { NgModule, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnalisisClinicoRoutes } from './analisis-clinico.routing';
import {
  DxDateBoxModule, DxNumberBoxModule, DxLookupModule, DxTextBoxModule, DxTabsModule, DxValidatorModule, DxCheckBoxModule,
  DxDataGridModule, DxPopupModule, DxLoadPanelModule, DxButtonModule, DxFileUploaderModule, DxSelectBoxModule, DxTextAreaModule,
  DxAutocompleteModule, DxTabPanelModule, DxChartModule, DxColorBoxModule, DxDropDownBoxModule, DxScrollViewModule, DxFormModule,
  DxValidationSummaryModule
}
  from 'devextreme-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnalisisClinicoService } from './analisis-clinico.service';
import { AnalisisComponent } from './analisis/analisis.component';
import { AnalisisFrmComponent } from './analisis/components/analisis-frm/analisis-frm.component';
import { TabService } from './analisis/services/tabs';
import { AnalisisParametrosFrmComponent } from './analisis/components/analisis-frm/components/analisis-parametros-frm/analisis-parametros-frm.component';
import { RequisitosFrmComponent } from './analisis/components/analisis-frm/components/analisis-requisitos-frm/requisitos-frm.component';
import { DxResponsiveBoxModule } from 'devextreme-angular';
import { AnalisisInsumosFrmComponent } from './analisis/components/analisis-frm/components/analisis-insumos-frm/analisis-insumos-frm.component';
import { AnalisisLaboratoriosFrmComponent } from './analisis/components/analisis-frm/components/analisis-laboratorios-frm/analisis-laboratorios-frm.component';
import { InsumosComponent } from './analisis/components/insumos/insumos.component';
import { InsumosFrmModalComponent } from './analisis/components/insumos/modals/insumos-frm-modal/insumos-frm-modal.component';
import { InsumosService } from './analisis/services/insumosService';
import { LaboratoriosComponent } from './analisis/components/laboratorios/laboratorios.component';
import { LaboratoriosFrmModalComponent } from './analisis/components/laboratorios/modals/laboratorios-frm-modal/laboratorios-frm-modal.component';
import { LaboratoriosService } from './analisis/services/laboratoriosService';
import { RequisitosComponent } from './analisis/components/requisitos/requisitos.component';
import { RequisitosFrmModalComponent } from './analisis/components/requisitos/modals/requisitos-frm-modal/requisitos-frm-modal.component';
import { RequisitosService } from './analisis/services/requisitosService';
import { UnidadesDeMedidaComponent } from './analisis/components/unidades-de-medida/unidades-de-medida.component';
import { UnidadesDeMedidaFrmModalComponent } from './analisis/components/unidades-de-medida/modals/unidades-de-medida-frm-modal/unidades-de-medida-frm-modal.component';
import { UnidadesDeMedidasService } from './analisis/services/unidadDeMedidaService';
import { MuestraTiposService } from './analisis/services/tiposDeMuestraService';
import { TiposMuestraComponent } from './analisis/components/tipos-muestra/tipos-muestra.component';
import { TiposMuestraFrmModalComponent } from './analisis/components/tipos-muestra/modals/tipos-muestra-frm-modal/tipos-muestra-frm-modal.component';
import { ParametrosComponent } from './analisis/components/parametros/parametros.component';
import { ParametrosService } from './analisis/services/parametrosService';
import { ParametrosFrmComponent } from './analisis/components/parametros/components/parametros-frm/parametros-frm.component';
import { NivelResultadoService } from './analisis/services/nivelResultadoService';
import { ResultadoTipoService } from './analisis/services/tiposDeResultadoService';
import { ParametrosRangosComponent } from './analisis/components/parametros/components/parametros-frm/components/parametros-rangos/parametros-rangos.component';
import { ParametrosGrupoService } from './analisis/services/parametrosGrupoService';
import { NivelResultadoComponent } from './analisis/components/nivel-resultado/nivel-resultado.component';
import { NivelResultadoFrmModalComponent } from './analisis/components/nivel-resultado/modals/nivel-resultado-frm-modal/nivel-resultado-frm-modal.component';
import { ResultadoTipoComponent } from './analisis/components/resultado-tipo/resultado-tipo.component';
import { ResultadoTipoFrmModalComponent } from './analisis/components/resultado-tipo/modals/resultado-tipo-frm-modal/resultado-tipo-frm-modal.component';
import { ParametrosGrupoComponent } from './analisis/components/parametros-grupo/parametros-grupo.component';
import { ParametrosGrupoFrmModalComponent } from './analisis/components/parametros-grupo/modals/parametros-grupo-frm-modal/parametros-grupo-frm-modal.component';
import { AnalisisCategoriasService } from './analisis/services/analisisCategoriaService';
import { AnalisisCategoriaComponent } from './analisis/components/analisis-categoria/analisis-categoria.component';
import { AnalisisCategoriaFrmModalComponent } from './analisis/components/analisis-categoria/modals/analisis-categoria-frm-modal/analisis-categoria-frm-modal.component';
import {ReporteExamenesCallCenterComponent} from './analisis/components/CallCenter/reporteexamenescallcenter.component'
import { ReporteFacturaProductoService } from './analisis/services/ReporteFacturaProductoService';
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
    RouterModule.forChild(AnalisisClinicoRoutes),
    ReactiveFormsModule,
    DxDropDownBoxModule,
    DxScrollViewModule,
    DxResponsiveBoxModule,
    DxValidationSummaryModule
  ],
  declarations: [
    AnalisisComponent,
    AnalisisFrmComponent,
    AnalisisParametrosFrmComponent,
    RequisitosFrmComponent,
    AnalisisInsumosFrmComponent,
    AnalisisLaboratoriosFrmComponent,
    InsumosComponent,
    InsumosFrmModalComponent,
    LaboratoriosComponent,
    LaboratoriosFrmModalComponent,
    RequisitosComponent,
    RequisitosFrmModalComponent,
    UnidadesDeMedidaComponent,
    UnidadesDeMedidaFrmModalComponent,
    TiposMuestraComponent,
    TiposMuestraFrmModalComponent,
    ParametrosComponent,
    ParametrosFrmComponent,
    AnalisisParametrosFrmComponent,
    ParametrosRangosComponent,
    NivelResultadoComponent,
    NivelResultadoFrmModalComponent,
    ResultadoTipoComponent,
    ResultadoTipoFrmModalComponent,
    ParametrosGrupoComponent,
    ParametrosGrupoFrmModalComponent,
    AnalisisCategoriaComponent,
    AnalisisCategoriaFrmModalComponent,
    ReporteExamenesCallCenterComponent],
  providers: [
    AnalisisClinicoService,
    TabService,
    InsumosService,
    LaboratoriosService,
    RequisitosService,
    UnidadesDeMedidasService,
    MuestraTiposService,
    ParametrosService,
    NivelResultadoService,
    ResultadoTipoService,
    ParametrosGrupoService,
    AnalisisCategoriasService,
    ReporteFacturaProductoService
  ]
})
export class AnalisisClinicoModule {
}
