import { Forms } from "../../../helpers/forms"
import { ACTipoRespuesta } from "../enums/TipoRespuesta"

export class RespuestaModal<X>{
  public data: X
  public modo: Forms.Modo
  public tipo: ACTipoRespuesta
}
