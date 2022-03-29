import { ReportePedido } from "../../../administracion-pedidos/models/ReportePedido";

export interface PedidoMetricasRespuesta {
  data: PedidoMetricas[],
  mensaje: string,
  respuestaTipo: number,
  ok: boolean
}

export interface PedidoMetricas {
  pedido: any,
  distanciaEnMetros: number,
  distancia: string,
  duracionEnSegundos: number
}