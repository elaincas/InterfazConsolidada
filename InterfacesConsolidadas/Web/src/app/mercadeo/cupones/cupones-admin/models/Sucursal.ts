export class Sucursal {
  constructor (
    public codigo: number = 0,
    public nombre: string = ''
  ) {}
  toJSON(): string {
    const objeto = {
      Codigo: this.codigo,
      Nombre: this.nombre
    };
    return JSON.stringify(objeto);
  }
}
