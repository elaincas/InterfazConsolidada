import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import {
    DxLookupModule,
    DxTextBoxModule,
    DxCheckBoxModule,
    DxDataGridModule,
    DxNumberBoxModule,
    DxDateBoxModule,
    DxPopupModule,
    DxButtonModule,
    DxFileUploaderModule,
    DxAutocompleteModule,
    DxSelectBoxModule,
    DxGalleryModule,
    DxTextAreaModule,
    DxDropDownBoxModule,
  } from "devextreme-angular";
import { ProductoEntrenamientoRoute } from './producto-entrenamiento.routing';
import { ProductoEntrenamientoComponent } from './Componentes/Ingresar-Producto/ingresar-producto.component';
import { ProductoEntrenamientoService } from './Componentes/Ingresar-Producto/ingresar-producto.service';
import { AsignarProductoService } from './Componentes/Asignar-Producto/asignar-producto.service';
import { AsignacionProductoComponent } from './Componentes/Asignar-Producto/asignar-producto.component';
import { ProductoDisponiblesComponent } from './Componentes/Reportes/Productos-Disponibles/productos-disponibles.component';
import { ProductoDisponibleService } from './Componentes/Reportes/Productos-Disponibles/productos-disponibles.service';
import { ProductoTransaccionesColaboradoresService } from './Componentes/Reportes/Productos-Transacciones-Colaboradores/productos-transacciones-colaboradores.service';
import { ProductosTransaccinoesColaboradorComponent } from './Componentes/Reportes/Productos-Transacciones-Colaboradores/productos-transacciones-colaboradores.component';
import { AsignarZonaComponent } from './Componentes/Administrar-Zonas/asignar-zona.component';
import { AsignarZonaService } from './Componentes/Administrar-Zonas/asignar-zona.service';
import { TrasladosComponent } from './Componentes/Traslados/traslados.component';
import { TrasladoService } from './Componentes/Traslados/traslados.service';
import { AceptarDenegarTrasladoComponent } from './Componentes/Traslados/aceptar-denegar-traslado.component';
import { AceptarDenegarTrasladoService } from './Componentes/Traslados/aceptar-denegar-traslado.service';
import { AuxiliarService } from './Componentes/Reportes/Productos-Auxiliar/producto-auxiliar.service';
import { AuxiliarProductosComponent } from './Componentes/Reportes/Productos-Auxiliar/producto-auxiliar.component';
import { ProductoMalEstadoPerdidosService } from './Componentes/Reportes/Productos-MalEstadosPerdidos/productos-malestadoperdidos.service';
import { ProductosMalEstadosPerdidosComponent } from './Componentes/Reportes/Productos-MalEstadosPerdidos/productos-malestadoperdidos.component';
  
@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      HttpModule,
      RouterModule.forChild(ProductoEntrenamientoRoute),
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
      DxButtonModule,
      DxDateBoxModule,
      DxSelectBoxModule,
      DxNumberBoxModule,
      DxPopupModule,
      DxTextBoxModule,
      DxFileUploaderModule,
      DxAutocompleteModule,
      DxCheckBoxModule,
      DxGalleryModule,
      DxTextAreaModule,
      DxDropDownBoxModule
    ],
    providers: [ProductoEntrenamientoService,AsignarProductoService,ProductoDisponibleService,ProductoTransaccionesColaboradoresService,AsignarZonaService,TrasladoService,AceptarDenegarTrasladoService,AuxiliarService,ProductoMalEstadoPerdidosService],
    declarations: [ProductoEntrenamientoComponent,AsignacionProductoComponent,ProductoDisponiblesComponent,ProductosTransaccinoesColaboradorComponent,AsignarZonaComponent,TrasladosComponent,AceptarDenegarTrasladoComponent,AuxiliarProductosComponent,ProductosMalEstadosPerdidosComponent]
  })

export class ProductoEntrenamientoModule { }
  