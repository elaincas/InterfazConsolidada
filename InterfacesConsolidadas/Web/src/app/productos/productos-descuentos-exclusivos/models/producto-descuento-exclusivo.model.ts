import { ProductoDescuentoExclusivoTipo } from "./producto-descuento-exclusivo-tipo.model";

export interface ProductodDescuentoExclusivo {
  id: number;
  productoId: string;
  descuento: number;
  activo: boolean;
  fechaInicio: Date;
  fechaFin:Date;
  fechaAgrega:Date;
  productoDescuentoExclusivoTipo: ProductoDescuentoExclusivoTipo
}
