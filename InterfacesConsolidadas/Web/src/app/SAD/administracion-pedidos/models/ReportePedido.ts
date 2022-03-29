import { Conserje } from "../../Conserjes/Administrar-Conserjes/models/Conserje";

export class ReportePedido {
  constructor(
    public pedidoID: number = 0,
    public facturaId: number = 0,
    public fechaFactura: Date = null,
    public usuarioAsignadoID: number = 0,
    public conserje: Conserje = null,
    public sucursalId: number = 0,
    public fechaCrea: Date = null,
    public fechaDeRecepcionPorCliente: Date = null,
    public agenteCreaId: number = 0,
    public latitudFacturaRecibida: number = 0,
    public longitudFacturaRecibida: number = 0,
    public usuarioRecibeID: number = 0,
    public indicacionesDeEntrega: string = "",
    public ObservacionPedidoWeb: string = "",
    public estadoPedidoID: number = 0,
    public estadoPedido: EstadoPedido = null,
    public activo: number = 0,
    public noIdentidad: string = "",
    public cliente: DatosPersonalesCliente = null,
    public rutaImagenFirmaDeRecepcion: string[] = [],
    public colonia: string = "",
    public telefono: string = "",
    public direccionId: number = 0,
    public pagadoEnLinea: number = 0,
    public codigoPedido: string = "",
    public subTotal: number = 0,
    public totalDescuento: number = 0,
    public totalImpuestoVenta: number = 0,
    public totalImpuestoSelectivo: number = 0,
    public total: number = 0,
    public totalDescuentoPorPuntos: number = 0,
    public detalle: PedidoProductoDetalle[] = [],
  ) {
  }
}

export interface PedidoProductoDetalle {
  pedidoDetalleID: number;
  pedidoID: number;
  prodID: string;
  prodDescripcion: string;
  cantidad: number;
  precioPublico: number;
  descAplicado: number;
  total: number;
  totalFacturado: number;
  imagenUrl: string;
}

export interface EstadoPedido {
  estadoPedidoID: number;
  descripcion: number;
}

export interface DatosPersonalesCliente {
  noIdentidad: string;
  nombre: string;
  celular: string;
  sexo: string;
  email: string;
  direccion: string;
  colonia: string;
  ciudad: string;
}

export interface Sucursal {
  codigo  : number;
  nombrePublico: string;
  direccion: string;
}

export class Tooltip {
  isShown: boolean;
  text: string;
}

export class Marker {
  location: any;
  tooltip: Tooltip;
}

export interface FiltrosConjerje{
  id?: number;
  nombre: string;
  codigoVhur?: number;
}