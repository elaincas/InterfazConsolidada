export class ProductoGrid {
    constructor( 
    public ProductoCod: number =0,
    public NombreProducto: string = "",
    public SucursalCod: number = 0,
    public NombreSucursal: string= "",
    public Precio: number =0,
    public Costo: number=0,
    public Cantidad: number=0,
    public TipoSalida: string="",
    public IdTipoSalida: number=0){}
}

export class ProductosGridTraslados {
    constructor(
        public ProductoCodigo: number =0,
        public NombreProducto: string = "",
        public SucursalCodigo: number = 0,
        public NombreSucursal: string= "",
        public Precio: number =0,
        public Costo: number=0,
        public Cantidad: number=0,
        public TipoSalida: string="",
        public TipoSalidaCodigo: number=0,
        public MovimientoProductoId: number = 0){

    }
}