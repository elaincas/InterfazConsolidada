import { ConfiguracionPedidoUI } from "./configuracion-pedido.model";

export class ConfiguracionPedidoUIDetalle {
    /**
     *
     */
    constructor(
        public Id: number = 0,
        public ConfiguracionPedidoUIId: number = 0,
        public ConfiguracionPedidoUIDto: ConfiguracionPedidoUI = new ConfiguracionPedidoUI(),
        public TiempoDuracionProducto: number = 0,
        public LimiteMaximoUnidades: number = 0,
        public EsPedidoProductoObligatorio: boolean = false,
        public ProductoId: string = "",
        public Activo: boolean = false,
        public productoDescripcion : string = ""
    ) {

    }
}