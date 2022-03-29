export interface StickerProductoPremio {
  id: number;
  productoId: string;
  descripcionProducto: string;
  monto: number | null;
  activo: boolean | null;
  usuarioAgregaId: number;
  fechaAgrega: string;
  usuarioModificaId: number | null;
  fechaModifica: string | null;
}
