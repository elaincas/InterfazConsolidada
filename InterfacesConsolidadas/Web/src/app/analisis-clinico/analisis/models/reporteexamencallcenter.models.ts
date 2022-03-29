export class ReporteFacturaProductoDom{
    constructor(
        public  agenteId:string="",
        public  agenteNombre:string="", 
        public  total:number=0.0, 
        public  facturas :number=0,
        public  cliente:string="", 
        public  fechaFactura:Date = new Date,
        public  prodDesc:string="", 
        public  sucursal:number=0, 
        public  facturaId :number = 0,
        public  observaciones:string = "",
        public  observacionesEspeciales:string= "",
        public  nombre:string= "",
        ){


    }
    toJson():string{
        let objeto = {
            agenteId:this.agenteId,
            agenteNombre:this.agenteNombre,
            total:this.total,
            facturas:this.facturas,
            cliente:this.cliente,
            fechaFactura:this.fechaFactura,
            prodDesc:this.prodDesc,
            sucursal:this.sucursal,
            facturaId:this.facturaId,
            observaciones:this.observaciones,
            observacionesEspeciales:this.observacionesEspeciales,
            nombre:this.nombre,
        };

        return JSON.stringify(objeto);
    }
}
