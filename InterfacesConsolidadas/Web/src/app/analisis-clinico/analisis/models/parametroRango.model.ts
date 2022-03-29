import { NivelResultado } from "./nivelResultado.model";
import { Parametro } from "./parametro.model";
import { ParametroGrupo } from "./parametroGrupo.model";

export class ParametroRango{
  public id: number;
  public parametroId: number;
  public descripcion: string;
  public valorMinimo: number;
  public valorMaximo: number;
  public grupoId: number;
  public parametroGrupo: ParametroGrupo;
  public edadMinima: number;
  public edadMaxima: number;
  public nivelResultadoId: number;
  public nivelResultado: NivelResultado;
  public editado: boolean;
  public activo: boolean;
  public fechaAgrega: Date;
  constructor(){
    this.editado = false;
    this.activo = true;
    this.fechaAgrega = new Date();
    this.valorMaximo = 0;
    this.valorMinimo = 0;
    this.edadMaxima = 0;
    this.edadMinima = 0;
  }
}
