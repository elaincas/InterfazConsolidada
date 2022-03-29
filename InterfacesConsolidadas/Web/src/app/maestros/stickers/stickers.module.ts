import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { routes } from "./stickers.routing";
import { StickersComponent } from "./components/configuraciones/stickers/stickers.component";
import { ImagenesComponent } from "./components/configuraciones/imagenes/imagenes.component";
import { RouterModule } from "@angular/router";
import {
  DxButtonModule,
  DxDataGridModule,
  DxFileUploaderModule,
  DxFormModule,
  DxLoadPanelModule,
  DxSelectBoxModule,
  DxTabPanelModule,
  DxTabsModule,
  DxTextAreaModule,
  DxValidatorModule,
  DxValidationGroupModule,
  DxTooltipModule,
} from "devextreme-angular";
import { TabStickerService } from "./services/tabSticker.service";
import { ProductosModule } from "../../productos/productos.module";
import { StickersService } from "./services/stickers.service";
import { CatalogosService } from "./services/catalogos.service";
import { ProductosPremiosComponent } from "./components/premios/productos-premios/productos-premios.component";
import { PremiosService } from "./services/premios.service";
import { ProductosStickersComponent } from "./components/configuraciones/productos-stickers/productos-stickers.component";
import { FormsModule } from "@angular/forms";
import { StickerPremiosComponent } from "./components/sticker-premios/sticker-premios.component";
import { StickerPremiosService } from "./services/sticker-premios.service";
import { SucursalesComponent } from "./components/configuraciones/sucursales/sucursales.component";
import { StickerSucursalService } from "./services/sticker-sucursal.service";
import { ListadoStickersComponent } from "./components/listado-stickers/listado-stickers.component";
import { StickerImagenesService } from "./services/sticker-imagenes.service";
import { ProductoStickerService } from "./services/producto-sticker.service";
import { StickersPorDescuentosService } from "./services/sticker-por-descuento.service";
import { StickersPorDescuentosComponent } from "./components/clientes/stickers-por-descuentos/stickers-por-descuentos";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DxLoadPanelModule,
    DxButtonModule,
    DxFileUploaderModule,
    DxSelectBoxModule,
    DxTextAreaModule,
    DxFormModule,
    DxTabPanelModule,
    DxTabsModule,
    ProductosModule,
    DxValidatorModule,
    DxDataGridModule,
    DxValidationGroupModule,
    FormsModule,
    DxTooltipModule,
  ],
  declarations: [
    StickersComponent,
    ImagenesComponent,
    ProductosPremiosComponent,
    ProductosStickersComponent,
    StickerPremiosComponent,
    SucursalesComponent,
    ListadoStickersComponent,
    StickersPorDescuentosComponent,
  ],
  providers: [
    TabStickerService,
    StickersService,
    CatalogosService,
    PremiosService,
    StickerPremiosService,
    StickerSucursalService,
    StickerImagenesService,
    ProductoStickerService,
    StickersPorDescuentosService,
  ],
})
export class StickersModule {}
