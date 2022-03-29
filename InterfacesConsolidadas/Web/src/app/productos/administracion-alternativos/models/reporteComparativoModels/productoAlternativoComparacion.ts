import { Sucursal } from "../../../../maestros/colonias/models/sucursal.model";
import { Distribuidor } from "../../../administracion-precios/models/distribuidor.model";
import { Linea } from "../../../administracion-precios/models/linea.model";
import { Proveedor } from "../../../administracion-precios/models/proveedor.model";
import { IngredienteActivosProducto } from "./ingredienteActivoProducto";
import { Medida } from "./medida";
import { UnidadPresentacion } from "./unidadPresentacion";

export class ProductoAlternativoComparacion {
  id: string;
  nombre: string;
  medidaId: number;
  medida: Medida;
  distribuidorId: string;
  distribuidor: Distribuidor;
  proveedorId: string;
  proveedor: Proveedor;
  lienaId: string;
  linea:Linea;
  invActual: number;
  productoIngredientes: IngredienteActivosProducto[] = [];
  precioPublico: number;
  precioFinal:number;
  descuento:number;
  costo:number;
  cantidadPresentacion:number;
  unidadPresentacionId:number;
  unidadesPresentacion: UnidadPresentacion;
  datosSucursalPedido: Sucursal
}
