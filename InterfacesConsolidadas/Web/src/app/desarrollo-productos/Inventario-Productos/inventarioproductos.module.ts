import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InventarioImpulsoRoute } from './inventarioproductos.routing';
import { HttpModule } from '@angular/http';

import { AgregarProductosComponent } from "./componentes/agregar-productos/agregar-productos.component";
import { IngresoProductosComponent } from "./Componentes/ingreso-productos/ingreso-productos.component";
import { InventarioSucursalComponent } from "./Componentes/inventario-sucursal/inventario-sucursal.component";
import { InventarioProductoUbicacionComponent } from "./Componentes/listado-productos-ingresados-inventario/listado-productos-ingresados-inventario.component";
import { PantallaIncioComponent } from "./Componentes/pantalla-incio/pantalla-incio.component";
import { RecepcionTrasladosComponent } from "./Componentes/recepcion-traslados/recepcion-traslado.component";
import { TrasladarProductosComponent } from "./componentes/trasladar-productos/trasladar-productos.component";
import { AgregarProductosService } from "./componentes/agregar-productos/agregar-productos.service";
import { IngresarProductosService } from "./Componentes/ingreso-productos/ingreso-productos.service";
import {  InventarioService} from "./Componentes/inventario-sucursal/inventario-sucursal.service";
import { InventarioProductosService } from "./Componentes/listado-productos-ingresados-inventario/listado-productos-ingresados-inventario.service";
import {RecepcionTrasladoService  } from "./Componentes/recepcion-traslados/recepcion-traslado.service";
import { TrasladarProductosService } from "./componentes/trasladar-productos/trasladar-productos.service";

import {
  DxLookupModule,
  DxTextBoxModule,
  DxTabsModule,
  DxValidatorModule,
  DxCheckBoxModule,
  DxDataGridModule,

  DxNumberBoxModule,
  DxDateBoxModule,
  DxPopupModule,
  DxButtonModule,
  DxFileUploaderModule,
  DxAutocompleteModule,
  DxTextAreaModule,
  DxSelectBoxModule,
  DxScrollViewModule
} from "devextreme-angular";
import { TablaAgregarProductosComponent } from './Componentes/tabla-agregar-productos/tabla-agregar-productos.component';
import { LoginService } from '../../login/services/login.service';
import { ListaProductosComponent } from './Componentes/lista-productos/lista-productos.component';
import { InventarioProductosImpulsadoService } from './services/inventario-service.service';
import { InformacionSalidaComponent } from './Componentes/informacion-salida/informacion-salida.component';
import { ReporteIngresoProductosComponent } from './Componentes/reporte-ingreso-productos/reporte-ingreso-productos.component';
import { IngresoTrasladoSucursalComponent } from './Componentes/ingreso-traslado-sucursal/ingreso-traslado-sucursal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forChild(InventarioImpulsoRoute),
    DxLookupModule,
    DxDataGridModule,
    DxButtonModule,
    DxDateBoxModule,
    DxSelectBoxModule,
    DxNumberBoxModule,
    DxPopupModule,
    DxTextBoxModule,
    DxAutocompleteModule,
    DxLookupModule,
    DxDataGridModule,
    DxFileUploaderModule,
    DxButtonModule,
    DxDateBoxModule,
    DxSelectBoxModule,
    DxNumberBoxModule,
    DxScrollViewModule,
    DxPopupModule,
    DxTextBoxModule,
    DxAutocompleteModule

  ],
  providers: [AgregarProductosService, IngresarProductosService, InventarioProductosService, InventarioService, RecepcionTrasladoService, TrasladarProductosService, LoginService, InventarioProductosImpulsadoService],
  declarations: [TablaAgregarProductosComponent,AgregarProductosComponent, PantallaIncioComponent,InventarioProductoUbicacionComponent,IngresoProductosComponent ,InventarioSucursalComponent, RecepcionTrasladosComponent, TrasladarProductosComponent,ListaProductosComponent, InformacionSalidaComponent, ReporteIngresoProductosComponent, IngresoTrasladoSucursalComponent]
})
export class InventarioImpulsoModule { }
