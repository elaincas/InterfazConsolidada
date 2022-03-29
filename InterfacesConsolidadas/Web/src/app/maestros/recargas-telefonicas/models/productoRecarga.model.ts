import { Operador } from "./operadores.model";

export class ProductoRecarga{
  public id: string;
  public nombre: string;
  public precioPublico: number;
  public proveedorId: string;
  public operadorId: number;
  public operador: Operador;
}
