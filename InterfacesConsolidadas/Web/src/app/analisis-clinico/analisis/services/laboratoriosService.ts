import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { HttpAuthService } from "../../../helpers/http/http-auth.service";
import { Laboratorio } from "../models/laboratorio.model";
import { RespuestaAC } from "../models/respuestaAC";

@Injectable()
export class LaboratoriosService {

  private url = environment.analisisClinicoApi + '/AdminAnalisis/Laboratorios/'

  constructor(private httpAuth: HttpAuthService, private http: Http) { }

  ObtenerLaboratorios(): Observable<Laboratorio[]> {
    const uri = `${this.url}GetAllLaboratorios`;
    return this.http.get(uri).map(r => r.json() as Laboratorio[]);
  }

  ObtenerLaboratorioPorId(LaboratorioId: number): Observable<Laboratorio> {
    const uri = `${this.url}${LaboratorioId}`;
    return this.http.get(uri).map(r => r.json() as Laboratorio);
  }

  GuardarLaboratorio(laboratorio:Laboratorio): Observable<RespuestaAC<Laboratorio>>{
    const uri = `${this.url}Laboratorio`;
    return this.http.post(uri,laboratorio).map(r => r.json() as RespuestaAC<Laboratorio>);
  }

  EditarLaboratorio(laboratorio:Laboratorio): Observable<RespuestaAC<Laboratorio>>{
    const uri = `${this.url}Laboratorio`;
    return this.http.put(uri,laboratorio).map(r => r.json() as RespuestaAC<Laboratorio>);
  }

  EliminarLaboratorio(LaboratorioId: number): Observable<RespuestaAC<Laboratorio>>{
    const uri = `${this.url}${LaboratorioId}`;
    return this.http.delete(uri).map(r => r.json() as RespuestaAC<Laboratorio>);
  }

}
