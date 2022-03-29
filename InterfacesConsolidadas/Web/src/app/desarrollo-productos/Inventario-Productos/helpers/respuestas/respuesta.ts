
export interface IRespuesta {
    Tipo: RespuestaTipo;
    Mensaje: string;
    Titulo: string;
}

export class Respuesta
    implements IRespuesta {
    Tipo: RespuestaTipo;
    Mensaje: string;
    Titulo: string;
    
    constructor(mensaje: string = "", tipo: RespuestaTipo = RespuestaTipo.Validacion) {
        this.Tipo = tipo;
        this.Mensaje = mensaje;
    }
}

export enum RespuestaTipo {
    Error = 1,
    Validacion = 2,
    ValidacionMenor = 3,
    Ok = 3
}
