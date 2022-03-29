import { TrasladosEnviados } from "./TrasladosEnviados";

export interface IInformacionEntregaRegalia {
    Id: number;
    SalidaInventarioTrasladoId: number;
    AgenteId: string;
    Nombre: string;
    Identidad: string;
    Cantidad: number;
    Telefono: string;
    FechaEntrega: Date | string;
    ImagenUrl: string;
    ImagenBase64:string;
    ImagenName:string;
}

export class InformacionEntregaRegalia implements IInformacionEntregaRegalia{
  ImagenName: string;
  ImagenBase64: string;
  Id: number;
  SalidaInventarioTrasladoId: number;
  AgenteId: string;
  Nombre: string;
  Identidad: string;
  Cantidad: number;
  Telefono: string;
  FechaEntrega: string | Date;
  ImagenUrl: string;
  EsValidaInformacion:boolean=false
}
