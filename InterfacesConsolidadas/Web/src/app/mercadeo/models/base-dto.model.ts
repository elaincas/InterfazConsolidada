import { RespuestaTipo } from "../models/respuesta-tipo.model";

export class BaseDto{
    public usuarioId: number;
    public respuesta: string;
    public respuestaTipo: RespuestaTipo;
}