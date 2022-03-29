export interface PedidoProductoDetalle {
  pedidoReorderId: number;
  productoReorderId: number;
  productoId: string;
  prod_Desc: string;
  observaciones: string;
  fechaDebeRealizarsePedido: Date;
  horaPrefiereEntrega: Date;
  tipoDePago: string;
  pedidoRealizado: boolean;
}
