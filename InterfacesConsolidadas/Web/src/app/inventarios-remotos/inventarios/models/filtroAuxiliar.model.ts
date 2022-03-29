
export interface IAuxiliarFiltro {
fechaDesde : Date
fechaHasta: Date
sucursalId :number
productoId : string


   
}

export class AuxiliarFiltro implements  IAuxiliarFiltro{
    fechaDesde: Date;
    fechaHasta: Date;
    sucursalId: number;
    productoId : string
    /**
     *
     */
    constructor() {
       this.fechaDesde = new Date;
       this.fechaHasta = new Date;
       this.sucursalId = 0;
       this.productoId = "";

    }
   
    toJson(): string {
        const objeto = {
            fechaDesde  : this.fechaDesde,
            fechaHasta : this.fechaHasta,
            sucursalId : this.sucursalId,
            productoId : this.productoId,
           
      };
      return JSON.stringify(objeto);
    }

}