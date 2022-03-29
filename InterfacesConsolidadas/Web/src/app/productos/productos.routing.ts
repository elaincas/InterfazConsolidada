import { IndividualesComponent } from './administracion-alternativos/components/individuales/individuales.component';
import { AlternativosComponent } from './administracion-alternativos/components/alternativos/alternativos.component';
import { Routes } from '@angular/router';
import { GruposProductosComponent } from './administracionGrupos/components/grupos-productos/grupos-productos.component';
import { LoggedInGuard, CanActivateValidarAccesoRuta } from '../login/guards/logged-in.guard';
import { CategoriaProductosFrmComponent } from './administracionGrupos/components/categoria-productos-frm/categoria-productos-frm.component';
import { ProductosTagsComponent } from './administracion-tags/productos-tags/productos-tags.component';
import {AgregarAtributosComponent} from "./administracion-atributos/agregar-atributos/agregar-atributos.component";
import {ListaAtributosComponent} from "./administracion-atributos/lista-atributos/lista-atributos.component";
import { BandeosComponent } from './enlazar-productos/bandeos/bandeos.component';
import { AdministracionProductosComponent } from './administracion-precios/component/administracion-productos/administracion-productos.component';
import { AdministracionProductosprecioglobalComponent } from './administracion-precios/component/administracion-productos-precio-global/administracion-productos-precio-global.component';
import { ProductosDescuentosExclusivosComponent } from './productos-descuentos-exclusivos/components/administrar/productos-descuentos-exclusivos/productos-descuentos-exclusivos.component';
import { AdministrarPedidoUIComponent } from './configuracion-pedidosUI/components/administrar-pedidoUI.component';
import { ReporteComparativoComponent } from './administracion-alternativos/components/reporte-comparativo/reporte-comparativo.component';
import { ProductosRestringidosComponent } from './productos-restringidos/components/administrar/productos-restringidos/productos-restringidos';
import { ProductoInformacionComponent } from './informacion-productos/components/producto-informacion/producto-informacion.component';
import { SeccionesComponent } from './informacion-productos/components/secciones/secciones.component';
import { SeccionProductosComponent } from './informacion-productos/components/seccion-productos/seccion-productos.component';
import { ReporteReporducionDeVideoComponent } from './productos-reporte-video/components/Reporte/productos-reproduciones/productos-reproduciones.component';
import { AgregarDescuentosAdicionalesComponent } from './administracion-descuentos-sucursal/components/agregar-descuentos-adicionales/agregar-descuentos-adicionales.component';
import { ConsultarDescuentosAdicionalesComponent } from './administracion-descuentos-sucursal/components/consultar-descuentos-adicionales/consultar-descuentos-adicionales.component';
import { PresentacionesComponent } from './administracion-presentaciones/components/presentaciones/presentaciones.component';


export const ProductosRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'categoria/crear',
        component: CategoriaProductosFrmComponent,
        canActivate: [CanActivateValidarAccesoRuta],
      },
      {
        path: 'categorias',
        component: GruposProductosComponent,
        canActivate: [CanActivateValidarAccesoRuta],
      },
      {
        path: 'categoria/:id',
        component: CategoriaProductosFrmComponent,
        canActivate: [CanActivateValidarAccesoRuta],
      },
      {
        path: 'tags/asignar',
        component: ProductosTagsComponent,
        canActivate: [CanActivateValidarAccesoRuta],
      },
      {
        path: 'caracteristica/agregar',
        component: AgregarAtributosComponent,
        canActivate: [CanActivateValidarAccesoRuta],
      },
      {
        path: 'caracteristica/listado',
        component: ListaAtributosComponent,
        canActivate: [CanActivateValidarAccesoRuta],
      },
      {
        path: 'bandeos',
        component: BandeosComponent,
        canActivate: [CanActivateValidarAccesoRuta],
      },
      {
        path: 'precios',
        component: AdministracionProductosComponent,
        canActivate: [CanActivateValidarAccesoRuta]
      },
      {
        path: 'preciosglobal',
        component: AdministracionProductosprecioglobalComponent,
        canActivate: [CanActivateValidarAccesoRuta]
      },
      {
        path: 'alternativos',
        component: AlternativosComponent,
        canActivate: [CanActivateValidarAccesoRuta]
      },
      {
        path: 'presentaciones',
        component: PresentacionesComponent,
        canActivate: [CanActivateValidarAccesoRuta]
      },
      {
        path: 'individuales',
        component: IndividualesComponent,
        canActivate: [CanActivateValidarAccesoRuta]
      },
      {
        path: 'reporte-comparativo',
        component: ReporteComparativoComponent,
        canActivate: [CanActivateValidarAccesoRuta]
      },
      {
        path: 'descuentos-adicionales/agregar',
        component: AgregarDescuentosAdicionalesComponent,
        canActivate: [CanActivateValidarAccesoRuta]
      },
      {
        path: 'descuentos-adicionales/consultar',
        component: ConsultarDescuentosAdicionalesComponent,
        canActivate: [CanActivateValidarAccesoRuta]
      },
      {
        path: 'descuentos-exclusivos',
        component: ProductosDescuentosExclusivosComponent,
        canActivate: [CanActivateValidarAccesoRuta]
      },
      {
        path: 'configuracion-pedidosUI',
        component: AdministrarPedidoUIComponent,
        canActivate: [CanActivateValidarAccesoRuta]
      },
      {
        path: 'restringidos',
        component: ProductosRestringidosComponent,
        canActivate: [CanActivateValidarAccesoRuta]
      },
      {
        path: 'informacion-productos',
        children:[
          {
            path: '',
            component: ProductoInformacionComponent
          },
          {
            path: 'secciones',
            component: SeccionesComponent
          },
          {
            path: 'seccion-productos',
            component: SeccionProductosComponent
          },
        ],
        canActivate: [CanActivateValidarAccesoRuta]
      },
      {
        path: 'videos/reporte',
        component: ReporteReporducionDeVideoComponent,
        canActivate: [CanActivateValidarAccesoRuta]
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      }
    ]
  }
];
