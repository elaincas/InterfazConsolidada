import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, ResponseContentType } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Reembolso, ListadoReembolsosSegunEstado } from '../../models/reembolsos.models';
import { environment } from '../../../../../environments/environment';
import { HttpAuthService } from '../../../../helpers/http/http-auth.service';
import { LoginService } from '../../../../login/services/login.service';
import { HttpHeaders } from "@angular/common/http";
import box from 'devextreme/ui/box';
import { Empresa } from '../../../../ecommerce/Banners/Subir-Banners/models/Empresa';


@Injectable()
export class MaestrosServices {

  constructor(private http: Http, private httpAuth: HttpAuthService, private loginService: LoginService) {

  }


  obtenerSucursales(): Observable<Array<any>> {
    const uri = environment.reembolsosApi+"api/Maestro/ObtenerSucursales";
    return this.httpAuth.get(uri).map(x => x.json());
  }
  obtenerSupervisores(): Observable<Array<any>> {
    const uri = environment.reembolsosApi+"api/Maestro/ObtenerSupervisores";
    return this.http.get(uri).map(x => x.json());
  }
  obtenerCiudades(): Observable<Array<any>> {
    const uri = environment.reembolsosApi+"api/Maestro/ObtenerCiudades";
    return this.httpAuth.get(uri).map(x => x.json());
  }
  obtenerColaboradores():Observable<Array<any>>{
    const uri = environment.reembolsosApi+"api/Maestro/ObtenerColaboradores";
    return this.http.get(uri).map(x=>x.json());
  }
  obtenerEstadosReembolsos(solicitudes:ListadoReembolsosSegunEstado):Observable<Array<any>>{
    const uri = environment.reembolsosApi+"api/Reembolso/AD/Listar/Solicitudes";
    // return this.http.post(uri,solicitudes, httpOptions).map(x=>x.json());
    return this.httpAuth.post(uri, solicitudes).map(x => x.json());
  }
   Download = (id: number): Observable<Blob> => {
    const uri = environment.reembolsosApi+"api/Reembolso/AD/ObtenerArchivo/"+id;
    return this.http.get(uri, {responseType: ResponseContentType.Blob})
        .map(response => response.blob())
}

  obtenerSucursalesActivas(){
    const uri = environment.maestrosFarmaciaApi+"/api/sucursales";
    return this.http.get(uri)
        .map(response => response.json())
  }

  ObtenerEmpresas(): Observable<Empresa[]> {
    const url = `${environment.maestrosFarmaciaApi}/api/empresas/ObtenerEmpresas`;
    return this.httpAuth.get(url).map(r => r.json());
  }
}
