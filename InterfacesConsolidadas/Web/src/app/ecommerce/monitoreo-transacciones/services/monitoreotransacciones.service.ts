import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { HttpAuthService } from "../../../helpers/http/http-auth.service";

import { Monitoreotransacciones } from "../models/monitoreotransacciones.model";

@Injectable()
export class MonitoreotransaccionesService {
  private _controller = "api/Monitoreotransacciones";
  private _url = `${environment.ecommerceApi}/${this._controller}`;
  constructor(private _httpAuthService: HttpAuthService) {}

  obtenerMonitoreotransacciones(inicio:Date, final:Date): Observable<Monitoreotransacciones[]> {

    var url = `${this._url}/${parseInt(localStorage.getItem("PaisId"))}/${inicio.toLocaleDateString('en-CA')}/${final.toLocaleDateString('en-CA')}`
    console.log(url)
    return this._httpAuthService.get(url).map((r)=> r.json());
  }

  obtenerLimite(): Observable<number> {

    var url = `${this._url}/LimitePorPais/${parseInt(localStorage.getItem("PaisId"))}`
    console.log(url)
    return this._httpAuthService.get(url).map((r)=> r.json());
  }
}
