
import { IngredienteActivo } from "./ingredienteActivo";
import { Medida } from "./medida";
import { MedidaPeso } from "./medidaPeso";

export class IngredienteActivosProducto{
  productoId: string;
  ingredienteActivoId: number;
  ingredienteActivo: IngredienteActivo;
  cantidad:number;
  medidaPesoId: number;
  medidaPeso: MedidaPeso;
  activo: boolean;
  ingredientePrincipal: boolean;
}
