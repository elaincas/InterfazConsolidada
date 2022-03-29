import { PedidoInformacion } from "./PedidoInformacion";

export class PedidoMapMarker {
    constructor(
        public pedido: PedidoInformacion,
        public marker: google.maps.Marker
    ) {
    }
}