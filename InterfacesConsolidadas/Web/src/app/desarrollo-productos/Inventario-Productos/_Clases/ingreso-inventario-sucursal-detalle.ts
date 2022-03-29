export interface IIngresoInventarioSucursalDetalle  {
    id: number;
    ingresoInventarioSucursalId: number;
    finalidadID: number;
    productoId: number;
    producto: string;
    inventarioProductoUbicacionId: number;
    Cantidad: number;
    CantidadTraslado:number;
}
export class IngresoInventarioSucursalDetalle implements   IIngresoInventarioSucursalDetalle{
  id: number;
  ingresoInventarioSucursalId: number;
  finalidadID: number;
  productoId: number;
  producto: string;
  inventarioProductoUbicacionId: number;
  Cantidad: number;
  CantidadTraslado:number;

}
