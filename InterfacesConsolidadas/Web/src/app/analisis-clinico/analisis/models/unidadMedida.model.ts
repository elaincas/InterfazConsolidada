export class UnidadDeMedida{
  public id: number;
  public nombre: string;
  public abreviacion: string;
  public activo: boolean;
  public fechaAgrega: Date;
  constructor(){
    this.activo = true;
    this.fechaAgrega = new Date();
  }
}
