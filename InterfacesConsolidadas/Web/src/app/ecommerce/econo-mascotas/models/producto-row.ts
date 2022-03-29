export interface IProductoRow {
    productoId: string;
    descripcion: string;
    atributos: number;
}

export class ProductoRow implements  IProductoRow {
    productoId: string;
    descripcion: string;
    atributos: number;
}
