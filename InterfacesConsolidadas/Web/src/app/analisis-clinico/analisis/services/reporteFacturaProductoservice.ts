import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { ReporteFacturaProductoDom } from '../models/reporteexamencallcenter.models';
import { environment } from '../../../../environments/environment';
import { HttpAuthService } from '../../../helpers/http/http-auth.service';
import { LoginService } from '../../../login/services/login.service';

@Injectable()
export class ReporteFacturaProductoService {

  constructor(private http: Http, private httpAuth: HttpAuthService, private loginService: LoginService) { }

  obtenerReporteExamenCallCenter(sucursal:number,inicio:Date, final:Date):Observable<any[]> {
    const uri = `${environment.ecommerceApi}/api/Reporte/Facturas/Examenes/Domicilio/${sucursal}/${inicio.toLocaleDateString('en-CA')}/${final.toLocaleDateString('en-CA')}`;    
    return this.httpAuth.get(uri).map(x=>x.json());;
  }

  obtenerSucursales(): Observable<Array<any>> {
    const uri = environment.reembolsosApi+"api/Maestro/ObtenerSucursales";
    return this.http.get(uri).map(x => x.json());
  }


}
