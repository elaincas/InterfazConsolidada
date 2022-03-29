import { ProductoCupon } from "./productoCupon.model";

export class CuponDigitalProducto {
  public id: number;
  public productoId: string;
  public producto: ProductoCupon;
  public cuponDigitalId: number;
  public activo: boolean;
}
