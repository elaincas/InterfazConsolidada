export class PoliticaProveedor {
    Id: number;
    Descripcion: string;
    DistribuidorId: string;
    ProveedorId: string;
    MesesAceptaVencidos: number;
    UsuarioAgrega: number;
    FechaAgrega: Date = new Date();
    Activo: boolean = true;
}

export class PoliticaProveedorDto{
    Identificador: string;
    Nombre: string;
    TotalPoliticas: number;
    DistribuidorPoliticasVencidosPorProveedor: DistribuidorPoliticaPorProveedorDto[];
}


export class DistribuidorPoliticaPorProveedorDto {
    Identificador: number;
    Descripcion: string;
    EtiquetaDistribuidor: {
        identificador: string;
        nombre: string;
    };
    MesesVencidos: number;
    Indicador: string;
}

export class Distribuidores{
    identificador: number;
    nombre: string;
}