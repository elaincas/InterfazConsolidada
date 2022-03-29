export interface ReporteClienteSuscritoDetalle {
    fechaDebeRealizarsePedido: Date;
    fechaSuscripcion: Date;
    sucursalId: number;
    sucursal: string;
    productoId: string;
    productoDescripcion: string;
    total: number;
    tipoPedido: string;
    usuarioId: number;
}
