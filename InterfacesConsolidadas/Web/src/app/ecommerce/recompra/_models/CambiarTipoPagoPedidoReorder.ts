export class CambiarTipoPagoPedidoReorder {
  constructor(
    public ProductosReorderId: number[],
    public NuevoPagoTipo: PagoTipoEnum
  ) {}
}

export enum PagoTipoEnum {
  Efectivo = 1,
  TarjetaCredito = 2,
  EfectivoTarjeta = 3,
  PagoConTarjetaEnLinea = 4
}

export const tiposDePago = [
  { id: PagoTipoEnum.Efectivo, pago: 'Efectivo' },
  { id: PagoTipoEnum.TarjetaCredito, pago: 'Tarjeta de credito' },
  { id: PagoTipoEnum.EfectivoTarjeta, pago: 'Efectivo y tarjeta de credito' },
  { id: PagoTipoEnum.PagoConTarjetaEnLinea, pago: 'En linea' }
];
