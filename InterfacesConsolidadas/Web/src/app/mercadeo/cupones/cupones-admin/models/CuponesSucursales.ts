export class CuponesSucursales {
  constructor(
    public cuponSucursalId: number = 0,
    public cuponId: number = 0,
    public sucursalId: number = 0
  ) {}
  toJSON(): string {
    const objeto = {
      CuponSucursalId: this.cuponSucursalId,
      CuponId: this.cuponId,
      SucursalId: this.sucursalId
    };
    return JSON.stringify(objeto);
  }
}
