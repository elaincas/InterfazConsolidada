import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './login/auth-layout.component';
import { LoggedInGuard } from './login/guards/logged-in.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CorreccionNombreComponent } from './maestros/colonias/components/correccion-nombre/correccion-nombre.component';
import { ColoniasSadEditarComponent } from './maestros/colonias/components/colonias-sad-editar/colonias-sad-editar.component';


export const AppRoutes: Routes = [

  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [LoggedInGuard],
    children: [
      {
        path: 'home',
        component: DashboardComponent
      },      
      {
        path: 'productos',
        loadChildren: './productos/productos.module#ProductosModule'
      },
      {
        path: 'AnalisisClinicos',
        loadChildren: './analisis-clinico/analisis-clinico.module#AnalisisClinicoModule'
      },
      {
        path: 'maestros',
        loadChildren: './maestros/maestros.module#MaestrosModule'
      },
      {
        path: 'ConfiguracionesFarmacia',
        loadChildren: './ConfiguracionesFarmacia/configuraciones-farmacia.module#ConfiguracionesFarmaciaModule'
      },
      {
        path: 'entrenamiento/reembolsos',
        loadChildren: './entrenamiento/reembolsos/reembolsos.module#ReembolsosModule'
      },
      {
        path: 'entrenamiento/productos',
        loadChildren: './entrenamiento/administracion-productos/producto-entrenamiento.module#ProductoEntrenamientoModule'
      },
      {
        path: 'ecommerce',
        loadChildren: './ecommerce/ecommerce.module#EcommerceModule'
      },
      /* {
        path: 'maestro/colonias/correccionNombres',
        component: CorreccionNombreComponent
      },
      {
        path: 'maestro/colonias/coloniasSADEditar',
        component: ColoniasSadEditarComponent
      }, */
      {
        path: 'desarrolloproductos/inventarioimpulso',
        loadChildren: './desarrollo-productos/Inventario-Productos/inventarioproductos.module#InventarioImpulsoModule'
      },
      {
       path: 'desarrolloproductos/planimetria',
       loadChildren: './desarrollo-productos/Planimetrias/planimetria.module#PlanimetriaModule'
      },
      {
        path: 'mercadeo/cupones',
        loadChildren: './mercadeo/mercadeo.module#MercadeoModule'
      },
      {
        path: 'mercadeo/encuestas',
        loadChildren: './mercadeo/mercadeo.module#MercadeoModule'
      },
      {
        path: 'creditos/comunicados',
        loadChildren: './creditos/credito.module#CreditoCobroModule'
      },
      {
        path: 'sad',
        loadChildren: './SAD/sad.module#SadModule'
      },
      {
        path: 'InventariosRemotos',
        loadChildren: './inventarios-remotos/inventarios-remotos.module#InventariosRemotosModule'
      },
      {
        path: 'metas',
        loadChildren: './metas/metas.module#MetasModule'
      },
      {
        path: '**',
        redirectTo: '/home',
        pathMatch: 'full',
      }
    ]
  },
  {
    path: 'login',
    component: AuthLayoutComponent,
    loadChildren: './login/login.module#LoginModule'
  }
];
