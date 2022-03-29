
import { Routes } from "@angular/router";
import { CanActivateValidarAccesoRuta } from "../../login/guards/logged-in.guard";
import { ProductoEntrenamientoComponent } from "./Componentes/Ingresar-Producto/ingresar-producto.component";
import { AsignacionProductoComponent } from "./Componentes/Asignar-Producto/asignar-producto.component";
import { ProductoDisponiblesComponent } from "./Componentes/Reportes/Productos-Disponibles/productos-disponibles.component";
import { ProductosTransaccinoesColaboradorComponent } from "./Componentes/Reportes/Productos-Transacciones-Colaboradores/productos-transacciones-colaboradores.component";
import { AsignarZonaComponent } from "./Componentes/Administrar-Zonas/asignar-zona.component";
import { TrasladosComponent } from "./Componentes/Traslados/traslados.component";
import { AceptarDenegarTrasladoComponent } from "./Componentes/Traslados/aceptar-denegar-traslado.component";
import { AuxiliarProductosComponent } from "./Componentes/Reportes/Productos-Auxiliar/producto-auxiliar.component";
import { ProductosMalEstadosPerdidosComponent } from "./Componentes/Reportes/Productos-MalEstadosPerdidos/productos-malestadoperdidos.component";

export const ProductoEntrenamientoRoute: Routes = [
    {
      path: '',
     canActivate:[CanActivateValidarAccesoRuta],
      children: [
        {
          path: 'ingresarproducto',
          component: ProductoEntrenamientoComponent
        },
        {
          path: 'asignacion',
          component: AsignacionProductoComponent
        },
        {
          path: 'reportes/disponibles',
          component: ProductoDisponiblesComponent
        },
        {
          path: 'reportes/transacciones',
          component: ProductosTransaccinoesColaboradorComponent
        },
        {
          path: 'asignarzona',
          component: AsignarZonaComponent
        },
        {
          path: 'trasladarproducto',
          component: TrasladosComponent
        },
        {
          path: 'aceptardenegartraslado',
          component: AceptarDenegarTrasladoComponent
        },
        {
          path: 'reportes/auxiliarproductos',
          component: AuxiliarProductosComponent
        },
        {
          path: 'reportes/malestadoperdidos',
          component: ProductosMalEstadosPerdidosComponent
        },
        {
          path: '',
          redirectTo: '/home',
          pathMatch: 'full',
        }
      ]
    }
  ];
  
  