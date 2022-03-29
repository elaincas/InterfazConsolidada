export interface InformacionSeccionProductoDetalle {
  id: number;
  informacionSeccionProductoId: number;
  valor: string;
  activo: boolean;
  usuarioAgregaId: number;
  fechaAgrega: string;
  usuarioModificaId: number | null;
  idTemp: number;
  fueEditado: boolean;
  visibleWeb: boolean | null;
}
