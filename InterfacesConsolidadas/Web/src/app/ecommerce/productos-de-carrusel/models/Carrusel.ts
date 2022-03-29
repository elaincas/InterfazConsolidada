export class Carrusel {
  constructor(
    public carruselId: number = 0,
    public descripcion: string = '',
    public paginaId: number = 0,
    public enlace: string = '',
    public textoVerMas: string = '',
    public cantidadDeProductosVisiblesEnMovil: number = 0,
    public carruselTipoId: number = 0
  ) {}
}
