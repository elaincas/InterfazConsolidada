
import { Routes } from "@angular/router";
import { CanActivateValidarAccesoRuta } from "../../login/guards/logged-in.guard";
import { IngresarPlanimetria } from "./Componentes/Ingresar-Planimetria/ingresar-planimetria.component";
import { IngresarVisualizarPlanimetria } from "./Componentes/Retroalimentar_Visualizar-Planimetria-JT/retroalimentar_visualizar-planimetria.component";
import { RptSucursalesRetroalimentacion } from "./Componentes/Reportes/Sucursales-Retroalimentacion/rpt-sucursales-retroalimentacion.component";

export const PlanimetriaRoute: Routes = [
    {
      path: '',
     canActivate:[CanActivateValidarAccesoRuta],
      children: [
        {
          path: 'ingresarplanimetria',
          component: IngresarPlanimetria
        },
        {
          path: 'retroalimentarplanimetria',
          component: IngresarVisualizarPlanimetria
        },
        {
          path: 'reportes/retroalimetancionsucursales',
          component: RptSucursalesRetroalimentacion
        },
        {
          path: '',
          redirectTo: '/home',
          pathMatch: 'full',
        }
      ]
    }
  ];
  
  