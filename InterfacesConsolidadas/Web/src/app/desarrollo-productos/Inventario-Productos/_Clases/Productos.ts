export class Productos {
  ProductoId: number;
  ProdIdPOS: string;
  NombreProducto: string;
  UltimoCosto: number;
  UltimoPrecio: number;
  UsuarioIdCrea: number=0;
  UsuarioIdModifica: number=0;
  ProveedorId: string='';
  DistribuidorId: string='';
  ImagenUrl:string="";
  ImagenBase64:any;
  ImagenName:string="";
}
