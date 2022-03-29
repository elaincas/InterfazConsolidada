import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuard, CanActivateValidarAccesoRuta } from '../login/guards/logged-in.guard';
import { CorreccionNombreComponent } from './colonias/components/correccion-nombre/correccion-nombre.component';
import { ColoniasSadEditarComponent } from './colonias/components/colonias-sad-editar/colonias-sad-editar.component';
import { PoliticasComponent } from './politicas-vencimiento/components/politicas/politicas.component'
import { ListasDePreciosComponent } from './listas-de-precios/components/administracion/listas-de-precios.component';
import { AdministracionRecargasTelefonicasComponent } from './recargas-telefonicas/components/administracion-recargas-telefonicas/administracion-recargas-telefonicas.component';
import { ListaColoniasComponent } from './colonias/administracion/lista-colonias.component';
import { ConsultorioAdmin } from './consultorios/components/administrar-consultorio.component';
import { AdministracionSucursalesSellosComponent } from './sucursales-sellos/components/administracion-sucursales-sellos/administracion-sucursales-sellos.component';
import { AdministracionAgentesFirmasComponent } from './agentes-firmas/components/administracion-agentes-firmas/administracion-agentes-firmas.component';
import { AdministracionDistribuidoresComponent } from './distribuidores-compras-digitales/components/administracion-distribuidores/administracion-distribuidores.component';
import { VariablesDeConfiguracionComponent } from './variables-de-configuracion/components/variables-de-configuracion/variables-de-configuracion.component'

export const MaestrosRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'colonias/correccionNombres',
        component: CorreccionNombreComponent,
      },
      {
        path: 'colonias/administrar',
        component: ListaColoniasComponent,
      },
      {
        path: 'colonias/coloniasSADEditar',
        component: ColoniasSadEditarComponent,
      },
      {
        path: 'listas-precios/administracion',
        component: ListasDePreciosComponent
      },
      {
        path: 'variables-de-configuracion/administracion',
        component: VariablesDeConfiguracionComponent
      },
      {
        path: 'politicas-vencimiento/politicas',
        component: PoliticasComponent
      },
      {
        path: 'recargas-telefonicas/administracion',
        component: AdministracionRecargasTelefonicasComponent
      },
      {
        path: 'consultorios/administracion',
        component: ConsultorioAdmin
      },
      {
        path:'sucursales-sellos/administracion',
        component: AdministracionSucursalesSellosComponent
      },
      {
        path:'agentes-firmas/administracion',
        component: AdministracionAgentesFirmasComponent
      },
      {
        path:'distribuidores-compras-digitales/administracion',
        component: AdministracionDistribuidoresComponent
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      }
    ]
  }
];
