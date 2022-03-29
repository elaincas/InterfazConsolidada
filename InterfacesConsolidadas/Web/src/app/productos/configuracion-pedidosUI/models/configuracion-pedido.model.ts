
import { ConfiguracionPedidoUIDetalle } from "./configuracion-pedido-detalle.model";

export class ConfiguracionPedidoUI{
    /**
     *
     */
    constructor(
        public  Id : number = 0,
        public  SucursalId : number = 0,
        public  UsuarioId : number =0,
        public  FechaAgrega : Date = new Date,
        public  Activo : boolean = false,
        public ConfiguracionPedidoUIDetalle : ConfiguracionPedidoUIDetalle[] = []
    ) {
        
    }
}