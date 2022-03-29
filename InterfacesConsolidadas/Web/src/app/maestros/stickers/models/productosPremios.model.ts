import { StickerProductoPremio } from "./productoPremio.model";
import { StickerConfiguracionProducto } from "./stickerConfiguracionProducto.model";

export interface StickerConfiguracionProductoPremio {
  id: number;
  stickerProductoPremioId: number;
  stickerConfiguracionId: number;
  activo: boolean | null;
  usuarioAgregaId: number;
  fechaAgrega: string;
  usuarioModificaId: number | null;
  fechaModifica: string | null;
  stickerConfiguracionProducto: StickerConfiguracionProducto;
  stickerProductoPremio: StickerProductoPremio;
}
