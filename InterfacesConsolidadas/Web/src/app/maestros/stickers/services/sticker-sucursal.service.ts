import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { HttpAuthService } from "../../../helpers/http/http-auth.service";
import { Respuesta } from "../helpers/respuestav2";
import { StickerConfiguracionSucursal } from "../models/stickerSucursal.model";

@Injectable()
export class StickerSucursalService {
  constructor(private httpAuth: HttpAuthService) {}

  obtenerTodosLosStickersSucursales(): Observable<
    Respuesta<StickerConfiguracionSucursal[]>
  > {
    const uri = `${environment.stickersApi}/api/StickerSucursal/ObtenerTodasLosStickersSucursales`;
    return this.httpAuth.get(uri).map((respuesta) => {
      return respuesta.json();
    });
  }

  obtenerStickersSucursalesPorStickerId(
    stickerId: number
  ): Observable<Respuesta<StickerConfiguracionSucursal[]>> {
    const uri = `${environment.stickersApi}/api/StickerSucursal/ObtenerSucursalesDeSticker?stickerConfiguracionId=${stickerId}`;
    return this.httpAuth.get(uri).map((respuesta) => {
      return respuesta.json();
    });
  }

  guardar(dto): Observable<Respuesta<StickerConfiguracionSucursal>> {
    const uri = `${environment.stickersApi}/api/StickerSucursal/CrearSucursalSticker`;
    return this.httpAuth.post(uri, dto).map((x) => x.json());
  }

  editar(dto): Observable<Respuesta<StickerConfiguracionSucursal>> {
    const uri = `${environment.stickersApi}/api/StickerSucursal/ActualizarStickerConfiguracionSucursal`;
    return this.httpAuth.put(uri, dto).map((x) => x.json());
  }

  inactivar(id: number, usuarioModificaId: number): Observable<Respuesta<boolean>> {
    return this.httpAuth
      .post(
        `${environment.stickersApi}/api/StickerSucursal/inactivar/${id}?usuarioModificaId=${usuarioModificaId}`,
        null
      )
      .map((x) => x.json());
  }

  activar(id: number, usuarioModificaId: number): Observable<Respuesta<boolean>> {
    return this.httpAuth
      .post(`${environment.stickersApi}/api/StickerSucursal/activar/${id}?usuarioModificaId=${usuarioModificaId}`, null)
      .map((x) => x.json());
  }
}
