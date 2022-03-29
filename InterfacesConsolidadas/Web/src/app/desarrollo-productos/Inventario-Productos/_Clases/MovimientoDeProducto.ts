export class MovimientoDeProducto {
  MovimientoProductoId: number;
  FechaEnvia: Date;
  UsuarioEnvia: number;
  Observaciones: string;
  SucursalId: number;
  EnvioWebId:number;
  UsuarioRecibe: number;
  FechaRecibe:number;
  MovimientoSProductoDetalle: MovimientoProductoDetalle[];
  UsuarioIdCrea: number =0;
  UsuarioIdModifica: number = 0;
}

export class  MovimientoProductoDetalle {
  MovimientoProductoDetalleId:number = 0;
  MovimientoProductoId: number = 0;
  InventarioProductoUbicacionId: number = 0;
  DescripcionProducto: string = "";
  Cantidad:number = 0;
  ProductoId: number = 0;
  TipoSalida: number=0;
  SalidaFinalidad: string="";
}