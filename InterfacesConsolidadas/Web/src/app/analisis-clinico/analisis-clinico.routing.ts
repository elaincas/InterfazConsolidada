import { Routes, RouterModule } from '@angular/router';
import { CanActivateValidarAccesoRuta } from "../login/guards/logged-in.guard";
import { ReporteExamenesCallCenterComponent } from './analisis/components/CallCenter/reporteexamenescallcenter.component';
import { AnalisisComponent } from './analisis/analisis.component';
import { AnalisisCategoriaComponent } from './analisis/components/analisis-categoria/analisis-categoria.component';
import { AnalisisFrmComponent } from './analisis/components/analisis-frm/analisis-frm.component';
import { InsumosComponent } from './analisis/components/insumos/insumos.component';
import { LaboratoriosComponent } from './analisis/components/laboratorios/laboratorios.component';
import { NivelResultadoComponent } from './analisis/components/nivel-resultado/nivel-resultado.component';
import { ParametrosGrupoComponent } from './analisis/components/parametros-grupo/parametros-grupo.component';
import { ParametrosFrmComponent } from './analisis/components/parametros/components/parametros-frm/parametros-frm.component';
import { ParametrosComponent } from './analisis/components/parametros/parametros.component';
import { RequisitosComponent } from './analisis/components/requisitos/requisitos.component';
import { ResultadoTipoComponent } from './analisis/components/resultado-tipo/resultado-tipo.component';
import { TiposMuestraComponent } from './analisis/components/tipos-muestra/tipos-muestra.component';
import { UnidadesDeMedidaComponent } from './analisis/components/unidades-de-medida/unidades-de-medida.component';

export const AnalisisClinicoRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'Analisis',
        component: AnalisisComponent,
      },
      {
        path: 'NuevoAnalisis',
        component: AnalisisFrmComponent
      },
      {
        path: 'Editar/:AnalisisId',
        component: AnalisisFrmComponent,
      },
      {
        path: 'Insumos',
        component: InsumosComponent,
      },
      {
        path: 'Laboratorios',
        component: LaboratoriosComponent,
      },
      {
        path: 'Requisitos',
        component: RequisitosComponent,
      },
      {
        path: 'UnidadesMedida',
        component: UnidadesDeMedidaComponent,
      },
      {
        path: 'TiposMuestras',
        component: TiposMuestraComponent,
      },
      {
        path: 'Parametros',
        component: ParametrosComponent,
      },
      {
        path: 'NuevoParametro',
        component: ParametrosFrmComponent,
      },
      {
        path: 'EditarParametro/:ParametroId',
        component: ParametrosFrmComponent,
      },
      {
        path: 'NivelesResultado',
        component: NivelResultadoComponent,
      },
      {
        path: 'AnalisisCategorias',
        component: AnalisisCategoriaComponent,
      },
      {
        path: 'ParametrosGrupos',
        component: ParametrosGrupoComponent,
      },
      {
        path: 'TiposResultado',
        component: ResultadoTipoComponent,
      },
      {
        path: 'Reporte/Facturas/Call-center',
        canActivate:[CanActivateValidarAccesoRuta],
        component: ReporteExamenesCallCenterComponent
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      }
    ]
  }
];
