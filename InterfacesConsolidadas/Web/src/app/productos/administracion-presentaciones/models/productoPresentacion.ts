export class ProductoPresentacion {
    id: number;
    productoId: string;
    producto: Producto;
    presentacionProductoId: string;
    presentacionProducto: Producto;
    productoAtributoId: string;
    productoAtributo: ProductoAtributo;
    fechaAgrega: Date;
    usuarioAgregaId: string;
}

export class ProductoPresentaciones {
    productoId: string;
    producto: Producto;
    presentaciones: ProductoPresentacion[];

    constructor(){
        this.presentaciones = new Array<ProductoPresentacion>();
    }
}

export class Producto {
    id: string;
    nombre: string;
    descripcion: string;
}

export class ProductoAtributo {
    id: number;
    descripcion: string;
}