export class Cupon {
  constructor(
    public cuponID: number = 0,
    public descripcion: string = '',
    public rangoInicio: number = 1,
    public rangoFin: number = 1,
    public fechaInicio: Date = new Date,
    public fechaFin: Date = new Date,
    public factorPuntosExtra: number = 0,
    public soloMedicamentos: boolean = false,
    public tieneLimiteMontoEnFactura: boolean = false,
    public montoMinimoFactura: number = 0,
    public montoMaximoFactura: number = 0,
    public activo: boolean = false,
    public fechaCrea: Date = new Date,
    public usuarioId: number = 0,
    public todasLasSucursales: boolean = false
  ) { }
  toJson(): string {
    const objeto = {
      CuponID: this.cuponID,
      Descripcion: this.descripcion,
      RangoInicio: this.rangoInicio,
      RangoFin: this.rangoFin,
      FechaInicio: this.fechaInicio,
      FechaFin: this.fechaFin,
      FactorPuntosExtra: this.factorPuntosExtra,
      SoloMedicamentos: this.soloMedicamentos,
      TieneLimiteMontoEnFactura: this.tieneLimiteMontoEnFactura,
      MontoMinimoFactura: this.montoMinimoFactura,
      MontoMaximoFactura: this.montoMaximoFactura,
      Activo: this.activo,
      FechaCrea: this.fechaCrea,
      UsuarioCrea: this.usuarioId,
      TodasLasSucursales: this.todasLasSucursales
    };
    return JSON.stringify(objeto);
  }
}
