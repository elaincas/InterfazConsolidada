import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpAuthService } from '../../../helpers/http/http-auth.service';
import { Lookup } from '../../../productos/informacion-productos/models/lookup.model';
import { Respuesta } from '../helpers/respuestav2';
import { StickerProductoPremio } from '../models/productoPremio.model';

@Injectable()
export class PremiosService {

  constructor(private httpAuth: HttpAuthService) { }

  obtenerProductosPremios(): Observable<Respuesta<StickerProductoPremio[]>> {
    const uri = `${environment.stickersApi}/api/ProductoPremio/ObtenerProductosPremios`;
    return this.httpAuth.get(uri).map((respuesta) => {
      return respuesta.json();
    });
  }

  obtenerLookup(): Observable<Respuesta<Lookup[]>> {
    const uri = `${environment.stickersApi}/api/ProductoPremio/ObtenerProductosPremiosLookup`;
    return this.httpAuth.get(uri).map((respuesta) => {
      return respuesta.json();
    });
  }

  guardar(dto): Observable<Respuesta<StickerProductoPremio>> {
    const uri = `${environment.stickersApi}/api/ProductoPremio/CrearProductoPremio`;
    return this.httpAuth.post(uri, dto).map((x) => x.json());
  }

  editar(dto): Observable<Respuesta<StickerProductoPremio>> {
    const uri = `${environment.stickersApi}/api/ProductoPremio/ActualizarProductoPremio`;
    return this.httpAuth.put(uri, dto).map((x) => x.json());
  }

  inactivar(id: number): Observable<Respuesta<boolean>> {
    return this.httpAuth
      .post(
        `${environment.stickersApi}/api/ProductoPremio/inactivar/${id}`,
        null
      )
      .map((x) => x.json());
  }

  activar(id: number): Observable<Respuesta<boolean>> {
    return this.httpAuth
      .post(
        `${environment.stickersApi}/api/ProductoPremio/activar/${id}`,
        null
      )
      .map((x) => x.json());
  }
}
