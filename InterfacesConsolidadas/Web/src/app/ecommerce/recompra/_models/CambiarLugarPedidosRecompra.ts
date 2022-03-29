export class CambiarLugarPedidosRecompra {
    constructor(
        public UsuarioId: number,
        public ProductosId: string[],
        public LugarEntregaTipoNuevo: number,
        public LugarEntregaIdNuevo: number
        ) { }
}
