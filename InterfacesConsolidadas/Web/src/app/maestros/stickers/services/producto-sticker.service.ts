import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { HttpAuthService } from "../../../helpers/http/http-auth.service";
import { Lookup } from "../../../productos/informacion-productos/models/lookup.model";
import { Respuesta } from "../helpers/respuestav2";

@Injectable()
export class ProductoStickerService {
  constructor(private httpAuth: HttpAuthService) {}

  obtenerLookupStickerProductos(
    stickerId: number
  ): Observable<Respuesta<Lookup[]>> {
    const uri = `${environment.stickersApi}/api/StickerProductos/ObtenerLookupProductosDeSticker?stickerConfiguracionId=${stickerId}`;
    return this.httpAuth.get(uri).map((respuesta) => {
      return respuesta.json();
    });
  }

  inactivar(id: number, usuarioModificaId: number): Observable<Respuesta<boolean>> {
    return this.httpAuth
      .post(
        `${environment.stickersApi}/api/StickerProductos/inactivar/${id}?usuarioModificaId=${usuarioModificaId}`,
        null
      )
      .map((x) => x.json());
  }

  activar(id: number, usuarioModificaId: number): Observable<Respuesta<boolean>> {
    return this.httpAuth
      .post(
        `${environment.stickersApi}/api/StickerProductos/activar/${id}?usuarioModificaId=${usuarioModificaId}`,
        null
      )
      .map((x) => x.json());
  }
}
