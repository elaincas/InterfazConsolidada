export class Conserje {
  constructor(
    public id: number = 0,
    public nombre: string = "",
    public celular: string = "",
    public estado: string = "",
    public codigoVhur: string = "",
    public rutaFotografia: string = "",
    public idUsuarioCrea: number = 0,
    public idUsuarioUltimaModificacion: number = 0,
    public nombreUsuarioSeguridadCorporativa: string = "",
    public ultimaLatitud: number = 0,
    public ultimaLongitud: number = 0,
    public ultimaUbicacionFecha: Date = new Date(),
    public cantidadPedidosSinEntregar: number = 0,
  ) {
  }
}

export interface FiltrosConjerje {
  id?: number;
  nombre: string;
  codigoVhur?: number;
  cargarUltimaUbicacion?: boolean;
  cargarPedidosPendientes?: boolean;
  fechaComienzo?: Date;
  fechaFin?: Date;
}
