export class Producto{
    /**
     *
     */
    constructor(
        public  ProductoID :number = 0,
        public  ProductoDetalleID : number = 0,
        public  Precio : number = 0,
        public  EstadoID : number = 0,
        public  FechaIngreso : Date = new Date,
        public  UsuarioId : number = 0,
        public  Observacion : string = "",
        public  NombreProducto : string = "",
        public  Estado : String = "",
        public  Cantidad : number = 1,
        public ZonaID: number = 0
    ) {
        

    }
}

export class ProductoPrestamos{
    /**
     *
     */
    constructor(
        public ProductoPrestamoId : number = 0,
        public ColaboradorID: number = null,
        public NombreColaborador: string = "",
        public ProductoID: number = 0,
        public ProductoDetalleID: number = 0,
        public EstadoID: number = 0,
        public Cantidad: number = 0,
        public Fecha: Date = new Date,
        public Observacion: string = "",
        public UsuarioId : number =0,
        public Estado: string = "",
        public ValeId: number = 0,
        public  listaProductos : Array<ProductoPrestamos> = new Array<ProductoPrestamos>()
    ) {
            
    }
}


export class AuxiliarProductos{
    /**
     *
     */
    constructor(
        public  ProductoDetalleID : number = 0,
        public  ProductoID : number = 0,
        public  Descripcion : number = 0,
        public  ProductoPrestamoID : number = 0,
        public  ColaboradorID : number = 0,
        public  Nombre : number = 0,
        public  FechaCambioEstado : number = 0,
        public  EstadoID : number = 0,
        public  Estado : number = 0,
        public  UsuarioHaceTransaccion : number = 0,
        public  Usuario : number = 0,
        public  ObservacionDetallesProducto : number = 0,
        public  NoTraslado : number = 0,
        public  ZonaIDEnvia : number = 0,
        public  ZonaEnvia : number = 0,
        public  ZonaIDRecibe : number = 0,
        public  ZonaRecibe : number = 0,
        public  Fecha : number = 0,
        public  ZonaIdActual : number = 0,
        public  ZonaActual : number = 0,
        public  listaAuxiliar : Array<AuxiliarProductos> = new Array<AuxiliarProductos>(),
        public inventarioInicial: number = 0
    ) {
            
    }
}

export class ProductoTraslado{
    constructor(
        public productoID :number = 0,
        public Cantidad : number = 1,
        public NombreProducto : string = ''
    ) {}
}
