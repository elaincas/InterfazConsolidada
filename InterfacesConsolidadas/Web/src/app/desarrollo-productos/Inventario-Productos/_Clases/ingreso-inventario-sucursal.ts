import { IngresoInventarioSucursalDetalle } from "./ingreso-inventario-sucursal-detalle";

export interface IIngresoInventarioSucursal {
    id: number;
    movimientoProductoID: number;
    sucursalId: number;
    fechaIngreso: Date | string;
    cantidadTotal: number;
    UsuarioIdCrea: number;
    detalles: IngresoInventarioSucursalDetalle[];
}

export class IngresoInventarioSucursal  implements  IIngresoInventarioSucursal{
  id: number;
  sucursalId: number;
  UsuarioIdCrea: number=0;
  movimientoProductoID: number;
  fechaIngreso: string | Date;
  cantidadTotal: number;
  detalles: IngresoInventarioSucursalDetalle[];
}
