import {BannerDetalle} from './BannerDetalle';

export class Banner {
  constructor(
    public bannerID: number = 0,
    public paginaPosicionID: number = 0,
    public dimensionX: number = 0,
    public dimensionY: number = 0,
    public cantidadMaxima: number = 0,
    public bannerDetale: BannerDetalle[],
    public esVersionMovil: boolean
  ) {
  }
}
