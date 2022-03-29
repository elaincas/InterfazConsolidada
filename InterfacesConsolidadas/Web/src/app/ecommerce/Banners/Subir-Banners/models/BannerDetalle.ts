export class BannerDetalle {
  constructor(
    public bannerDetalleId: number = 0,
    public bannerId: number = 0,
    public banner: any = '',
    public rutaBanner: any[] = [],
    public fechaInicio_Visible: Date = new Date,
    public fechaFin_Visible: Date = new Date,
    public posicion: number = 1,
    public usuarioAgrega: number = 0,
    public keyName: string = '',
    public filePath: string = '',
    public contentType: string = '',
    public carpeta: string = '',
    public dimensionX: number = 0,
    public dimensionY: number = 0,
    public paginaId: number = 0,
    public posicionId: number = 0,
    public esVersionMovil: boolean = false,
    public nombreCorto: string = '',
    public tieneFechaFinalizacion: boolean = false,
    public enlace: string = '',
    public rutaImagen: string = '',
    public usuarioModifica: number = 0,
    public descripcion: string = '',

    public bannerTipo: number = 0,
    public esEnlaceDeLaPagina: boolean = false,
    public abrirEnlaceEnNuevaPestana: boolean = false,

    public empresaId: number = 0,
    public paisId: number = 0
  ) {  }
  toJson(): string {
    const objeto = {
      BannerDetalleId: this.bannerDetalleId,
      BannerId: this.bannerId,
      FechaInicio_Visible: this.fechaInicio_Visible,
      FechaFin_Visible: this.fechaFin_Visible,
      Posicion: this.posicion,
      UsuarioAgrega: this.usuarioAgrega,
      KeyName: this.keyName,
      FilePath: this.filePath,
      ContentType: this.contentType,
      Carpeta: this.carpeta,
      DimensionX: this.dimensionX,
      DimensionY: this.dimensionY,
      PaginaId: this.paginaId,
      PosicionId: this.posicionId,
      EsVersionMovil: this.esVersionMovil,
      NombreCorto: this.nombreCorto,
      TieneFechaFinalizacion : this.tieneFechaFinalizacion,
      Enlace: this.enlace,
      RutaImagen: this.rutaImagen,
      UsuarioModifica: this.usuarioModifica,
      Descripcion: this.descripcion,

      BannerTipo: this.bannerTipo,
      AbrirEnlaceEnNuevaPestaña: this.abrirEnlaceEnNuevaPestana,
      EsEnlaceDeLaPagina: this.esEnlaceDeLaPagina,
      EmpresaId: this.empresaId,
      PaisId: this.paisId

  };

    return JSON.stringify(objeto);
  }
}
