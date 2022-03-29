export interface IProductoAtributo {
        id: number;
        descripcion: string;
        activo: boolean;
    }
export class ProductoAtributo implements IProductoAtributo {
    id: number;
    descripcion: string;
    activo: boolean;
}