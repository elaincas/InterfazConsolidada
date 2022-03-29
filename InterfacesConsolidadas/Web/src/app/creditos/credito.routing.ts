import { Routes } from '@angular/router';
import {CanActivateValidarAccesoRuta, LoggedInGuard} from '../login/guards/logged-in.guard';
import {ListaProductosComponent} from "../desarrollo-productos/Inventario-Productos/Componentes/lista-productos/lista-productos.component";
import { AgregarComunicadoComponent } from './agregar-comunicado/agregar-comunicado.component';
import { EditarComunicadoComponent } from './editar-comunicado/editar-comunicado.component';

export const CreditoRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'agregarComunicado',
        component: AgregarComunicadoComponent,
      },
      {
        path: 'editarComunicado',
        component: EditarComunicadoComponent,
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      }
    ]
  }
];
