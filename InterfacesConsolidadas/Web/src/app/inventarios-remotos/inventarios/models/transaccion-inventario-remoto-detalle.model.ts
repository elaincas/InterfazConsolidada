export interface ITransaccionInventarioRemotoDetalle
{
     id : number ;
     transaccionInventarioRemotoId : number ;
     cantidad : number ;
     precio : number ;
     observaciones : string ;
     fechaAgrega : Date ;
     activo: boolean ;
     productoId : string ;

}

export class TransaccionInventarioRemotoDetalle implements ITransaccionInventarioRemotoDetalle{
     id: number;
     transaccionInventarioRemotoId: number;
     cantidad: number;
     precio: number;
     observaciones: string;
     fechaAgrega: Date;
     activo: boolean;
     productoId: string;

     /**
      *
      */
     constructor() {
          this.activo = false;
          this.id = 0;
          this.transaccionInventarioRemotoId = 0;
          this.cantidad = 0;
          this.observaciones = "";
          this.fechaAgrega = new Date;
          this.productoId = "";
     }

}