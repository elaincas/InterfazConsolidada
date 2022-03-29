export class EmpresaPorAseguradora {
    /**
     *
     */
    constructor(
        public  registro : number = 0,
        public  clienteID : string = "",
        public  noPoliza :string = "",
        public  nombrePoliza :string = "",
        public  descontinuado :string = "",
        public  nombreCliente :string = "",
    ) {
        
    }
}