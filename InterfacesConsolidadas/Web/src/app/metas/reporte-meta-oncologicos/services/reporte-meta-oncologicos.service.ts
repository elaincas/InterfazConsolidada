import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { HttpAuthService } from "../../../helpers/http/http-auth.service";
import { MesReporte } from "../models/MesReporte.model";
import { MetaOncologicoSucursal } from "../models/MetaOncologicoSucursal.model";
import { MetaOncologicoZona } from "../models/MetaOncologicoZona.model";
import { TipoReporte } from "../models/TipoReporte.model";

@Injectable()
export class ReporteMetaOncologicosService {
  private _controllerUrl: string = "api/ReporteMetaOncologicos";
  private _url: string = `${environment.ecommerceApi}/${this._controllerUrl}`;

  private tiposReportes: TipoReporte[] = [
    { id: 1, descripcion: "Zona" },
    { id: 3, descripcion: "Sucursal" },
  ];

  private mesesReporte: MesReporte[] = [
    { id: 1, descripcion: "Enero" },
    { id: 2, descripcion: "Febrero" },
    { id: 3, descripcion: "Marzo" },
    { id: 4, descripcion: "Abril" },
    { id: 5, descripcion: "Mayo" },
    { id: 6, descripcion: "Junio" },
    { id: 7, descripcion: "Julio" },
    { id: 8, descripcion: "Agosto" },
    { id: 9, descripcion: "Septiembre" },
    { id: 10, descripcion: "Octubre" },
    { id: 11, descripcion: "Noviembre" },
    { id: 12, descripcion: "Diciembre" },
  ];

  constructor(private _httpAuthService: HttpAuthService) {}

  obtenerMetaOncologicosPorSucursal(
    anio: number,
    mes: number
  ): Observable<MetaOncologicoSucursal[]> {
    return this._httpAuthService
      .get(`${this._url}/Sucursal/${anio}/${mes}`)
      .map((r) => r.json());
  }

  obtenerMetaOncologicosPorZona(
    anio: number,
    mes: number
  ): Observable<MetaOncologicoZona[]> {
    return this._httpAuthService
      .get(`${this._url}/Zona/${anio}/${mes}`)
      .map((r) => r.json());
  }

  obtenerTiposReportes(): TipoReporte[] {
    return this.tiposReportes;
  }

  obtenerMesesReporte(): MesReporte[] {
    return this.mesesReporte;
  }

  obtenerAniosReporte(): Observable<number[]> {
    return this._httpAuthService.get(`${this._url}/Anios`).map((r) => r.json());
  }
}
