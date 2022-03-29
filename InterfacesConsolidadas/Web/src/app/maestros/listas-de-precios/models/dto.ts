export class ListaPreciosProductoDto {
    Id: number;
    ProductoId: string;
    Productos: string[];
    ListaId: number;
    UsuarioCreaId: number;
    ProductoNombre: string;
    PrecioPublico: number;
    PrecioFinal: number;
    Activo: boolean;
}

export class ListaPreciosDto {
    id: number;
    UsuarioCreaId: number;
    Descripcion: string;
    Activo: boolean;
    Productos: ListaPreciosProductoDto[];
}

export class ProductoAgregadoGrid {
    public productoId: string;
}
