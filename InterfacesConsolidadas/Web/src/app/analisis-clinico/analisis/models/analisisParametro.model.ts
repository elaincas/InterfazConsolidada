import { Parametro } from "./parametro.model";

export class AnalisisParametro{
  public id: number;
  public prodId: string;
  public parametroId: number;
  public parametro: Parametro;
  public activo: boolean;
  public fechaAgrega: Date;
  public editado: boolean;
  public nuevo: boolean;
  constructor(){
    this.activo = true;
    this.fechaAgrega = new Date();
    this.editado = false;
    this.nuevo = false;
  }
}
