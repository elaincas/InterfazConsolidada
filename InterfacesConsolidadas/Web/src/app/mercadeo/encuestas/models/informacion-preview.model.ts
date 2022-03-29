import { TipoPregunta } from './tipoPregunta.model';

export interface InfomacionPreview {
      id: number,
      descripcion: string,
      imagenSatisfechoURL: string,
      imagenInsatisfechoURL: string,
      tipoPregunta: TipoPregunta,
      extremoInferiorTexto: string,
      extremoSuperiorTexto: string,
      fecha: Date
}
