import { ProcesoBloqueoConfiguracion } from './UsuarioProcesoBloqueoConfiguracion';

export interface UsuarioAtributoBloqueoConfiguracionRequest {
  usuarioId: number;
  usuarioAtributoId: number;
  valor: string;
  procesosId: number[];
}

export interface AtributoProcesosBloqueo {
  usuarioAtributoBloqueoConfiguracionId: number;
  atributoId: number;
  atributo: string;
  valor: string;
  fecha: Date;
  esActivo: boolean;
  procesos: ProcesoBloqueoConfiguracion[];
}
