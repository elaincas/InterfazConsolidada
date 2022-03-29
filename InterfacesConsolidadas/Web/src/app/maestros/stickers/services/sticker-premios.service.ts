import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { HttpAuthService } from "../../../helpers/http/http-auth.service";
import { Lookup } from "../../../productos/informacion-productos/models/lookup.model";
import { Respuesta } from "../helpers/respuestav2";
import { StickerConfiguracionProductoPremio } from "../models/productosPremios.model";

@Injectable()
export class StickerPremiosService {
  constructor(private httpAuth: HttpAuthService) {}

  obtenerTodosLosStickersProductos(): Observable<
    Respuesta<StickerConfiguracionProductoPremio[]>
  > {
    const uri = `${environment.stickersApi}/api/StickerConfiguracionProductosPremios/ObtenerConfiguracionProductosPremios`;
    return this.httpAuth.get(uri).map((respuesta) => {
      return respuesta.json();
    });
  }

  guardar(dto): Observable<Respuesta<StickerConfiguracionProductoPremio>> {
    const uri = `${environment.stickersApi}/api/StickerConfiguracionProductosPremios/Crear`;
    return this.httpAuth.post(uri, dto).map((x) => x.json());
  }

  editar(dto): Observable<Respuesta<StickerConfiguracionProductoPremio>> {
    const uri = `${environment.stickersApi}/api/StickerConfiguracionProductosPremios/Modificar`;
    return this.httpAuth.put(uri, dto).map((x) => x.json());
  }

  inactivar(
    id: number,
    usuarioModificaId: number
  ): Observable<Respuesta<boolean>> {
    return this.httpAuth
      .post(
        `${environment.stickersApi}/api/StickerConfiguracionProductosPremios/inactivar/${id}?usuarioModificaId=${usuarioModificaId}`,
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
        `${environment.stickersApi}/api/StickerConfiguracionProductosPremios/activar/${id}?usuarioModificaId=${usuarioModificaId}`,
        null
      )
      .map((x) => x.json());
  }
}
