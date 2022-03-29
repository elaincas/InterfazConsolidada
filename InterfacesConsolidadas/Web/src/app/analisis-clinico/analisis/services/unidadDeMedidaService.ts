import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { HttpAuthService } from "../../../helpers/http/http-auth.service";
import { RespuestaAC } from "../models/respuestaAC";
import { UnidadDeMedida } from "../models/unidadMedida.model";

@Injectable()
export class UnidadesDeMedidasService {

  private url = environment.analisisClinicoApi + '/AdminAnalisis/UnidadesDeMedidas/'

  constructor(private httpAuth: HttpAuthService, private http: Http) { }

  ObtenerUnidadesDeMedidas(): Observable<UnidadDeMedida[]> {
    const uri = `${this.url}GetAllUnidadesDeMedidas`;
    return this.http.get(uri).map(r => r.json() as UnidadDeMedida[]);
  }

  ObtenerUnidadDeMedidaPorId(UnidadDeMedidaId: number): Observable<UnidadDeMedida> {
    const uri = `${this.url}${UnidadDeMedidaId}`;
    return this.http.get(uri).map(r => r.json() as UnidadDeMedida);
  }

  GuardarUnidadDeMedida(unidadDeMedida:UnidadDeMedida): Observable<RespuestaAC<UnidadDeMedida>>{
    const uri = `${this.url}UnidadDeMedida`;
    return this.http.post(uri,unidadDeMedida).map(r => r.json() as RespuestaAC<UnidadDeMedida>);
  }

  EditarUnidadDeMedida(unidadDeMedida:UnidadDeMedida): Observable<RespuestaAC<UnidadDeMedida>>{
    const uri = `${this.url}UnidadDeMedida`;
    return this.http.put(uri,unidadDeMedida).map(r => r.json() as RespuestaAC<UnidadDeMedida>);
  }

  EliminarUnidadDeMedida(UnidadDeMedidaId: number): Observable<RespuestaAC<UnidadDeMedida>>{
    const uri = `${this.url}${UnidadDeMedidaId}`;
    return this.http.delete(uri).map(r => r.json() as RespuestaAC<UnidadDeMedida>);
  }

}
