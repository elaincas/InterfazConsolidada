import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpAuthService } from '../../../helpers/http/http-auth.service';
import { Lookup } from '../../../productos/informacion-productos/models/lookup.model';
import { Respuesta } from '../helpers/respuestav2';
import { StickerConfiguracion } from '../models/stickerConfiguracion.model';
import { StickerConfiguracionSucursal } from '../models/stickerSucursal.model';

@Injectable()
export class StickersService {

  constructor(private httpAuth: HttpAuthService) { }

  obtenerConfiguracionDeStickers(): Observable<Respuesta<StickerConfiguracion[]>> {
    const uri = `${environment.stickersApi}/api/ConfiguracionSticker/ObtenerConfiguracionDeStickers`;
    return this.httpAuth.get(uri).map((respuesta) => {
      return respuesta.json();
    });
  }

  obtenerConfiguracionDeStickerPorId(stickerId: number): Observable<Respuesta<StickerConfiguracion>> {
    const uri = `${environment.stickersApi}/api/ConfiguracionSticker/ObtenerConfiguracionDeStickersPorId?stickerConfiguracionId=${stickerId}`;
    return this.httpAuth.get(uri).map((respuesta) => {
      return respuesta.json();
    });
  }

  obtenerLookup(): Observable<Respuesta<Lookup[]>> {
    const uri = `${environment.stickersApi}/api/ConfiguracionSticker/ObtenerLookup`;
    return this.httpAuth.get(uri).map((respuesta) => {
      return respuesta.json();
    });
  }

  guardar(dto): Observable<Respuesta<StickerConfiguracionSucursal>> {
    const uri = `${environment.stickersApi}/api/ConfiguracionSticker/CrearConfiguracionDeSticker`;
    return this.httpAuth.post(uri, dto).map((x) => x.json());
  }

  editar(dto): Observable<Respuesta<StickerConfiguracionSucursal>> {
    const uri = `${environment.stickersApi}/api/ConfiguracionSticker/ActualizarConfiguracionDeSticker`;
    return this.httpAuth.put(uri, dto).map((x) => x.json());
  }

  inactivar(id: number): Observable<Respuesta<boolean>> {
    return this.httpAuth
      .post(
        `${environment.stickersApi}/api/ConfiguracionSticker/inactivar/${id}`,
        null
      )
      .map((x) => x.json());
  }

  activar(id: number): Observable<Respuesta<boolean>> {
    return this.httpAuth
      .post(
        `${environment.stickersApi}/api/ConfiguracionSticker/activar/${id}`,
        null
      )
      .map((x) => x.json());
  }

}
