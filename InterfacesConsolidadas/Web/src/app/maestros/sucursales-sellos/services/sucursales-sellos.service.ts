import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { HttpAuthService } from "../../../helpers/http/http-auth.service";
import { SucursalSello } from "../models/sucursal-sello.model";

@Injectable()
export class SucursalesSellosService {
  private controller = "api/SucursalesSellos";

  constructor(private _httpAuthService: HttpAuthService) {}

  consultarSucursales(): void {}

  GuardarSelloSucursal(
    sucursalSello: SucursalSello
  ): Observable<SucursalSello> {
    const formData = new FormData();
    formData.append("sucursalSelloDto", JSON.stringify(sucursalSello));
    formData.append("SucursalesSellos", sucursalSello.archivoImagen[0]);
    const url = `${environment.ecommerceApi}/${this.controller}`;
    return this._httpAuthService.post(url, formData).map((r) => r.json());
  }

  EditarSucursalSello(sucursalSello: SucursalSello): Observable<SucursalSello> {
    const formData = new FormData();
    formData.append("sucursalSelloDto", JSON.stringify(sucursalSello));

    if (sucursalSello.archivoImagen != null) {
      formData.append("SucursalesSellos", sucursalSello.archivoImagen[0]);
    }

    const url = `${environment.ecommerceApi}/${this.controller}`;
    return this._httpAuthService.put(url, formData).map((r) => r.json());
  }

  ObtenerSucursalesSellos(): Observable<SucursalSello[]> {
    const url = `${environment.ecommerceApi}/${this.controller}`;
    return this._httpAuthService.get(url).map((r) => r.json());
  }

  obtenerCantidadSellosPorSucursalCodigo(sucursalCodigo: number): Observable<number> {
    const url = `${environment.ecommerceApi}/${this.controller}/CantidadSellos/${sucursalCodigo}`;
    return this._httpAuthService.get(url).map((r)=> r.json());
  }
}
