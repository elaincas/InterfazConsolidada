export class SupervisorSucursal{
    constructor(
        public usuarioSupervisorId :number=0,
        public  nombre:string="" ,
        public  tipoMensaje:number=0,
        public  mensaje:string=""
    ) {
    }
}

export class ColaboradorVHUR{
    constructor(
        public  colaboradorID:number=0,
        public  nombre:string="" ,
        public  puestoID:number=0 ,
        public  descripcionPuesto:string="" ,
        public fechaIngreso:Date=new Date,
        public tipoMensaje:number=0 ,
        public mensaje:string="" ,
    ) {
    }
}
export class Ciudades{
    constructor(
        public  ciudadID :number=0,
        public  ciudad:string="" ,
        public  tipoMensaje:number=0 ,
        public  mensaje:string=""
    ) {    
    }
}

export class Meses{
    constructor(
        public mesId:number=0,
        public descripcion:string=""
    ){}
}