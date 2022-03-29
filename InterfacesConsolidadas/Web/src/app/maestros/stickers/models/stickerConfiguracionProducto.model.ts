export interface StickerConfiguracionProducto {
  id: number;
  stickerConfiguracionId: number;
  stickerConfiguracionDescripcion: string;
  productoId: string;
  descripcionProducto: string;
  cantidadNecesaria: number;
  cantidadRegala: number;
  activo: boolean | null;
  usuarioAgregaId: number;
  fechaAgrega: string;
  usuarioModificaId: number | null;
  fechaModifica: string | null;
  fueEditado: boolean;
}
