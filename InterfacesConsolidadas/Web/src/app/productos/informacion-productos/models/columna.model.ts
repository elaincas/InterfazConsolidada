export interface Columna {
  id: number;
  informacionSeccionProductoId: number;
  descripcionColumna: string;
  descripcionInicial: string;
  orden: number;
  activo: boolean;
  usuarioAgregaId: number;
  fechaAgrega: string;
  usuarioModificaId: number | null;
  fechaModifica: string | null;
}
