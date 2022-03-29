export interface ITransaccionInventarioRemotoDevolucion {
     id: number;
     transaccionInventarioRemotoDetalleId: number;
     usuarioId: number;
     cantidadDevuelta: number;
     fechaAgrega: Date;
     cantidadDisponible: number;

}
export class TransaccionInventarioRemotoDevolucionDto implements ITransaccionInventarioRemotoDevolucion {
     id: number;
     transaccionInventarioRemotoDetalleId: number;
     usuarioId: number;
     cantidadDevuelta: number;
     fechaAgrega: Date;
     cantidadDisponible: number;

     /**
      *
      */
     constructor() {
          
          this.cantidadDevuelta = 0;
          this.id = 0;
          this.transaccionInventarioRemotoDetalleId = 0;
          this.usuarioId = 0;
          this.fechaAgrega = new Date;
          this.cantidadDisponible = 0;
     }

}