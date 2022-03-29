export class CancelarPedidosRecompra {
    constructor(
        public UsuarioId: number,
        public ProductosId: string[],
        public observaciones: string
    ) { }
}