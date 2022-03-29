import { ReporteClienteSuscritoDetalle } from "./reporteClienteSuscritoDetalle.modal";

export interface ReporteClienteSuscrito {
  usuarioId: number;
  identidad: string;
  nombreCliente: string;
  celular: string;
  total: number;
  detalle: ReporteClienteSuscritoDetalle[];
}
