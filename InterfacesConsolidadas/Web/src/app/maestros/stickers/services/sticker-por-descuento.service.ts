import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { HttpAuthService } from "../../../helpers/http/http-auth.service";
import { Respuesta } from "../helpers/respuestav2";
import { StickerPorDescuento } from "../models/stickersPorDescuento.model";

@Injectable()
export class StickersPorDescuentosService {
  constructor(private httpAuth: HttpAuthService) {}

  obtenerStickerClientesCanjesTipos(): Observable<Respuesta<StickerPorDescuento[]>> {
    const uri = `${environment.stickersApi}/api/StickersPorDescuentos/ObtenerStickersPorDescuentos`;
    return this.httpAuth.get(uri).map((respuesta) => {
      return respuesta.json();
    });
  }

  guardar(dto): Observable<Respuesta<StickerPorDescuento>> {
    const uri = `${environment.stickersApi}/api/StickersPorDescuentos/Crear`;
    return this.httpAuth.post(uri, dto).map((x) => x.json());
  }

  editar(dto): Observable<Respuesta<StickerPorDescuento>> {
    const uri = `${environment.stickersApi}/api/StickersPorDescuentos/Modificar`;
    return this.httpAuth.put(uri, dto).map((x) => x.json());
  }

  inactivar(id: number, usuarioModificaId: number): Observable<Respuesta<boolean>> {
    return this.httpAuth
      .post(
        `${environment.stickersApi}/api/StickersPorDescuentos/inactivar/${id}?usuarioModificaId=${usuarioModificaId}`,
        null
      )
      .map((x) => x.json());
  }

  activar(id: number, usuarioModificaId: number): Observable<Respuesta<boolean>> {
    return this.httpAuth
      .post(`${environment.stickersApi}/api/StickersPorDescuentos/activar/${id}?usuarioModificaId=${usuarioModificaId}`, null)
      .map((x) => x.json());
  }
}
