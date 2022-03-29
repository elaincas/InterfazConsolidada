export class Categoria {
  public id: number;
  public descripcion:string;
  public fechaAgrega:Date;
  public activo:boolean;
  constructor(){
    this.activo = true;
    this.fechaAgrega = new Date();
  }
}
