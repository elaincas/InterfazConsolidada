export class FiltroComunicadoCredito{
    /**
     *
     */
    constructor(
        public  registro : number = 0,
        public  fechaInicio : Date =  new Date,
        public  fechaFin :Date =  new Date,
        public  clienteId : string = "",
        public  noPoliza :string = ""
    ) {
        
        
    }
}