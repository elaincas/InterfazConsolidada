export class PedidoInformacion {
  constructor(
    public facturaId: number,
    public cliente: string,
    public conserjeId: number,
    public conserje: string,
    public latitud: number,
    public longitud: number,
    public total: number,
    public tipoDeFactura: string
  ) { }
}

export interface IConserjeMap {
  id: string;
  nombre: string;
}
