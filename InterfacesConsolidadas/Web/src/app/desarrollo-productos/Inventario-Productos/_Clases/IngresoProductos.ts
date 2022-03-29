import { InventarioProductosUbicacion } from './InventarioProductosUbicacion';

export class IngresoProductos {
  IngresoProductoId: number;
  DistribuidorId: string = "";
  NoDocumentoDistribuidor: string;
  Observaciones: string;
  SucursalId: number;
  EstadoId: number;
  FinalidadInventarioId: number;
  InventarioProductosUbicacion: InventarioProductosUbicacion[];
  UsuarioIdCrea: number=0;
  UsuarioIdModifica: number =0;
  ImagenUrl:string="";
  ImagenBase64:any;
  ImagenName:string="";
}
