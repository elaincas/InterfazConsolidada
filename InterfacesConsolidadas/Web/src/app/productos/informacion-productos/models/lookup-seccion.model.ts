import { Lookup } from "./lookup.model";
import { ProductoInformacionSeccionesTipo } from "./secciones-tipo.model";

export interface LookupSeccion extends Lookup {
  seccionTipoId: ProductoInformacionSeccionesTipo
}
