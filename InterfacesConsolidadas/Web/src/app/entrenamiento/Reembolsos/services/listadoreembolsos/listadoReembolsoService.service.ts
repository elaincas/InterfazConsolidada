import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { ListadoReembolso } from '../../models/reembolsos.models';
import { environment } from '../../../../../environments/environment';
import { HttpAuthService } from '../../../../helpers/http/http-auth.service';
import { LoginService } from '../../../../login/services/login.service';

@Injectable()
export class ListadoReembolsoService {

    constructor(private http: Http, private httpAuth: HttpAuthService, private loginService: LoginService) { }

obtenerReembolsoPorAceptarSegunUsuario(usuarioSupervisorId:number):Observable<Array<any>>{
    const uri=environment.reembolsosApi+"api/Reembolso/AD/Obtener/Pendientes/UsuarioID/"+usuarioSupervisorId;
    return this.httpAuth.get(uri).map(x=>x.json());
}

obtenerreembolsosAprobadosSegunUsuarioSupervisorId(usuarioSupervisorId:number):Observable<Array<any>>{
    const uri=environment.reembolsosApi+"api/Reembolso/AD/Obtener/Aprobados/SupervisorID/"+usuarioSupervisorId;
    return this.http.get(uri).map(x=>x.json());
}


DenegarReembolso(reembolso:ListadoReembolso){
    const uri = `${environment.reembolsosApi}/api/Reembolso/AD/DenegarReembolso`;
    return this.httpAuth.post(uri,reembolso);
    }
AprobarReembolso(reembolso:ListadoReembolso){
    const uri = `${environment.reembolsosApi}/api/Reembolso/AD/AprobarReembolso`;
    return this.httpAuth.post(uri,reembolso);
    }
}
