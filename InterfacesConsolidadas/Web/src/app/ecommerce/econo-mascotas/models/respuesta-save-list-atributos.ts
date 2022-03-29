import { ProductoAtributoDetalle } from "./producto-atributo-detalle";

export interface IRespuestaSaveListAtributos {
    productoAtributoDetalles: ProductoAtributoDetalle[];
    message: string;
}


export class RespuestaSaveListAtributos implements IRespuestaSaveListAtributos {
    productoAtributoDetalles: ProductoAtributoDetalle[];
    message: string;
}
