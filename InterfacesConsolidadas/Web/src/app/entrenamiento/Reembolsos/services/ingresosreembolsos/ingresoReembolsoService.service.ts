import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Reembolso } from '../../models/reembolsos.models';
import { environment } from '../../../../../environments/environment';
import { helpers } from '../../../../helpers/utils';
import { HttpAuthService } from '../../../../helpers/http/http-auth.service';
import { LoginService } from '../../../../login/services/login.service';

@Injectable()
export class IngresoReembolsoService {

  constructor(private http: Http, private httpAuth: HttpAuthService, private loginService: LoginService) { }

  agregarReembolsoAsync(reembolso) {
    const uri = `${environment.reembolsosApi}/api/Reembolso/AgregarReembolso`;
    return this.httpAuth.post(uri,reembolso);
  }


  agregarReembolso(reembolso:Reembolso) {
    let formData = new FormData();
    formData.append('model', reembolso.toJson());

    if(reembolso.rutaDocumentoRecibo != null  && reembolso.rutaDocumentoRecibo.length > 0){
      formData.append("recibo", reembolso.rutaDocumentoRecibo[0]);
    }

    if(reembolso.rutaDocumentoCompromiso != null && reembolso.rutaDocumentoCompromiso.length > 0){
      formData.append("compromiso", reembolso.rutaDocumentoCompromiso[0]);
    }

    const uri = `${environment.reembolsosApi}/api/Reembolso/AgregarReembolso`;
    return this.httpAuth.post(uri,formData);
  }

  obtenerSucursalSegunSupervisor(supervisorID:number): Observable<Array<any>> {
    const uri = environment.reembolsosApi+"api/Reembolso/sucursal/supervisor/"+supervisorID;
    return this.http.get(uri).map(x => x.json());
  }
  obtenerSupervisorSegunSucursal(sucursalID:number): Observable<Array<any>> {
    const uri = environment.reembolsosApi+"api/Reembolso/obtener/supervisor/sucursal/"+sucursalID;
    return this.http.get(uri).map(x => x.json());
  }
  obtenerColaboradorPorID(colaboradoID:number):Observable<Array<any>> {
    const uri = environment.reembolsosApi+"api/Reembolso/ObtenerColaboradorPorId/"+colaboradoID;
    return this.http.get(uri).map(x => x.json());
  }


}
