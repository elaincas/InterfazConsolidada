export interface ProductoDescuentoSucursal {
    productoId: string;
    productoDescripcion?: string;
    descuentoAdicional: number;
    desde?: Date;
    hasta?: Date;
    observaciones?: string;
    fechaAgrega?: string;
    usuarioAgrega: number;
    activo: boolean
}