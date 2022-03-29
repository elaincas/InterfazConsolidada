export class Requisito{
  public id: number;
  public descripcion: string;
  public codigoExterno: string;
  public activo: boolean;
  public fechaAgrega: Date;
  constructor(){
    this.activo = true;
    this.fechaAgrega = new Date();
  }
}
