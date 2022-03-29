export class ProductoEnlace {
 
    constructor(
        public id : number = 0,
        public productoIdCompra : string = "",
        public productoIdEnlace : string = "",
        public tipoProductoEnlaceId: number = 0,
        public usuarioId : number = 0,
        public fechaAgrega : Date = new Date,
        public usuarioModificaId :  number = 0,
        public FechaModifica : Date = new Date,
        public activo : boolean = false,
        public mensajeError : string = "",
        public transaccionConExito : boolean = false,
    ) {
        
    }
}