export class Laboratorio {
  public id: number;
  public nombre: string
  public microbiologoValidaResultados: string
  public activo: boolean;
  public fechaAgrega: Date
  constructor(){
    this.activo = true;
    this.fechaAgrega = new Date();
  }
}
