export enum RespuestaTipo {
  Ok = 0,
  Validacion = 1,
  Error = 2,
}

export interface Respuesta<T> {
  ok: boolean;
  respuestaTipo: RespuestaTipo;
  mensaje: string;
  data: T;
}
