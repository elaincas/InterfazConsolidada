export class ResultadoTipo{
  public id: number;
  public descripcion: string;
  public activo: boolean;
  public fechaAgrega: Date;
  constructor(){
    this.activo = true;
    this.fechaAgrega = new Date();
  }
}
