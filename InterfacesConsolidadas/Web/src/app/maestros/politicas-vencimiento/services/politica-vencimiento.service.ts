import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { environment } from '../../../../environments/environment';
import { helpers } from '../../../helpers/utils';
import { HttpAuthService } from '../../../helpers/http/http-auth.service';
import { LoginService } from '../../../login/services/login.service';
import { PoliticaProveedor, PoliticaProveedorDto, Distribuidores } from '../models/politicaProveedor';

/* import {  } from '../models/Proveedor.models'; */

@Injectable()
export class PoliticaVencimientoService {

  constructor(private http: Http, private httpAuth: HttpAuthService, private loginService: LoginService) { }

  obtenerProveedoresActivos(): Observable<Array<PoliticaProveedorDto>> {
    return this.httpAuth.get(`${environment.maestrosFarmaciaApi}/api/proveedores/politicas`).map(r => {
      return r.json();
    });
  }
  
  editarPoliticaProveedorActivo(politica: PoliticaProveedor): Observable<any> {
    const uri = `${environment.maestrosFarmaciaApi}/api/proveedores/politicas`;
    return this.httpAuth.put(uri, politica).map(data => data.json());
  }

  agregarPoliticaProveedorActivo(politica: PoliticaProveedor): Observable<any> {
    const uri = `${environment.maestrosFarmaciaApi}/api/proveedores/politicas`;
    return this.httpAuth.post(uri, politica).map(data => data.json());
  }

  eliminarPoliticaProveedorActivo(PoliticaId: number): Observable<PoliticaProveedor> {
    const uri = `${environment.maestrosFarmaciaApi}/api/proveedores/politicas/${PoliticaId}`;
    return this.httpAuth.delete(uri).map(data => data.json());
  }

  obtenerDistribuidores(): Observable<Array<Distribuidores>> {
    return this.httpAuth.get(`${environment.maestrosFarmaciaApi}/api/distribuidores`).map(r => {
      return r.json();
    });
  }


}
