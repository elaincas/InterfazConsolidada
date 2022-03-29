import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { HttpAuthService } from "../../../helpers/http/http-auth.service";

@Injectable()
export class ProductoInformacionService {
  constructor(private httpAuth: HttpAuthService) {}

  obtener() {
    const uri = `${environment.maestrosFarmaciaApi}/api/ProductoInformacion`;
    return this.httpAuth.get(uri).map((respuesta) => {
      return respuesta.json();
    });
  }

  obtenerLookup() {
    const uri = `${environment.maestrosFarmaciaApi}/api/ProductoInformacion/lookup`;
    return this.httpAuth.get(uri).map((respuesta) => {
      return respuesta.json();
    });
  }

  guardar(dto): Observable<any> {
    const uri = `${environment.maestrosFarmaciaApi}/api/ProductoInformacion`;
    return this.httpAuth.post(uri, dto).map((x) => x.json());
  }

  editar(dto): Observable<any> {
    const uri = `${environment.maestrosFarmaciaApi}/api/ProductoInformacion`;
    return this.httpAuth.put(uri, dto).map((x) => x.json());
  }

  inactivar(id: number): Observable<any> {
    return this.httpAuth
      .post(
        `${environment.maestrosFarmaciaApi}/api/ProductoInformacion/inactivar/${id}`,
        null
      )
      .map((x) => x.json());
  }

  activar(id: number): Observable<any> {
    return this.httpAuth
      .post(
        `${environment.maestrosFarmaciaApi}/api/ProductoInformacion/activar/${id}`,
        null
      )
      .map((x) => x.json());
  }
}
