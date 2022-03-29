export interface IAgente {
        Id: string;
        Nombre: string;
        Identidad: string;
        EmpleadoId: number;
        CelularClaro: number;
        CelularTigo: number;
        CelularPersonalTigo: number;
        CelularPersonalClaro: number;

    }


export class Agente implements IAgente {
  Id: string;
  Nombre: string;
  Identidad: string;
  EmpleadoId: number;
  CelularClaro: number;
  CelularTigo: number;
  CelularPersonalTigo: number;
  CelularPersonalClaro: number;


  public get TelefonoValido() : number {
    if(this.CelularClaro!=0  ){
      return this.CelularClaro;

    }
    if(this.CelularTigo!=0  ){
      return this.CelularClaro;

    }
    if(this.CelularPersonalTigo!=0  ){
      return this.CelularClaro;

    }
    if(this.CelularPersonalTigo!=0  ){
      return this.CelularPersonalClaro;

    }
  }
 public set TelefonoValido(value:number){}

}
