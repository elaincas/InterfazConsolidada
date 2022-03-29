export interface ReporteEncuesta {
  id: number;
  descripcion: string;
  imagenSatisfechoUrl: string;
  imagenInsatisfechoUrl: string;
  momentoEvaluar: string;
  totalRespuestas: number;
  totalSatisfecho: number;
  totalInsatisfecho: number;
  totalPorcentajeInsatisfecho: number;
  totalPorcentajeSatisfecho: number;
}

export interface ReporteEncuestaMap {
  id: number;
  descripcion: string;
  imagenSatisfechoUrl: string;
  imagenInsatisfechoUrl: string;
  momentoEvaluar: string;
  totalRespuestas: number;
  totalSatisfecho: number;
  totalInsatisfecho: number;
  totalPorcentajeInsatisfecho: string;
  totalPorcentajeSatisfecho: string;
}
