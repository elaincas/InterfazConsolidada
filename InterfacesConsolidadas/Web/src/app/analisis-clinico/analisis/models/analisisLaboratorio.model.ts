import { Laboratorio } from "./laboratorio.model";

export class AnalisisLaboratorios{
  public id: number;
  public analisisProdId: string;
  public laboratorioId: number;
  public laboratorio: Laboratorio;
  public predeterminado: boolean;
  public costo: number;
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
