import { Injectable } from "@angular/core";

export enum TabStickerTipo {
  Sticker,
  StickerImagenes,
  ProductosStickers,
  SucursalesHabilitadas,
}

export class Tab<T> {
  id: number;
  text: string;
  icon: string;
  iconName: string;
  componente: T;
}

export const tabsSticker: Tab<TabStickerTipo>[] = [
  {
    id: 0,
    text: "Sticker",
    icon: "fa",
    iconName: "fa-sticky-note",
    componente: TabStickerTipo.Sticker,
  },
  {
    id: 1,
    text: "Imágenes del Sticker",
    icon: "material-icons",
    iconName: "image",
    componente: TabStickerTipo.StickerImagenes,
  },
  {
    id: 2,
    text: "Productos a Regalar Sticker",
    icon: "material-icons",
    iconName: "apps",
    componente: TabStickerTipo.ProductosStickers,
  },
  {
    id: 3,
    text: "Sucursales Habilitadas",
    icon: "material-icons",
    iconName: "store_mall_directory",
    componente: TabStickerTipo.SucursalesHabilitadas,
  },
];

@Injectable()
export class TabStickerService {
  obtenerStickerTabs(): Tab<TabStickerTipo>[] {
    return tabsSticker;
  }
}
