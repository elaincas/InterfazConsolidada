import { Injectable } from "../../../../../../../node_modules/@angular/core";
import { Http, ResponseContentType, RequestOptions,Headers } from "@angular/http";
import { environment } from "../../../../../../environments/environment";
import { Observable } from "../../../../../../../node_modules/rxjs";
import { DevolverArchivo } from "../../../Clases/Archivos";
import { Planimetria } from "../../../Clases/Planimetria";


@Injectable()
export class RptSucursalesRetroalimentacionService {

  constructor(private http: Http) { }

  obtenerInformacion(tipoPlanimetriaID: number, sucursalID: number, mesAnio: string): Observable<Array<any>> {
    const uri = `${environment.planimetriaApi}/api/planimetrias/ObtenerRetroalimentaciones/` + tipoPlanimetriaID + `/` + sucursalID + `?mesAnio=${mesAnio}`
    return this.http.get(uri).map(r => r.json());
  }
  ObtenerTipoPlanimetrias(): Observable<Array<any>> {
    const url = `${environment.planimetriaApi}` + '/api/common/' + 'tipoplanimetrias';
    return this.http.get(url).map(r => r.json());
  }
  ObtenerSucursales(): Observable<Array<any>> {
    const url = `${environment.planimetriaApi}` + '/api/common/' + 'sucursales';
    return this.http.get(url).map(r => r.json());
  }
  ObtenerInformacionImagenes(tipoPlanimetriaID:number,sucursalID: number): Observable<DevolverArchivo> {
    const url = `${environment.planimetriaApi}/api/planimetrias/ObtenerInfoImagenes/`+tipoPlanimetriaID+`/`+sucursalID+`?esRetroalimentacion=${true}`;
    return this.http.get(url).map(r=>r.json());
  }
  ObtenerArchivo(nombreArchivo: string) {
    let headers = new Headers();
    headers.append('Content-Type', 'image/png');
    let options = new RequestOptions({headers,responseType: ResponseContentType.Blob});
    const url = `${environment.planimetriaApi}/api/planimetrias/ObtenerArchivo?nombreArchivo=${nombreArchivo}`;
    return this.http.get(url,options) 
      .map(res => res.blob());
  }
  aprobarPlanimetria(planimetria: Planimetria){
    const url = `${environment.planimetriaApi}/api/planimetrias/aprobaranular/`;
    return this.http.post(url,planimetria).map(r=>r.json());
  }
}