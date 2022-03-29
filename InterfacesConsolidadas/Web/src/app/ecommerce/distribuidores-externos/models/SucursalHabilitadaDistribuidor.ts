export class SucursalHabilitadaDistribuidor implements ISucursalHabilitadaDistribuidor
{
    id: number;
    nombre: string;
    distribuidoresExternosId: number;
    sucursalIdExterno: string;
    sucursalId: number;
    activo: boolean;
    usuarioId: number;

}
export interface ISucursalHabilitadaDistribuidor {
    id: number;
    nombre: string;
    distribuidoresExternosId: number;
    sucursalIdExterno: string;
    sucursalId: number;
    activo: boolean;
    usuarioId: number;
}