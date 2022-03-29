import { CuponDigitalTipo } from "./cuponDigitalTipo.model";
import { CuponDigitalProducto } from "./cuponDigitalProducto.model";

export class CuponDigital {
  public id: number;
  public descripcion: string;
  public codigo: string;
  public fechaInicio: Date;
  public fechaFin: Date;
  public porcentajeDescuento: number;
  public cuponDigitalTipoId: number;
  public cuponDigitalTipo: CuponDigitalTipo;
  public activo: boolean;
  public fechaAgrega: Date;
  public cuponDigitalProductos: CuponDigitalProducto[];
  public porIdentidad: boolean;
  public valorDescuento: number;

  /**
   *
   */
  constructor() {
    this.cuponDigitalProductos = [];
  }
}
