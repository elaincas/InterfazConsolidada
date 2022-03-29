export interface PedidoTipoValido {
  esCorrecto: Boolean;
  mensajes: Mensajes[];
}
interface Mensajes {
  pregunta: string;
  tipoPedido: string;
  id: number;
} 