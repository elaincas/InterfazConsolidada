import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { HttpAuthService } from "../../../helpers/http/http-auth.service";
import { NivelResultado } from "../models/nivelResultado.model";
import { RespuestaAC } from "../models/respuestaAC";

@Injectable()
export class NivelResultadoService {

  private url = environment.analisisClinicoApi + '/AdminAnalisis/NivelesResultado/'

  constructor(private httpAuth: HttpAuthService, private http: Http) { }

  ObtenerNivelesResultado(): Observable<NivelResultado[]> {
    const uri = `${this.url}GetAllNivelesResultado`;
    return this.http.get(uri).map(r => r.json() as NivelResultado[]);
  }

  ObtenerNivelResultadoPorId(NivelResultadoId: number): Observable<NivelResultado> {
    const uri = `${this.url}${NivelResultadoId}`;
    return this.http.get(uri).map(r => r.json() as NivelResultado);
  }

  GuardarNivelResultado(nivelResultado:NivelResultado): Observable<RespuestaAC<NivelResultado>>{
    const uri = `${this.url}NivelResultado`;
    return this.http.post(uri,nivelResultado).map(r => r.json() as RespuestaAC<NivelResultado>);
  }

  EditarNivelResultado(nivelResultado:NivelResultado): Observable<RespuestaAC<NivelResultado>>{
    const uri = `${this.url}NivelResultado`;
    return this.http.put(uri,nivelResultado).map(r => r.json() as RespuestaAC<NivelResultado>);
  }

  EliminarNivelResultado(NivelResultadoId: number): Observable<RespuestaAC<NivelResultado>>{
    const uri = `${this.url}${NivelResultadoId}`;
    return this.http.delete(uri).map(r => r.json() as RespuestaAC<NivelResultado>);
  }

}
