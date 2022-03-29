import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { HttpAuthService } from "../../../helpers/http/http-auth.service";
import { Distribuidor } from "../models/distribuidor.model";

@Injectable()
export class DistribuidoresComprasDigitalesService {
  private controllerUrl: string = "api/DistribuidoresComprasDigitales";

  constructor(private httpAuthService: HttpAuthService) {}

  obtenerDistribuidores(): Observable<Distribuidor[]> {
    const url = `${environment.ecommerceApi}/${this.controllerUrl}`;
    return this.httpAuthService.get(url).map((r) => r.json());
  }

  actualizarDistribuidor(distribuidor: Distribuidor): Observable<Distribuidor> {
    const url = `${environment.ecommerceApi}/${this.controllerUrl}`;
    return this.httpAuthService.put(url, distribuidor).map((r) => r.json());
  }
}
