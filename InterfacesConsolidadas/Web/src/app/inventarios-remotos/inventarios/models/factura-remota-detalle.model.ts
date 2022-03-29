export interface IFacturaRemotaDetalle {
    id: number;
    facturaRemotaId: number;
    productoId: string;
    costo: number;
    precio: number;
    cantidad: number;
    activo: boolean;
    fechaAgrega: Date;
    /**
     *
     */

}

export class FacturaRemotaDetalle implements IFacturaRemotaDetalle{
    id: number;
    facturaRemotaId: number;
    productoId: string;
    costo: number;
    precio: number;
    cantidad: number;
    activo: boolean;
    fechaAgrega: Date;

    /**
     *
     */
    constructor() {
        this.activo = false;
        this.id = 0;
        this.facturaRemotaId = 0;
        this.costo = 0;
        this.precio = 0;
        this.cantidad = 0;
        this.fechaAgrega = new Date;
        this.productoId = "";

    }

}
