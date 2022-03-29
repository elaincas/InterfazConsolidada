export interface StickerConfiguracionImagen {
  id: number;
  stickerConfiguracionId: number;
  rutaUrl: string;
  esMovil: boolean;
  activo: boolean | null;
  usuarioAgregaId: number;
  fechaAgrega: string;
  usuarioModificaId: number | null;
  fechaModifica: string | null;
  fueEditado: boolean;
}
