import { BloqueoDeProcesosComponent } from './usuarios/bloqueo-de-procesos/bloqueo-de-procesos.component';
import { ReporteVentaComponent } from './recompra/reporteVenta/reporteVenta.component';
import { Routes } from '@angular/router';
import { CanActivateValidarAccesoRuta, LoggedInGuard } from '../login/guards/logged-in.guard';
import { SubirBannerComponent } from "./Banners/Subir-Banners/components/subir-banners/subir.banners.component";
import { ListaBannersComponent } from "./Banners/Subir-Banners/components/lista-banners/lista.banners.component";
import { EditarBannerComponent } from "./Banners/Subir-Banners/components/editar-banner/editar.banner.component";
import { ListaServiciosDisponibles } from "./ServiciosDisponibles/components/lista-servicios/lista.servicios.component";
import { EcommerceDashboardComponent } from './ecommerce-dashboard/ecommerce-dashboard.component';
import { ListaProductosCarruselComponent } from "./productos-de-carrusel/lista-productos-carrusel/lista-productos-carrusel.component";
import { AgregarProductosCarruselComponent } from "./productos-de-carrusel/agregar-productos-carrusel/agregar-productos-carrusel.component";
import { UsuariosComponent } from './usuarios/usuarios/usuarios.component';
import { AgregarServicioComponent } from './serviciosProporcionados/agregar-servicio/agregar-servicio.component';
import { ListaServiciosComponent } from './serviciosProporcionados/lista-servicios/lista-servicios.component';
import { AdministrarCategoriasComponent } from './distribuidores-externos/administrar-categorias/administrar-categorias.component';
import { AdministrarProductosCategoriasComponent } from './distribuidores-externos/administrar-productos-categorias/administrar-productos-categorias.component';
import { ListadoNotificacionesComponent } from './notificaciones-push/listado-notificaciones/listado-notificaciones.component';
import { AdministrarSucursalesHabilitadasComponent } from './distribuidores-externos/administrar-sucursales-habilitadas/administrar-sucursales-habilitadas.component';
import { ListadoPedidosRecompraComponent } from './recompra/listado-pedidos/listado-pedidos-recompra.component';
import { ConfiguracionProductosRecompraComponent } from './recompra/configuracion-productos/configuracion-productos.component';
import { CorreccionNombreComponent } from '../maestros/colonias/components/correccion-nombre/correccion-nombre.component';
import { ReporteClientesSuscritosComponent } from './recompra/reporte-clientes-suscritos/reporte-clientes-suscritos.component';
import { ResumenVentasComponent } from './recompra/resumen-ventas/resumen-ventas.component';
import { AdministracionAtributosComponent } from './econo-mascotas/components/administracion-atributos/administracion-atributos.component';
import { ProductosArchivosAdminComponent } from './productos-archivosAdmin/components/productos-archivosAdmin.component';
import { MonitoreotransaccionesComponent } from './monitoreo-transacciones/components/monitoreo-transacciones/monitoreo-transacciones.component';
export const EcommerceRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        component: EcommerceDashboardComponent,
      },
      {
        path: 'usuarios',
        component: UsuariosComponent,
      },
      {
        path: 'usuarios/bloqueoDeProcesos',
        component: BloqueoDeProcesosComponent,
      },
      {
        path: 'banners/subirbanner',
        component: SubirBannerComponent,
      },
      {
        path: 'banners/editarBanner/:banner/:pagina',
        component: EditarBannerComponent,
      },
      {
        path: 'banners/lista-banners',
        component: ListaBannersComponent
      },
      {
        path: 'productosCarrusel/agregar',
        component: AgregarProductosCarruselComponent
      },
      {
        path: 'productosCarrusel/editar/:carruselId',
        component: AgregarProductosCarruselComponent
      },
      {
        path: 'productosCarrusel/listadoCarruseles',
        component: ListaProductosCarruselComponent
      },
      {
        path: 'servicios/agregar',
        component: AgregarServicioComponent
      },
      {
        path: 'servicios/listadoServicios',
        component: ListaServiciosComponent
      },
      {
        path: 'servicios/editar/:servicioId',
        component: AgregarServicioComponent
      },
      {
        path: 'servicios/agregarseccion/:servicioId',
        component: AgregarServicioComponent
      },
      {
        path: 'distribuidoresexternos/admincategorias',
        component: AdministrarCategoriasComponent
      }, {
        path: 'distribuidoresexternos/adminproductoscategorias',
        component: AdministrarProductosCategoriasComponent
      }
      , {
        path: 'distribuidoresexternos/adminsucursaleshabilitadas',
        component: AdministrarSucursalesHabilitadasComponent
      }, {
        path: 'distribuidoresexternos/listadoproductoscategorias',
        component: ListaServiciosComponent
      },
      {
        path: 'notificaciones/listado',
        component: ListadoNotificacionesComponent
      },
      {
        path: 'recompra/listado',
        component: ListadoPedidosRecompraComponent
      },
      {
        path: 'recompra/configuraciones',
        component: ConfiguracionProductosRecompraComponent
      },
      {
        path: 'recompra/reporteDeVentas',
        component: ReporteVentaComponent
      }, {
        path: 'recompra/reporteClientesSuscritos',
        component: ReporteClientesSuscritosComponent
      },
      {
        path: 'recompra/resumenDeVenta',
        component: ResumenVentasComponent
      },
      {
        path: 'economascotas/administracionatributos',
        component: AdministracionAtributosComponent
      },
      {
        path: 'servicios/listaServiciosDisponibles',
        component: ListaServiciosDisponibles
      },
      {
        path: 'archivos/admin',
        component: ProductosArchivosAdminComponent
      },      
      {
        path: 'monitoreo-limite-transacciones',
        component: MonitoreotransaccionesComponent
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      }
    ]
  }
];
