export interface FilaDto {
  informacionSeccionProductoDetalleTablaId: number;
  numeroFila: number;
  columna: string;
  celda: string;
  usuarioAgregaId: number | null;
  fechaAgrega: string | null;
  usuarioModificaId: number | null;
  fechaModifica: string | null;
}
