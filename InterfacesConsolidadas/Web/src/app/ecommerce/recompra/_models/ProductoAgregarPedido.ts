import { Empresas } from "../../../shared/Empresas/enum-empresas";
import { PagoTipoEnum } from "./CambiarTipoPagoPedidoReorder";
export class ProductoAgregarPedido {
  constructor(
    public usuarioId: number,
    public productoId: string,
    public precio: number,
    public cantidad: number,
    public diasPeriodicidad: number,
    public direccionUsuarioId: number,
    public sucursalId: number,
    public tipoDePago: PagoTipoEnum,
    public tarjetaCreditoId: number,
    public recompraId: string,
    public empresaId: number = Empresas.Farmacia
  ) {}
}
