import { Routes } from '@angular/router';
import {CuponesAdminComponent} from './cupones/cupones-admin/cupones-admin.component';
import {ListaCuponesComponent} from './cupones/lista-cupones/lista-cupones.component';
import { CuponDigitalAdminComponent } from './cupones-digitales/cupon-digital-admin/cupon-digital-admin.component';
import { EncuestasComponent } from './encuestas/components/administracion-pedidos/encuestas.component';
import { ReportesComponent as ReporteEncuestasComponent } from './encuestas/components/reportes-administracion-pedidos/reportes/reportes.component';
import { ReportePedidosNpsComponent } from './encuestas/components/reporte-pedidos-nps/reporte-pedidos-nps.component';

export const MercadeoRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'crearCupon',
        component: CuponesAdminComponent,
      },
      {
        path: 'editarCupon/:cuponId',
        component: CuponesAdminComponent,
      },
      {
        path: 'listadoCupones',
        component: ListaCuponesComponent,
      },
      {
          path: 'adminiCupones',
          component: CuponDigitalAdminComponent
      },
      {
        path: 'adminiEncuestaPedidos',
        component: EncuestasComponent
      },
      {
        path: 'reporteEncuestaPedidos',
        component: ReporteEncuestasComponent
      },
      {
        path: 'reporteNPSEncuestasPedidos',
        component: ReportePedidosNpsComponent
      },
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      }
    ]
  }
];
