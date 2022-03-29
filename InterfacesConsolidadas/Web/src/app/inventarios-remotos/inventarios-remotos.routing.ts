import { Routes, RouterModule } from '@angular/router';
import { AnalisisComponent } from '../analisis-clinico/analisis/analisis.component';
import { CanActivateValidarAccesoRuta } from "../login/guards/logged-in.guard";
import { AuxiliarProductoRemotoComponent } from './inventarios/components/auxiliar-productos/auxiliar-productos.component';
import { DevolverTrasladoRemotoComponent } from './inventarios/components/devolver-traslado/devolver-traslados.component';
import { TrasladoProductoInventarioRemotoComponent } from './inventarios/components/traslados-productos/traslados-productos.component';

export const InventariosRemotosRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'Traslados',
         component: TrasladoProductoInventarioRemotoComponent,
      },
      {
        path: 'Auxiliar',
         component: AuxiliarProductoRemotoComponent,
      },
      {
        path: 'devolver-traslado',
         component: DevolverTrasladoRemotoComponent,
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      }
    ]
  }
];
