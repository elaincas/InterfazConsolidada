export interface StickerConfiguracionSucursal {
  id: number;
  stickerConfiguracionId: number;
  stickerConfiguracionDescripcion: string;
  sucursalId: number | null;
  sucursalNombre: string | null;
  activo: boolean | null;
  usuarioAgregaId: number;
  fechaAgrega: string;
  usuarioModificaId: number | null;
  fechaModifica: string | null;
}
