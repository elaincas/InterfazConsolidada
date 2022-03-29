import { TipoRespuestaServidorEstandar } from "./tipoRespuestaServidor.core.standar";

export class RespuestaEstandar<T>{
  public data: T;
  public mensaje: string;
  public ok: boolean;
  public respuestaTipo: TipoRespuestaServidorEstandar
}

export class Data<T>{
  public data: T;
  public mensaje: string;
  public respuestaTipo: TipoRespuestaServidorEstandar;
}
