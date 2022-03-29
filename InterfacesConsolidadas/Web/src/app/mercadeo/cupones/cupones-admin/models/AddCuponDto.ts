export interface AddCuponDto {
  descripcion: string,
  rangoInicio: number,
  rangoFin: number,
  fechaInicio: Date,
  fechaFin: Date,
  factorPuntosExtra: number,
  soloMedicamentos: boolean,
  tieneLimiteMontoEnFactura: boolean,
  montoMinimoFactura: number,
  montoMaximoFactura: number,
  activo: boolean,
  fechaCrea: Date,
  usuarioCrea: number,
  todasLasSucursales: boolean
}
