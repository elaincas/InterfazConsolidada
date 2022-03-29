export class PosponerPedidosRecompra {
    constructor(
        public UsuarioId: number,
        public ProductosId: string[],
        public NuevaFechaDeProximoPedido: Date,
        public Observaciones: string
    ) { }
}
