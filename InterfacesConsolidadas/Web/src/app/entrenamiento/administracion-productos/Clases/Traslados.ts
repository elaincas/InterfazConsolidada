import { ProductoTraslado } from "./Producto";

export class TrasladosDetalle{
    constructor(
        public TrasladosDetalleID : number = 0,
        public TrasladoID : number = 0,
        public ProductoDetalleID : number = 0,
        public EstadoID : number = 0,
        public FechaCambioEstado : Date = new Date(),
        public UsuarioID : number = 0,
        public Observacion : string = ""
    ){}
}

export class Traslados {
    constructor(
        public TrasladoID : number = 0,
        public ZonaIDEnvia: number = 0,
        public ZonaIDRecibe: number = 0,
        public Fecha : Date = new Date,
        public UsuarioID : number = 0,
        public Activo : Boolean = false,
        public EstadoID : number = 0,
        public Productos : any = [],
        public Cantidad : number = 1,
        public TrasladosDetalles : Array<TrasladosDetalle> = new Array<TrasladosDetalle>(),
        public ProductoID : number = 0,
        public ProductosTraslado: Traslados[] = []
    ){

    }
}