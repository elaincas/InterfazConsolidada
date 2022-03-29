import { Routes } from "@angular/router";
import { IngresoReembolsoComponent } from "./IngresoReembolsos/components/ingresoreembolso.component";
import { ListadoReembolsoComponent } from "./ListaReembolsos/components/listadoreembolso.component";
import { ReporteCompensacionComponent } from "./ReporteCompensacion/reportecompesacion.component";
import { ReporteEstadosReembolsosComponent } from "./ReporteEstadosReembolsos/reportereembolsoestados.component";
import { CanActivateValidarAccesoRuta } from "../../login/guards/logged-in.guard";


export const IngresoRoutes: Routes = [
  {
    path: '',
    canActivate:[CanActivateValidarAccesoRuta],
    children: [
      {
        path: 'ingresotransporte',
        component: IngresoReembolsoComponent
      },
      {
        path: 'listadoreembolso',
        component: ListadoReembolsoComponent
      },
      {
        path: 'reportes/compensacion',
        component: ReporteCompensacionComponent
      },
      {
        path: 'reportes/estados',
        component: ReporteEstadosReembolsosComponent
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      }
    ]
  }
];
