import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { HttpAuthService } from "../../../helpers/http/http-auth.service";
import { RespuestaAC } from "../models/respuestaAC";
import { ResultadoTipo } from "../models/resultadoTipo.model";

@Injectable()
export class ResultadoTipoService {

  private url = environment.analisisClinicoApi + '/AdminAnalisis/ResultadoTipos/'

  constructor(private httpAuth: HttpAuthService, private http: Http) { }

  ObtenerResultadoTipos(): Observable<ResultadoTipo[]> {
    const uri = `${this.url}GetAllResultadoTipos`;
    return this.http.get(uri).map(r => r.json() as ResultadoTipo[]);
  }

  ObtenerResultadoTipoPorId(ResultadoTipoId: number): Observable<ResultadoTipo> {
    const uri = `${this.url}${ResultadoTipoId}`;
    return this.http.get(uri).map(r => r.json() as ResultadoTipo);
  }

  GuardarResultadoTipo(resultadoTipo:ResultadoTipo): Observable<RespuestaAC<ResultadoTipo>>{
    const uri = `${this.url}ResultadoTipo`;
    return this.http.post(uri,resultadoTipo).map(r => r.json() as RespuestaAC<ResultadoTipo>);
  }

  EditarResultadoTipo(resultadoTipo:ResultadoTipo): Observable<RespuestaAC<ResultadoTipo>>{
    const uri = `${this.url}ResultadoTipo`;
    return this.http.put(uri,resultadoTipo).map(r => r.json() as RespuestaAC<ResultadoTipo>);
  }

  EliminarResultadoTipo(ResultadoTipoId: number): Observable<RespuestaAC<ResultadoTipo>>{
    const uri = `${this.url}${ResultadoTipoId}`;
    return this.http.delete(uri).map(r => r.json() as RespuestaAC<ResultadoTipo>);
  }

}
