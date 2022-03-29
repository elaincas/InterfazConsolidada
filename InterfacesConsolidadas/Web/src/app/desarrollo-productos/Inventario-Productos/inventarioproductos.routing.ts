import { Routes } from "@angular/router";
import { AgregarProductosComponent } from "./componentes/agregar-productos/agregar-productos.component"
import {IngresoProductosComponent} from "./Componentes/ingreso-productos/ingreso-productos.component"
import {InventarioSucursalComponent} from "./Componentes/inventario-sucursal/inventario-sucursal.component"
import {InventarioProductoUbicacionComponent} from "./Componentes/listado-productos-ingresados-inventario/listado-productos-ingresados-inventario.component"
import {PantallaIncioComponent} from "./Componentes/pantalla-incio/pantalla-incio.component"
import {RecepcionTrasladosComponent} from "./Componentes/recepcion-traslados/recepcion-traslado.component"
import {TrasladarProductosComponent} from "./componentes/trasladar-productos/trasladar-productos.component"
import { CanActivateValidarAccesoRuta } from "../../login/guards/logged-in.guard";
import { ReporteIngresoProductosComponent } from "./Componentes/reporte-ingreso-productos/reporte-ingreso-productos.component";
import { IngresoTrasladoSucursalComponent } from "./Componentes/ingreso-traslado-sucursal/ingreso-traslado-sucursal.component";


export const InventarioImpulsoRoute: Routes = [
  {
    path: '',
   canActivate:[CanActivateValidarAccesoRuta],
    children: [
      {
        path: 'crearproducto',
        component: AgregarProductosComponent
      },
      {
        path: 'ingresoproducto',
        component: IngresoProductosComponent
      },
      {
        path: 'listadoinventario',
        component: InventarioProductoUbicacionComponent
      },
      {
        path: 'inventariosucursal',
        component: InventarioSucursalComponent
      },
      {
        path: 'iniciodp',
        component: PantallaIncioComponent
      },
      {
        path: 'recepciontraslados',
        component: RecepcionTrasladosComponent
      },

      {
        path: 'trasladarproducto',
        component: TrasladarProductosComponent
      }, {
        path: 'reporteIngresoProductos',
        component: ReporteIngresoProductosComponent
      },
      {
        path: 'ingresotrasladosucursal',
        component: IngresoTrasladoSucursalComponent
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      }
    ]
  }
];

