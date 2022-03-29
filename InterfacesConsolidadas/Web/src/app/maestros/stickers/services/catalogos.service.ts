import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { HttpAuthService } from "../../../helpers/http/http-auth.service";
import { Lookup } from "../../../productos/informacion-productos/models/lookup.model";
import { Respuesta } from "../helpers/respuestav2";
import { StickerTipo } from "../models/stickerTipo.model";

@Injectable()
export class CatalogosService {
  constructor(private httpAuth: HttpAuthService) {}

  obtenerStickerTipos(): Observable<Respuesta<StickerTipo[]>> {
    const uri = `${environment.stickersApi}/api/catalogos/ObtenerStickerTipos`;
    return this.httpAuth.get(uri).map((respuesta) => {
      return respuesta.json();
    });
  }

  obtenerTiposDeCanjesDeStickers(): Observable<Respuesta<Lookup[]>> {
    const uri = `${environment.stickersApi}/api/catalogos/ObtenerTiposDeCanjesDeStickers`;
    return this.httpAuth.get(uri).map((respuesta) => {
      return respuesta.json();
    });
  }
}
