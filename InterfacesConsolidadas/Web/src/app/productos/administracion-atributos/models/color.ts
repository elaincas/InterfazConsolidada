export class Color {
  constructor(
    public nombre: string = '',
    public hEX: string = '#0058A8',
    public rGB: string = ''
  ) {}
  toJSON(): string {
    const color = {
      nombre: this.nombre,
      hEX: this.hEX,
      rGB: this.rGB
    };
    return JSON.stringify(color);
  }
}
