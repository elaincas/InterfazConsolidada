import { Injectable } from "@angular/core";

export class InventarioProductosUbicacion {
  InventarioProductosUbicacionId: number;
  ProductoId: number;
  InventarioInicial: number;
  SucursalId: number;
  Precio: number;
  Costo: number;
  Vence: number;
  TipoTransaccion: number;
  DocumentoId: number;
  InventarioActual: number;
  FechaInicial: Date = new Date(); 
  FechaFinal: Date = new Date();
  UsuarioIdCrea: number=0;
}

export class TipoTransaccion {
  Id:number = 0;
  Descripcion: string = "";
}

