import { ProductoInformacionSeccionesTipo } from "./secciones-tipo.model";
import { ProductoInformacion } from "./producto-informacion.model";

export interface ProductoInformacionSeccion {
  id: number;
  descripcion: string;
  titulo: string;
  productoInformacionId: number;
  activo: boolean;
  usuarioAgregaId: number;
  usuarioModificaId: number | null;
  fechaAgrega: string;
  productoInformacionSeccionTipoId: ProductoInformacionSeccionesTipo;
  productoInformacion: ProductoInformacion;
}
