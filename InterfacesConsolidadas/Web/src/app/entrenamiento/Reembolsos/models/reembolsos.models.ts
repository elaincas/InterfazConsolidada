export class Reembolso{
    constructor(
        public sucursalId:number=0,
        public  usuarioSupervisorId:number=0, 
        public  colaboradorId:number=0, 
        public  colaboradorPuestoId :number=0,
        public  ciudadOrigenId:string="", 
        public  ciudadDestinoId:string="", 
        public  diasViajados:number=0,
        public  gastoDiario:number=0, 
        public  tipoReembolso:number=0, 
        public  fechaIngreso: Date=new Date,
        public  rutaDocumentoRecibo :any[] = [],
        public  rutaDocumentoCompromiso:any[] = [],
        public  tipoMensaje:number=0, 
        public  mensaje:string="",
        public  usuarioId:number=0,
        public  observaciones:string="",
        ){

    }
    toJson():string{
        let objeto = {
            sucursalId:this.sucursalId,
            usuarioSupervisorId:this.usuarioSupervisorId,
            colaboradorId:this.colaboradorId,
            colaboradorPuestoId:this.colaboradorPuestoId,
            ciudadOrigenId:this.ciudadOrigenId,
            ciudadDestinoId:this.ciudadDestinoId,
            diasViajados:this.diasViajados,
            gastoDiario:this.gastoDiario,
            tipoReembolso:this.tipoReembolso,
            fechaIngreso:this.fechaIngreso,
            observaciones:this.observaciones,
            usuarioId:this.usuarioId    
        };

        return JSON.stringify(objeto);
    }
}

export class ListadoReembolso{
    constructor(
        public reembolsoID:number=0,
        public estadoID:number=0,
        public colaboradorID:number=0,
        public fechaReembolso:Date= new Date,
        public valorAPagar:number=0,
        public usuarioSupervisorId:number=0,
        public ciudadOrigenId:number=0,
        public ciudadDestinoId=0,
        public  tipoMensaje:number=0, 
        public  mensaje:string="",
        public observaciones:string=""

    ) {
            
    }
}
export class ListadoReembolsoCompensacion{
    constructor(
        public reembolsoID:number=0,
        public colaboradorID:number=0,
        public colaborador:string="",
        public codigoTipoIngreso:number=0,
        public fechaReembolso:Date= new Date,
        public valorAPagar:number=0,
        public quincena:number=1,
        public mes:number=0,
        public año:number=0,
        public observaciones:string="",
        public usuarioId:number=0
    ) {
            
    }
    
}

export class ListadoReembolsosSegunEstado{
    constructor(
        public estadoID:number=0,
        public colaboradorID:number=0,
        public colaborador:string="",
        public fechaReembolso:Date= new Date,
        public fechaDesde:Date= new Date,
        public fechaHasta:Date= new Date,
        public valorAPagar:number=0,
        public observaciones:string="",
        public usuarioId:number=0,
        public sucursal:string="",
        public rutaDocumentoRecibos:string="",
        public rutaDocumentoCopromiso:string=""
    ){

    }
}