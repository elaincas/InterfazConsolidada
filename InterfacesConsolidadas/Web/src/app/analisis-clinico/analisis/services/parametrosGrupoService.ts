import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { HttpAuthService } from "../../../helpers/http/http-auth.service";
import { ParametroGrupo } from "../models/parametroGrupo.model";
import { RespuestaAC } from "../models/respuestaAC";

@Injectable()
export class ParametrosGrupoService {

  private url = environment.analisisClinicoApi + '/AdminAnalisis/ParametrosGrupo/'

  constructor(private httpAuth: HttpAuthService, private http: Http) { }

  ObtenerParametrosGrupos(): Observable<ParametroGrupo[]> {
    const uri = `${this.url}GetAllParametrosGrupo`;
    return this.http.get(uri).map(r => r.json() as ParametroGrupo[]);
  }

  ObtenerParametroGrupoPorId(ParametroId: number): Observable<ParametroGrupo> {
    const uri = `${this.url}${ParametroId}`;
    return this.http.get(uri).map(r => r.json() as ParametroGrupo);
  }

  GuardarParametroGrupo(requisito:ParametroGrupo): Observable<RespuestaAC<ParametroGrupo>>{
    const uri = `${this.url}ParametroGrupo`;
    return this.http.post(uri,requisito).map(r => r.json() as RespuestaAC<ParametroGrupo>);
  }

  EditarParametroGrupo(requisito:ParametroGrupo): Observable<RespuestaAC<ParametroGrupo>>{
    const uri = `${this.url}ParametroGrupo`;
    return this.http.put(uri,requisito).map(r => r.json() as RespuestaAC<ParametroGrupo>);
  }

  EliminarParametroGrupo(ParametroId: number): Observable<RespuestaAC<ParametroGrupo>>{
    const uri = `${this.url}${ParametroId}`;
    return this.http.delete(uri).map(r => r.json() as RespuestaAC<ParametroGrupo>);
  }

}
