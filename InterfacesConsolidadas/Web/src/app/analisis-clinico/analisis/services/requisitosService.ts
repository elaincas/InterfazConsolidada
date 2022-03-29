import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { HttpAuthService } from "../../../helpers/http/http-auth.service";
import { Requisito } from "../models/requisito.model";
import { RespuestaAC } from "../models/respuestaAC";

@Injectable()
export class RequisitosService {

  private url = environment.analisisClinicoApi + '/AdminAnalisis/Requisitos/'

  constructor(private httpAuth: HttpAuthService, private http: Http) { }

  ObtenerRequisitos(): Observable<Requisito[]> {
    const uri = `${this.url}GetAllRequisitos`;
    return this.http.get(uri).map(r => r.json() as Requisito[]);
  }

  ObtenerRequisitoPorId(RequisitoId: number): Observable<Requisito> {
    const uri = `${this.url}${RequisitoId}`;
    return this.http.get(uri).map(r => r.json() as Requisito);
  }

  GuardarRequisito(requisito:Requisito): Observable<RespuestaAC<Requisito>>{
    const uri = `${this.url}Requisito`;
    return this.http.post(uri,requisito).map(r => r.json() as RespuestaAC<Requisito>);
  }

  EditarRequisito(requisito:Requisito): Observable<RespuestaAC<Requisito>>{
    const uri = `${this.url}Requisito`;
    return this.http.put(uri,requisito).map(r => r.json() as RespuestaAC<Requisito>);
  }

  EliminarRequisito(RequisitoId: number): Observable<RespuestaAC<Requisito>>{
    const uri = `${this.url}${RequisitoId}`;
    return this.http.delete(uri).map(r => r.json() as RespuestaAC<Requisito>);
  }

}
