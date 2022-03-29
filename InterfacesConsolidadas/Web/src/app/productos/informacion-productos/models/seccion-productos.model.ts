import { InformacionSeccionProductoDetalle } from "./seccion-producto-detalle.model";
import { ProductoInformacionSeccion } from "./seccion.model";

export interface ProductoInformacionSeccionProductos {
  id: number;
  productoId: string;
  productoInformacionSeccionId: number;
  seccionDescripcion: string;
  productoDescripcion: string;
  activo: boolean;
  usuarioAgregaId: number;
  fechaAgrega: string;
  usuarioModificaId: number | null;
  producto: string;
  informacionSeccionProductoDetalles: InformacionSeccionProductoDetalle[];
  productoInformacionSeccion: ProductoInformacionSeccion
}
