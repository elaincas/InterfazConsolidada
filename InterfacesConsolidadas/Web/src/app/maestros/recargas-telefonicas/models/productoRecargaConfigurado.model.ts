import { Operador, OperadorTipoProducto } from "./operadores.model";
import { ProductoRecarga } from "./productoRecarga.model";

export class ProductoRecargaConfigurado{
  public id: string;
  public operadorId: number;
  public operadorTipoProductoId: number;
  public codigoExternoRecarga: string;
  public selector: number;
  public monto: number;
  public tipo: string;
  public proveedorId: string;
  public informacionAdicional: string;
  public producto: ProductoRecarga;
  public operador: Operador;
  public tipoProductoRecarga: OperadorTipoProducto;
  public activo: boolean;
}
