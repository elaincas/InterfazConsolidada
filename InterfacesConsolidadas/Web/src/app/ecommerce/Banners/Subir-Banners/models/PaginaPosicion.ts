import {Banner} from './Banner';

export class PaginaPosicion {
  constructor(
    public paginaPosicionId: number = 0,
    public paginaId: number = 0,
    public descripcion: string = '',
    public activo: boolean = false,
    public fechaCrea: Date = new Date,
    public banners: any[] = [],
    public bannerTipo: number = 0,
    public nombreCorto: string = ''
  ) {  }
  toJson(): string {
    const objeto = {
      PaginaPosicionId: this.paginaPosicionId,
      PaginaId: this.paginaId,
      Descripcion: this.descripcion,
      Activo: this.activo,
      FechaCrea: this.fechaCrea,
      Banners: this.banners,
      BannerTipo: this.bannerTipo,
      NombreCorto: this.nombreCorto
    };
    return JSON.stringify(objeto);
  }
}
