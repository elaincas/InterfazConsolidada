import { TransaccionInventarioRemotoDetalle } from "./transaccion-inventario-remoto-detalle.model";
import { TransaccionInventarioRemotoDevolucionDto } from "./transaccion-inventario-remoto-devolucion";

export interface ITransaccionInventarioRemotoDto {
    id: number;
    transaccionTipoId: number;
    transaccionTipoDescripcion: string;
    estadoId: number;
    estadoDescripcion: string;
    observaciones: string;
    fechaEnvio: Date;
    usuarioEnvia: number;
    usuarioNombreEnvia: string;
    fechaRecibe: Date | null;
    usuarioRecibe: number | null;
    usuarioNombreRecibe: string;
    activo: boolean;
    sucursalId: number;
    sucursalDestinoId: number;
    sucursalNombre: string;
    transaccionInventarioRemotoDetalles: TransaccionInventarioRemotoDetalle[];
    transaccionInventarioRemotoDevolucionDto:TransaccionInventarioRemotoDevolucionDto
   
}

export class TransaccionInventarioRemotoDto implements ITransaccionInventarioRemotoDto {
    id: number;
    transaccionTipoId: number;
    transaccionTipoDescripcion: string;
    estadoId: number;
    estadoDescripcion: string;
    observaciones: string;
    fechaEnvio: Date;
    usuarioEnvia: number;
    usuarioNombreEnvia: string;
    fechaRecibe: Date;
    usuarioRecibe: number;
    usuarioNombreRecibe: string;
    activo: boolean;
    sucursalId: number;
    sucursalDestinoId: number;
    sucursalNombre: string;
    transaccionInventarioRemotoDetalles: TransaccionInventarioRemotoDetalle[];
    transaccionInventarioRemotoDevolucionDto: TransaccionInventarioRemotoDevolucionDto
    /**
     *
     */
    constructor() {
        this.id = 0;
        this.transaccionTipoId = 0;
        this.transaccionTipoDescripcion = "";
        this.estadoDescripcion = "";
        this.estadoId = 0;
        this.observaciones = "";
        this.fechaEnvio = new Date ;
        this.usuarioEnvia = 0;
        this.usuarioNombreEnvia = "";
        this.fechaRecibe = new Date;
        this.usuarioNombreRecibe = "";
        this.usuarioRecibe = 0;
        this.activo = false;
        this.sucursalId = 0;
        this.sucursalDestinoId = 0;
        this.sucursalNombre ="";
        this.transaccionInventarioRemotoDetalles = new Array <TransaccionInventarioRemotoDetalle>();
        this.transaccionInventarioRemotoDevolucionDto = new TransaccionInventarioRemotoDevolucionDto();
    }
    toJson(): string {
        const objeto = {
         
            id : this.id,
            transaccionTipoId : this.transaccionTipoId,
            transaccionTipoDescripcion : this.transaccionTipoDescripcion,
            estadoId : this.estadoId,
            estadoDescripcion: this.estadoDescripcion,
            observaciones: this.observaciones,
            fechaEnvio: this.fechaEnvio,
            usuarioEnvia : this.usuarioEnvia,
            usuarioNombreEnvia: this.usuarioNombreEnvia,
            fechaRecibe: this.fechaRecibe ,
            usuarioRecibe : this.usuarioRecibe,
            usuarioNombreRecibe : this.usuarioNombreRecibe,
            activo: this.activo,
            sucursalId : this.sucursalId,
            sucursalDestinoId : this.sucursalId,
            sucursalNombre: this.sucursalNombre,
            transaccionInventarioRemotoDetalles : this.transaccionInventarioRemotoDetalles,
            transaccionInventarioRemotoDevolucionDto : this.transaccionInventarioRemotoDevolucionDto
      };
      return JSON.stringify(objeto);
    }

}