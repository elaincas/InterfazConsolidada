export class AddProducto {
  constructor(
    public productoId: number = 0,
    public orden: number = 0,
    public fechaInicioActivo: Date = new Date(),
    public fechaFinActivo: Date = new Date()
  ) {}
  toJSON(): string {
    const objeto = {
      productoId: this.productoId,
      orden: this.orden,
      fechaInicioActivo: this.fechaInicioActivo,
      fechaFinActivo: this.fechaFinActivo
    };
    return JSON.stringify(objeto);
  }
}
