export class GenerarPedidosRecompra {
    constructor(
        public UsuarioAGenerarPedido: number,
        public PedidosRecompra: any[],
        public TipoGeneracionPedido: number = 1
    ) { }
    // toJSON(): string {
    //   const objeto = {
    //     productoId: this.productoId,
    //     orden: this.orden,
    //     fechaInicioActivo: this.fechaInicioActivo,
    //     fechaFinActivo: this.fechaFinActivo
    //   };
    //   return JSON.stringify(objeto);
    // }
}