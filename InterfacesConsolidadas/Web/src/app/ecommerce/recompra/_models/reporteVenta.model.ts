export interface ReporteVenta {
  pedidoId: number;
  facturaId: number;
  horaFactura: Date;
  totalFactura: number;
  tipoPedidoId: number;
  tipoPedido: string;
  sucursalId: number;
  sucursal: string;
  nombreCliente: string;
  identidad: string;
  totalNC:number;
}
