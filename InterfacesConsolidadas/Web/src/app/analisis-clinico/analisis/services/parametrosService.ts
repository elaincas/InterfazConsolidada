import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { HttpAuthService } from "../../../helpers/http/http-auth.service";
import { Parametro } from "../models/parametro.model";
import { RespuestaAC } from "../models/respuestaAC";

@Injectable()
export class ParametrosService {

  private url = environment.analisisClinicoApi + '/AdminAnalisis/Parametros/'

  constructor(private httpAuth: HttpAuthService, private http: Http) { }

  ObtenerParametros(): Observable<Parametro[]> {
    const uri = `${this.url}GetAllParametros`;
    return this.http.get(uri).map(r => r.json() as Parametro[]);
  }

  ObtenerParametroPorId(ParametroId: number): Observable<Parametro> {
    const uri = `${this.url}${ParametroId}`;
    return this.http.get(uri).map(r => r.json() as Parametro);
  }

  GuardarParametro(requisito:Parametro): Observable<RespuestaAC<Parametro>>{
    const uri = `${this.url}Parametro`;
    return this.http.post(uri,requisito).map(r => r.json() as RespuestaAC<Parametro>);
  }

  EditarParametro(requisito:Parametro): Observable<RespuestaAC<Parametro>>{
    const uri = `${this.url}Parametro`;
    return this.http.put(uri,requisito).map(r => r.json() as RespuestaAC<Parametro>);
  }

  EliminarParametro(ParametroId: number): Observable<RespuestaAC<Parametro>>{
    const uri = `${this.url}${ParametroId}`;
    return this.http.delete(uri).map(r => r.json() as RespuestaAC<Parametro>);
  }

}
