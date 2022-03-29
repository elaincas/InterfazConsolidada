import { Requisito } from './requisito.model';
import { Laboratorio } from './laboratorio.model';
export class AnalisisRequisito {
  public id: number;
  public prodId: string;
  public requisitoId: number;
  public requisito: Requisito;
  public laboratorioId: number;
  public laboratorio: Laboratorio;
  public activo: boolean;
  public editado: boolean;
  public nuevo: boolean;
  public fechaAgrega: Date;
  constructor(){
    this.activo = true;
    this.fechaAgrega = new Date();
    this.editado = false;
    this.nuevo = false;
  }
}
