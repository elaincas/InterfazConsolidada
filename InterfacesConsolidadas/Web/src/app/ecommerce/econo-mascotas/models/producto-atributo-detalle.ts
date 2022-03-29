export interface IProductoAtributoDetalle {
    id: number;
    productoId: string;
    productoAtributoId: number;
    productoAtributoValorId: number;
    valor: string;
    usuarioAgregaId: number;
 
}

export class ProductoAtributoDetalle implements  IProductoAtributoDetalle {
    id: number;
    productoId: string;
    productoAtributoId: number;
    productoAtributoValorId: number;
    valor: string;
    usuarioAgregaId: number; 
}
