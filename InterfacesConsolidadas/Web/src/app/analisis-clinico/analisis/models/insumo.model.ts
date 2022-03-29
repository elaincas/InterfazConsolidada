export class Insumo{
  public prodId: string;
  public descripcion: string;
  public activo: boolean
  public fechaAgrega: Date;
  public cantidad: number;
  constructor(){
    this.activo = true;
    this.fechaAgrega = new Date();
  }
}
