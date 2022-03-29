import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { HttpAuthService } from "../../../helpers/http/http-auth.service";
import { Respuesta } from "../helpers/respuestav2";
import { StickerConfiguracionImagen } from "../models/stickerImagen";

@Injectable()
export class StickerImagenesService {
  constructor(private httpAuth: HttpAuthService) {}

  obtenerImagenesDeSticker(stickerId: number): Observable<Respuesta<StickerConfiguracionImagen[]>> {
    const uri = `${environment.stickersApi}/api/StickerImagen/ObtenerImagenesDeSticker?stickerConfiguracionId=${stickerId}`;
    return this.httpAuth.get(uri).map((respuesta) => {
      return respuesta.json();
    });
  }
}
