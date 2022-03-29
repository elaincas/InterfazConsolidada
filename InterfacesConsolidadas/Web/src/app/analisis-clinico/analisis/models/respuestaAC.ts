import { ACTipoRespuesta } from "../enums/TipoRespuesta";

export class RespuestaAC<T>{
  public data: Data<T>;
  public mensaje: string;
  public ok: boolean;
  public respuestaTipo: ACTipoRespuesta
}

export class Data<T>{
  public data: T;
  public mensaje: string;
  public respuestaTipo: ACTipoRespuesta;
}
