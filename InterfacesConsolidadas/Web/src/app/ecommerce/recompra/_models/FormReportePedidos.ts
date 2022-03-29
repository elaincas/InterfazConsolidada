import { Empresas } from "../../../shared/Empresas/enum-empresas";

export class FormReportePedidos {
  constructor(
    public usuarioId: number,
    public fechaPedido: Date,
    public pedidoReorderEstado: PedidoReorderEstadoEnum,
    public empresaId: Empresas
  ) { }
}

export enum PedidoReorderEstadoEnum {
  Todos = 0,
  SinConfirmar = 1,
  PospuestoPorUsuario = 2,
  CanceladoPorUsuario = 3,
  ConfirmadoEnCallCenter = 4,
  ConfirmadoPorSistema = 5,
  PospuestoEnCallcenter = 6,
  CanceladoEnCallcenter = 7
}

export enum PedidoTipoEnum{
  Todos = 0,
  RecogerEnSucursal = 1,
  ServicioADomicilio = 2,
}

export const listaPedidoReorderEstados = [
  {id: PedidoReorderEstadoEnum.Todos, nombre: 'Todos'},
  { id: PedidoReorderEstadoEnum.SinConfirmar, nombre: 'Sin confirmar' },
  { id: PedidoReorderEstadoEnum.PospuestoPorUsuario, nombre: 'Pospuesto por usuario' },
  { id: PedidoReorderEstadoEnum.CanceladoPorUsuario, nombre: 'Cancelado por usuario' },
  { id: PedidoReorderEstadoEnum.ConfirmadoEnCallCenter, nombre: 'Confirmado en call center' },
  { id: PedidoReorderEstadoEnum.PospuestoEnCallcenter, nombre: 'Pospuesto en call center' },
  { id: PedidoReorderEstadoEnum.CanceladoEnCallcenter, nombre: 'Cancelado en call center' },
  { id: PedidoReorderEstadoEnum.ConfirmadoPorSistema, nombre: 'Confirmado por sistema' }
];

export const listaPedidoTipos = [
  {id: PedidoTipoEnum.Todos, nombre: 'Todos'},
  {id: PedidoTipoEnum.RecogerEnSucursal, nombre: 'Recoger en sucursal'},
  {id: PedidoTipoEnum.ServicioADomicilio, nombre: 'Servicio a domicilio'}
];

