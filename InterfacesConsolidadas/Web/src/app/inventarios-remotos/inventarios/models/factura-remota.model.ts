import { FacturaRemotaDetalle } from "./factura-remota-detalle.model";

export interface IFacturaRemota {
    id: number;
    sucursalOrigenId: number;
    sucursalPerteneceFacturaId: number;
    facturaId: number;
    activo: boolean;
    fechaAgrega: Date;
    usuarioAgrega: number;
    facturasRemotasDetalle: FacturaRemotaDetalle[];
}

export class FacturaRemota implements IFacturaRemota {
    id: number;
    sucursalOrigenId: number;
    sucursalPerteneceFacturaId: number;
    facturaId: number;
    activo: boolean;
    fechaAgrega: Date;
    usuarioAgrega: number;
    facturasRemotasDetalle: FacturaRemotaDetalle[];

    /**
     *
     */
    constructor() {
        this.id = 0;
        this.sucursalOrigenId  =0;
        this.sucursalPerteneceFacturaId = 0;
        this.facturaId = 0;
        this.activo = false;
        this.fechaAgrega = new Date ();
        this.usuarioAgrega = 0;
        this.facturasRemotasDetalle = new Array <FacturaRemotaDetalle>();
    

    }

}