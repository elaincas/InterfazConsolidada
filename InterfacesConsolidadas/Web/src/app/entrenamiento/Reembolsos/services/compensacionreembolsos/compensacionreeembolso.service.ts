import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { ListadoReembolsoCompensacion } from '../../models/reembolsos.models';
import { environment } from '../../../../../environments/environment';
import { HttpAuthService } from '../../../../helpers/http/http-auth.service';
import { LoginService } from '../../../../login/services/login.service';
import { ListadoReembolsoComponent } from '../../ListaReembolsos/components/listadoreembolso.component';
import {Meses} from '../../models/maestros.models'

@Injectable()
export class CompensancionReembolsoService {

  constructor(private http: Http, private httpAuth: HttpAuthService, private loginService: LoginService) { }

  agregarReembolsoAprobados(reembolso:Array<ListadoReembolsoComponent>) {
    const uri = `${environment.reembolsosApi}/api/Reembolso/AD/Ingreso/Solicitudes/Aprobados`;
    return this.httpAuth.post(uri,reembolso);
  }

  obtenerSolicitudReembolsoAProvadas(compensacion:ListadoReembolsoCompensacion):Observable<Array<ListadoReembolsoCompensacion>>{
    const uri = `${environment.reembolsosApi}/api/Reembolso/AD/Obtener/Aprobados`;
    return this.httpAuth.post(uri,compensacion).map(x => x.json());
  }

  anularSolicitud(solicitud: any){
    const uri = `${environment.reembolsosApi}/api/Reembolso/AD/AnularSolicitud`;
    return this.http.post(uri,solicitud).map(x => x.json());
  }

}
