import { RespuestaConfiguracionTipo } from "../enums/respuestaConfiguracionTipo";
import { Operador } from "./operadores.model";
import { ProductoRecargaConfigurado } from "./productoRecargaConfigurado.model";

export class RespuestaConfiguracionRecarga {
  public dataRecarga: ProductoRecargaConfigurado;
  public respuestaTipo: RespuestaConfiguracionTipo.Tipo;
  public resultadoValidacionRecarga: ResultadoValidacionRecarga;
}

export class ResultadoValidacionRecarga {
  public operadores: Operador[];
  public esRecargaConfigurada: boolean;
  public mensajeValidacion: string[];
  public configuradaConMasDeUnOperador: boolean;
  public valido: boolean;

}
