export interface UsuarioProcesoBloqueoConfiguracionRequest {
  atributoBloqueoId: number;
  procesoId: number;
}

export interface ProcesoBloqueoConfiguracion {
  usuarioProcesoBloqueoConfiguracionId: number;
  procesoId: number;
  proceso: string;
  descripcion: string;
  fecha: Date;
  esActivo: boolean;
}
