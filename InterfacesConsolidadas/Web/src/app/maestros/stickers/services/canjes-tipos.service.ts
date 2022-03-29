import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { HttpAuthService } from "../../../helpers/http/http-auth.service";
import { Respuesta } from "../helpers/respuestav2";
import { StickerClienteCanjeTipo } from "../models/canjesTipos.model";

@Injectable()
export class CanjesTiposService {
  constructor(private httpAuth: HttpAuthService) {}

  obtenerStickerClientesCanjesTipos(): Observable<
    Respuesta<StickerClienteCanjeTipo[]>
  > {
    const uri = `${environment.stickersApi}/api/StickerClienteCanjeTipo/ObtenerStickerClientesCanjesTipos`;
    return this.httpAuth.get(uri).map((respuesta) => {
      return respuesta.json();
    });
  }

  guardar(dto): Observable<Respuesta<StickerClienteCanjeTipo>> {
    const uri = `${environment.stickersApi}/api/StickerClienteCanjeTipo/Crear`;
    return this.httpAuth.post(uri, dto).map((x) => x.json());
  }

  editar(dto): Observable<Respuesta<StickerClienteCanjeTipo>> {
    const uri = `${environment.stickersApi}/api/StickerClienteCanjeTipo/Modificar`;
    return this.httpAuth.put(uri, dto).map((x) => x.json());
  }

  inactivar(
    id: number,
    usuarioModificaId: number
  ): Observable<Respuesta<boolean>> {
    return this.httpAuth
      .post(
        `${environment.stickersApi}/api/StickerClienteCanjeTipo/inactivar/${id}?usuarioModificaId=${usuarioModificaId}`,
        null
      )
      .map((x) => x.json());
  }

  activar(
    id: number,
    usuarioModificaId: number
  ): Observable<Respuesta<boolean>> {
    return this.httpAuth
      .post(
        `${environment.stickersApi}/api/StickerClienteCanjeTipo/activar/${id}?usuarioModificaId=${usuarioModificaId}`,
        null
      )
      .map((x) => x.json());
  }
}
