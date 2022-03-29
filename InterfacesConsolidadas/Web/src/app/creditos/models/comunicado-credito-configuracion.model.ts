export class ComunicadoCreditoConfiguracion {
    /**
     *
     */
    constructor(
        public  id :number = 0 ,
        public  comunicadoCreditoId : number = 0 ,
        public  clienteId : string = '',
        public  noPoliza :string = '',
        public  fechaAgrega : Date = new Date,
        public  usuarioAgregaId :number = 0 ,
        public  fechaModifica : Date = new Date,
        public  usuarioModificaId :number = 0 ,
        public  activo : Boolean = true

    ) {
        
        
    }        
}