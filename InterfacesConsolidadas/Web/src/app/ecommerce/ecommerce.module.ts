import { LoginService } from './../login/services/login.service';
import { ResumenVentasComponent } from './recompra/resumen-ventas/resumen-ventas.component';
import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DxCheckBoxModule,
  DxLookupModule,
  DxTabsModule, DxTextBoxModule,
  DxValidatorModule,
  DxDataGridModule,
  DxPopupModule,
  DxNumberBoxModule,
  DxDateBoxModule,
  DxFileUploaderModule,
  DxButtonModule,
  DxSelectBoxModule,
  DxTextAreaModule,
  DxAutocompleteModule,
  DxTabPanelModule,
  DxChartModule,
  DxListModule,
  DxFormModule,
  DxTagBoxModule,
  DxColorBoxModule, DxDropDownBoxModule, DxLoadPanelModule, DxScrollViewComponent, DxScrollViewModule, DxPieChartModule, DxRadioGroupModule, DxGalleryComponent, DxGalleryModule, DxTemplateModule, DxProgressBarModule,
} from 'devextreme-angular';
import { HttpAuthService } from '../helpers/http/http-auth.service';
import { EcommerceRoutes } from './ecommerce.routing';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SubirBannerComponent } from './Banners/Subir-Banners/components/subir-banners/subir.banners.component';
import { ListaBannersComponent } from './Banners/Subir-Banners/components/lista-banners/lista.banners.component';
import { EditarBannerComponent } from './Banners/Subir-Banners/components/editar-banner/editar.banner.component';
import { ListaServiciosDisponibles } from './ServiciosDisponibles/components/lista-servicios/lista.servicios.component';
import { EcommerceDashboardComponent } from './ecommerce-dashboard/ecommerce-dashboard.component';
import { GraficaVentasPorAppComponent } from './reportes/grafica-ventas-por-app/grafica-ventas-por-app.component';
import { GraficaVentasPorMesAppLinealComponent } from './reportes/grafica-ventas-por-mes-app-lineal/grafica-ventas-por-mes-app-lineal.component';
import { EcommerceDashboardService } from './reportes/services/ecommerce-dashboard.service';
import { AgregarProductosCarruselComponent } from './productos-de-carrusel/agregar-productos-carrusel/agregar-productos-carrusel.component';
import { ListaProductosCarruselComponent } from './productos-de-carrusel/lista-productos-carrusel/lista-productos-carrusel.component';
import { UsuarioFormModalComponent } from './usuarios/usuario-form-modal/usuario-form-modal.component';
import { UsuariosComponent } from './usuarios/usuarios/usuarios.component';
import { UsuariosService } from './usuarios/usuarios.service';
import { ReactiveFormsModule } from '@angular/forms';
import { AgregarServicioComponent } from './serviciosProporcionados/agregar-servicio/agregar-servicio.component';
import { ListaServiciosComponent } from './serviciosProporcionados/lista-servicios/lista-servicios.component';
import { ListadoNotificacionesComponent } from './notificaciones-push/listado-notificaciones/listado-notificaciones.component';
import { AdministrarCategoriasComponent } from './distribuidores-externos/administrar-categorias/administrar-categorias.component';
import { AdministrarProductosCategoriasComponent } from './distribuidores-externos/administrar-productos-categorias/administrar-productos-categorias.component';
import { DistribuidoresExternosService } from './distribuidores-externos/distribuidores-externos.service';
import { AdministrarSucursalesHabilitadasComponent } from './distribuidores-externos/administrar-sucursales-habilitadas/administrar-sucursales-habilitadas.component';
import { ConfiguracionProductosRecompraComponent } from './recompra/configuracion-productos/configuracion-productos.component';
import { ListadoPedidosRecompraComponent } from './recompra/listado-pedidos/listado-pedidos-recompra.component';
import { CorreccionNombreComponent } from '../maestros/colonias/components/correccion-nombre/correccion-nombre.component';
import { ColoniaService } from '../maestros/colonias/services/coloniaService.service';
import { ReporteVentaComponent } from './recompra/reporteVenta/reporteVenta.component';
import { PedidosRecompraService } from './recompra/_services/pedidos-recompra.service';
import { ReporteClientesSuscritosComponent } from './recompra/reporte-clientes-suscritos/reporte-clientes-suscritos.component';
import { PedidoDetalleComponent } from './recompra/listado-pedidos/pedido-detalle/pedido-detalle.component';
import { AgregarProductoComponent } from './recompra/listado-pedidos/agregar-producto/agregar-producto.component';
import { BloqueoDeProcesosComponent } from './usuarios/bloqueo-de-procesos/bloqueo-de-procesos.component';
import { ProductosArchivosAdminComponent } from './productos-archivosAdmin/components/productos-archivosAdmin.component';
import { ProductoArchivoService } from './productos-archivosAdmin/productos-archivosAdmin.service';
import { AdministracionAtributosComponent } from './econo-mascotas/components/administracion-atributos/administracion-atributos.component';
import { DetailGridComponent } from './econo-mascotas/components/detail-grid/detail-grid.component';
import { AceptarDenegarTrasladoService } from '../entrenamiento/administracion-productos/Componentes/Traslados/aceptar-denegar-traslado.service';
import { EconoMascotasService } from './econo-mascotas/econo-mascotas.service';
import { MonitoreotransaccionesComponent, NumberPipe } from './monitoreo-transacciones/components/monitoreo-transacciones/monitoreo-transacciones.component';
import { MonitoreotransaccionesService } from './monitoreo-transacciones/services/monitoreotransacciones.service';
@NgModule({
  imports: [
    CommonModule,
    DxLookupModule,
    DxTextBoxModule,
    DxTabsModule,
    DxValidatorModule,
    DxCheckBoxModule,
    DxDataGridModule,
    DxTemplateModule,
    DxPopupModule,
    DxLoadPanelModule,
    DxNumberBoxModule,
    DxDateBoxModule,
    DxButtonModule,
    DxFileUploaderModule,
    DxSelectBoxModule,
    DxTextAreaModule,
    DxAutocompleteModule,
    DxTabPanelModule,
    DxChartModule,
    DxColorBoxModule,
    FormsModule,
    DxTabPanelModule,
    RouterModule.forChild(EcommerceRoutes),
    ReactiveFormsModule,
    DxDropDownBoxModule,
    DxScrollViewModule,
    DxPieChartModule,
    DxRadioGroupModule,
    DxListModule,
    DxFormModule,
    DxTagBoxModule,
    DxGalleryModule,
    DxProgressBarModule,

  ],
  declarations: [
    SubirBannerComponent,
    ListaBannersComponent,
    EditarBannerComponent,
    ListaServiciosDisponibles,
    GraficaVentasPorAppComponent,
    GraficaVentasPorMesAppLinealComponent,
    EcommerceDashboardComponent,
    AgregarProductosCarruselComponent,
    ListaProductosCarruselComponent,
    UsuarioFormModalComponent,
    UsuariosComponent,
    AgregarServicioComponent,
    ListaServiciosComponent,
    ListadoNotificacionesComponent,
    ListaServiciosComponent,
    AdministrarCategoriasComponent,
    AdministrarProductosCategoriasComponent,
    AdministrarSucursalesHabilitadasComponent,
    ListadoNotificacionesComponent,
    ListadoPedidosRecompraComponent,
    ConfiguracionProductosRecompraComponent,
    ReporteVentaComponent,
    ReporteClientesSuscritosComponent,
    ResumenVentasComponent,
    PedidoDetalleComponent,
    AgregarProductoComponent,
    BloqueoDeProcesosComponent,
    AdministracionAtributosComponent,
    DetailGridComponent,
    ProductosArchivosAdminComponent,
    MonitoreotransaccionesComponent,
    NumberPipe
  ],
  providers: [HttpAuthService, LoginService,EconoMascotasService, EcommerceDashboardService, UsuariosService, DistribuidoresExternosService,ProductoArchivoService,AceptarDenegarTrasladoService,
    PedidosRecompraService, MonitoreotransaccionesService,{ provide: LOCALE_ID, useValue: 'es'}],
})
export class EcommerceModule { }
