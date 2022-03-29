export interface StickerClienteCanjeTipo {
  id: number;
  descripcion: string;
  codigo: string;
  stickersCantidad: number;
  descuento: number;
  activo: boolean | null;
  usuarioAgregaId: number;
  fechaAgrega: string | null;
  usuarioModificaId: number | null;
  fechaModifica: string | null;
}
