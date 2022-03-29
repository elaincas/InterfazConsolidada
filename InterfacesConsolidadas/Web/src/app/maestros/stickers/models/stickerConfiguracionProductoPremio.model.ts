export interface StickerConfiguracionProductoPremio {
  id: number;
  stickerProductoPremioId: number;
  stickerConfiguracionProductoId: number;
  activo: boolean | null;
  usuarioAgregaId: number;
  fechaAgrega: string;
  usuarioModificaId: number | null;
  fechaModifica: string | null;
}
