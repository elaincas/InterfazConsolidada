import { ListaConserjesComponent } from './Conserjes/Administrar-Conserjes/components/lista-conserjes/lista-conserjes.component';
import { EditarConserjeComponent } from './Conserjes/Administrar-Conserjes/components/editar-conserje/editar-conserje.component';
import { RegistrarConserjeComponent } from './Conserjes/Administrar-Conserjes/components/registrar-conserje/registrar-conserje.component';
import { Routes } from '@angular/router';
import { MapaConserjesComponent } from './Conserjes/mapa-conserjes/mapa-conserjes.component';
import { ReporteAdministracionPedidosComponent } from './administracion-pedidos/components/reporte-administracion-pedidos/reporte-administracion-pedidos.component';
import { DashboardComponent } from './Conserjes/dashboard/dashboard.component';

export const SadRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'conserjes/registrar',
        component: RegistrarConserjeComponent,
      },
      {
        path: 'conserjes/editar/:conserjeId',
        component: EditarConserjeComponent,
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'conserjes',
        component: ListaConserjesComponent,
      },
      {
        path: 'mapa-conserjes',
        component: MapaConserjesComponent,
      },
      {
        path: 'administracion-pedidos',
        component: ReporteAdministracionPedidosComponent,
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      }
    ]
  }
];
