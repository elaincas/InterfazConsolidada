export interface IProductoAtributoRow  {
    id: number;
    productoId: string;
    producto: string;
    productoAtributo: string;
    productoAtributoValor: string;
    valor: string;
    fechaAgrega: Date | string;
}


export class ProductoAtributoRow implements IProductoAtributoRow {
    id: number;
    productoId: string;
    producto: string;
    productoAtributo: string;
    productoAtributoValor: string;
    valor: string;
    fechaAgrega: string | Date;
}
