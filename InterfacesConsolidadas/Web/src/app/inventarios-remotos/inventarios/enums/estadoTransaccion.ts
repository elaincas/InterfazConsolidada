import { expr } from "jquery";

export enum EstadoTransaccion {
  Pendiente = 1,
  Recibido = 2,
  Denegado = 3,
  Devuelto = 4
}