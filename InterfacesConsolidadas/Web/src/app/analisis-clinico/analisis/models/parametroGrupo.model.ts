export class ParametroGrupo{
  public id: number;
  public nombre: string;
  public activo: boolean;
  public fechaAgrega: Date;
  constructor(){
    this.activo = true;
    this.fechaAgrega = new Date();
  }
}
