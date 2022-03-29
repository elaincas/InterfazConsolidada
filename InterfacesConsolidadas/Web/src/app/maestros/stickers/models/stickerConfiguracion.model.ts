import { StickerTipos } from "./srickerTipo.enum";
import { StickerConfiguracionProducto } from "./stickerConfiguracionProducto.model";
import { StickerConfiguracionImagen } from "./stickerImagen";
import { StickersTiposDeCanje } from "./stickersTiposDeCanje.enum";
import { StickerConfiguracionSucursal } from "./stickerSucursal.model";

export interface StickerConfiguracion {
  id: number;
  descripcion: string;
  productoId: string;
  descripcionProducto: string;
  montoSticker: number | null;
  montoRequisitoEntrega: number | null;
  aplicaParaTodasLasSucursales: boolean;
  esDigital: boolean;
  activo: boolean | null;
  usuarioAgregaId: number;
  fechaAgrega: string;
  usuarioModificaId: number | null;
  fechaModifica: string | null;
  fechaInicio: Date;
  fechaFin: Date;
  stickerTipoId: StickerTipos;
  stickerClienteCanjeTipoId: StickersTiposDeCanje;
  descripcionCanjeTipo: string;
  stickerTipoDescripcion: string;
  imagenes: StickerConfiguracionImagen[];
  productosDisponiblesParaCanje: StickerConfiguracionProducto[];
  sucursalesAplica: StickerConfiguracionSucursal[];
}
