export interface IProductoAtributoValor {
    id: number;
    productoAtributoId: number;
    descripcion: string;
    activo: boolean;
}
export class ProductoAtributoValor implements IProductoAtributoValor {
    id: number;
    productoAtributoId: number;
    descripcion: string;
    activo: boolean;
}
