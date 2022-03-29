import { Routes } from '@angular/router';
import { ReporteInicioComponent } from './reporte-meta-oncologicos/components/reporte-inicio/reporte-inicio.component';

export const MetasRoutes: Routes = [
    {
      path: '',
      children: [
        {
          path: 'reportes/metas-oncologicos',
          component: ReporteInicioComponent,
        },
        {
          path: '',
          redirectTo: 'home',
          pathMatch: 'full',
        }
      ]
    }
  ];