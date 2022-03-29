import { ParametroGrupo } from "./parametroGrupo.model";
import { ParametroRango } from "./parametroRango.model";
import { ResultadoTipo } from "./resultadoTipo.model";
import { UnidadDeMedida } from "./unidadMedida.model";

export class Parametro{
  public id: number;
  public nombre: string;
  public descripcion: string;
  public unidadDeMedidaId: number;
  public unidadDeMedida: UnidadDeMedida;
  public resultadoTipoId: number;
  public resultadoTipo: ResultadoTipo;
  public parametroGrupoId: number;
  public parametroGrupo: ParametroGrupo;
  public parametroRangos: ParametroRango[];
  public tituloGrafica: string;
  public activo: boolean;
  public fechaAgrega: Date;
  constructor(){
    this.activo = true;
    this.fechaAgrega = new Date();
  }
}
