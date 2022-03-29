import { ProductoService } from "./producto.service";
import { BuscadorComponent } from "./buscador/buscador.component";
import { IndividualesComponent } from "./administracion-alternativos/components/individuales/individuales.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ProductosRoutes } from "./productos.routing";

import {
  DxLookupModule,
  DxTextBoxModule,
  DxTabsModule,
  DxValidatorModule,
  DxCheckBoxModule,
  DxDataGridModule,
  DxPopupModule,
  DxFileUploaderModule,
  DxSelectBoxModule,
  DxLoadPanelModule,
  DxNumberBoxModule,
  DxButtonModule,
  DxDateBoxModule,
  DxDropDownBoxModule,
  DxFormModule,
  DxTextAreaModule,
  DxColorBoxModule,
  DxScrollViewModule,
} from "devextreme-angular";
import { GruposProductosComponent } from "./administracionGrupos/components/grupos-productos/grupos-productos.component";
import { HttpAuthService } from "../helpers/http/http-auth.service";
import { MainLoaderComponent } from "../helpers/main-loader/main-loader.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AgrupadorProductosComponent } from "./agrupador-productos/agrupador-productos";
import { ProductosGraphServiceService } from "./agrupador-productos/services/productos-graph-service.service";
import { CategoriaProductosFrmComponent } from "./administracionGrupos/components/categoria-productos-frm/categoria-productos-frm.component";
import { CategoriasProductosService } from "./administracionGrupos/services/categorias-productos.service";
import { TagCrudFrmComponent } from "./administracion-tags/tag-crud-frm/tag-crud-frm.component";
import { ProductosTagsComponent } from "./administracion-tags/productos-tags/productos-tags.component";
import { AgrupadorTagsComponent } from "./administracion-tags/agrupador-tags/agrupador-tags.component";
import { TagsServiceService } from "./administracion-tags/tag-crud-frm/tags-service.service";
import { ProductosTagsService } from "./administracion-tags/productos-tags/productos-tags.service";
import { AgrupadorProductosModalComponent } from "./agrupador-productos/agrupador-productos-modal/agrupador-productos-modal.component";
import { AgregarAtributosComponent } from "./administracion-atributos/agregar-atributos/agregar-atributos.component";
import { ListaAtributosComponent } from "./administracion-atributos/lista-atributos/lista-atributos.component";
import { BandeosComponent } from "./enlazar-productos/bandeos/bandeos.component";
import { EnlaceProductosService } from "./enlazar-productos/enlace-productos-service.service";
import { AdministracionPreciosService } from "./administracion-precios/administracionPrecios.service";
import { AdministracionProductosComponent } from "./administracion-precios/component/administracion-productos/administracion-productos.component";
import { AdministracionProductosprecioglobalComponent } from "./administracion-precios/component/administracion-productos-precio-global/administracion-productos-precio-global.component";
import { ExcelImportExportService } from "./administracion-precios/excel-import-export.service";
import { AlternativosComponent } from "./administracion-alternativos/components/alternativos/alternativos.component";
import { AdministracionProductosAlternativosService } from "./administracion-alternativos/services/administracionProductosAlternativos.service";
import { ConfiguracionProductosRecompraService } from "../ecommerce/recompra/_services/configuracion-productos.service";
import { AdministrarPedidoUIComponent } from "./configuracion-pedidosUI/components/administrar-pedidoUI.component";
import { ConfiguracionPedidoUIService } from "./configuracion-pedidosUI/services/configuracion-pedidosUI.service";
import { MaestrosFarmaciaService } from "../maestros/maestros-farmacia.service";
import { ProductosDescuentosExclusivosComponent } from "./productos-descuentos-exclusivos/components/administrar/productos-descuentos-exclusivos/productos-descuentos-exclusivos.component";
import { ProductosDescuentosExclusivosService } from "./productos-descuentos-exclusivos/services/productos-descuentos-exclusivos.service";
import { ReporteComparativoComponent } from "./administracion-alternativos/components/reporte-comparativo/reporte-comparativo.component";
import { ProductosRestringidosComponent } from "./productos-restringidos/components/administrar/productos-restringidos/productos-restringidos";
import { ProductosRestringidosService } from "./productos-restringidos/services/productos-restringidos.service";
import { ProductoInformacionComponent } from "./informacion-productos/components/producto-informacion/producto-informacion.component";
import { ProductoInformacionService } from "./informacion-productos/services/producto-informacion.service";
import { SeccionesComponent } from "./informacion-productos/components/secciones/secciones.component";
import { SeccionService } from "./informacion-productos/services/seccion.service";
import { SeccionProductosComponent } from "./informacion-productos/components/seccion-productos/seccion-productos.component";
import { ProductLookupComponent } from "./product-lookup/components/product-lookup.component";
import { SeccionProductosService } from "./informacion-productos/services/seccion-productos.service";
import { QuillModule } from 'ngx-quill';
import { TextAreaComponent } from './informacion-productos/components/seccion-productos/detalles/text-area/text-area.component';
import { ListViewComponent } from './informacion-productos/components/seccion-productos/detalles/list-view/list-view.component';
import { TablaComponent } from './informacion-productos/components/seccion-productos/detalles/tabla/tabla.component'
import { ReporteReporducionDeVideoComponent } from "./productos-reporte-video/components/Reporte/productos-reproduciones/productos-reproduciones.component";
import { ProductosReproducionesService } from "./productos-reporte-video/services/productos-reproduciones.service";
import { AgregarDescuentosAdicionalesComponent } from './administracion-descuentos-sucursal/components/agregar-descuentos-adicionales/agregar-descuentos-adicionales.component';
import { DescuentosSucursalService } from "./administracion-descuentos-sucursal/services/descuentos-sucursal.service";
import { BuscarProductosPopupComponent } from './administracion-descuentos-sucursal/components/buscar-productos-popup/buscar-productos-popup.component';
import { ConsultarDescuentosAdicionalesComponent } from './administracion-descuentos-sucursal/components/consultar-descuentos-adicionales/consultar-descuentos-adicionales.component';
import { SucursalSelectBoxComponent } from './administracion-descuentos-sucursal/components/sucursal-select-box/sucursal-select-box.component';
import { ModificarDescuentosPopupComponent } from './administracion-descuentos-sucursal/components/modificar-descuentos-popup/modificar-descuentos-popup.component';
import { ProductValidationComponent } from "./product-lookup/validations/product-validation.component";
import { PresentacionesComponent } from './administracion-presentaciones/components/presentaciones/presentaciones.component';
import { AdministracionProductoPresentacionesService } from "./administracion-presentaciones/services/administracionProductoPresentaciones.service";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ProductosRoutes),
    QuillModule,
    DxLookupModule,
    DxTextBoxModule,
    DxTabsModule,
    DxValidatorModule,
    DxCheckBoxModule,
    DxDataGridModule,
    DxPopupModule,
    DxSelectBoxModule,
    DxFileUploaderModule,
    DxLoadPanelModule,
    FormsModule,
    DxColorBoxModule,
    DxNumberBoxModule,
    DxButtonModule,
    DxDateBoxModule,
    DxTextAreaModule,
    ReactiveFormsModule,
    DxDropDownBoxModule,
    DxFormModule,
    DxScrollViewModule
  ],
  providers: [
    ProductosGraphServiceService,
    HttpAuthService,
    CategoriasProductosService,
    TagsServiceService,
    ProductosTagsService,
    EnlaceProductosService,
    AdministracionPreciosService,
    ExcelImportExportService,
    AdministracionProductosAlternativosService,
    AdministracionProductoPresentacionesService,
    ConfiguracionProductosRecompraService,
    ProductoService,
    ProductosDescuentosExclusivosService,
    ProductosRestringidosService,
    ConfiguracionPedidoUIService,
    MaestrosFarmaciaService,
    ProductoInformacionService,
    SeccionService,
    SeccionProductosService,
    ProductosReproducionesService,
    DescuentosSucursalService
  ],
  declarations: [
    MainLoaderComponent,
    CategoriaProductosFrmComponent,
    AgrupadorProductosComponent,
    GruposProductosComponent,
    TagCrudFrmComponent,
    ProductosTagsComponent,
    AgrupadorTagsComponent,
    AgrupadorProductosModalComponent,
    AgregarAtributosComponent,
    ListaAtributosComponent,
    BandeosComponent,
    AdministracionProductosComponent,
    AdministracionProductosprecioglobalComponent,
    AlternativosComponent,
    IndividualesComponent,
    //AgregarProductoAlternativoModalComponent,
    BuscadorComponent,
    ProductosDescuentosExclusivosComponent,
    ProductosRestringidosComponent,
    AdministrarPedidoUIComponent,
    ProductoInformacionComponent,
    SeccionesComponent,
    SeccionProductosComponent,
    ProductLookupComponent,
    TextAreaComponent,
    ListViewComponent,
    TablaComponent,
    ReporteComparativoComponent,
    ReporteReporducionDeVideoComponent,
    AgregarDescuentosAdicionalesComponent,
    BuscarProductosPopupComponent,
    ConsultarDescuentosAdicionalesComponent,
    SucursalSelectBoxComponent,
    ModificarDescuentosPopupComponent,
    ProductValidationComponent,
    PresentacionesComponent
  ],
  exports: [
    AgrupadorProductosComponent,
    BuscadorComponent,
    ProductLookupComponent,
    ProductValidationComponent,
  ],
})
export class ProductosModule {}
