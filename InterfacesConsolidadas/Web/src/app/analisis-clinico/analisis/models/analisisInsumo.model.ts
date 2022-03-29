import { Insumo } from "./insumo.model";

export class AnalisisInsumo{
  public id: number;
  public analisisProdId: string;
  public insumoId: string;
  public insumo: Insumo;
  public cantidad: number;
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
