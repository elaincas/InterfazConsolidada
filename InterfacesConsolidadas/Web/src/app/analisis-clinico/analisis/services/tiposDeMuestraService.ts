import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { HttpAuthService } from "../../../helpers/http/http-auth.service";
import { MuestraTipo } from "../models/muestraTipo.model";
import { RespuestaAC } from "../models/respuestaAC";

@Injectable()
export class MuestraTiposService {

  private url = environment.analisisClinicoApi + '/AdminAnalisis/MuestrasTipos/'

  constructor(private httpAuth: HttpAuthService, private http: Http) { }

  ObtenerMuestrasTipos(): Observable<MuestraTipo[]> {
    const uri = `${this.url}GetAllMuestrasTipos`;
    return this.http.get(uri).map(r => r.json() as MuestraTipo[]);
  }

  ObtenerMuestraTipoPorId(MuestraTipoId: number): Observable<MuestraTipo> {
    const uri = `${this.url}${MuestraTipoId}`;
    return this.http.get(uri).map(r => r.json() as MuestraTipo);
  }

  GuardarMuestraTipo(muestraTipo:MuestraTipo): Observable<RespuestaAC<MuestraTipo>>{
    const uri = `${this.url}MuestrasTipo`;
    return this.http.post(uri,muestraTipo).map(r => r.json() as RespuestaAC<MuestraTipo>);
  }

  EditarMuestraTipo(muestraTipo:MuestraTipo): Observable<RespuestaAC<MuestraTipo>>{
    const uri = `${this.url}MuestrasTipo`;
    return this.http.put(uri,muestraTipo).map(r => r.json() as RespuestaAC<MuestraTipo>);
  }

  EliminarMuestraTipo(MuestraTipoId: number): Observable<RespuestaAC<MuestraTipo>>{
    const uri = `${this.url}${MuestraTipoId}`;
    return this.http.delete(uri).map(r => r.json() as RespuestaAC<MuestraTipo>);
  }

}
