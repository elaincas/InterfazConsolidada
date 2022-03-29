export class DistribuidorExterno{
     constructor(
        public id:number = 0,
        public nombre:string = '',
        public activo:boolean = true,
        public usuarioId:number = 0,
        public fechaAgrega: Date = new Date,
        public codigoDistribuidor : string = ""
     ){}
}
