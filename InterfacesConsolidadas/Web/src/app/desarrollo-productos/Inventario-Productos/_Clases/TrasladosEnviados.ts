import { InformacionEntregaRegalia } from "./informacion-entrega-regalia";

export class TrasladosEnviados {
    public CantidadTrasladada: number = 0;
    public CantidadSalida: number = 0;
    public MovimientoProductoId: number = 0;
    public DescripcionProducto: string = "";
    public ProductoId: number = 0;
    public TipoSalida: number = 0;
    public DescripcionTipoSalida: string = "";
    public FinalidadID: number = 0;
    public MovimientoDetalleId: number = 0;
    UsuarioIdModifica: number = 0;
    UsuarioIdCrea: number = 0;
    public ValidarSalida:boolean=false;
    public InformacionEntregaRegalias:InformacionEntregaRegalia[]=[]
}
