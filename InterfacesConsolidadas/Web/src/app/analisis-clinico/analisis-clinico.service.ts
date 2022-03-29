import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpAuthService } from '../helpers/http/http-auth.service';
import { Respuesta, RespuestaTipo } from '../helpers/respuestas/respuesta';
import { Analisis } from './analisis/models/analisis.model';
import { AnalisisInsumo } from './analisis/models/analisisInsumo.model';
import { AnalisisLaboratorios } from './analisis/models/analisisLaboratorio.model';
import { AnalisisParametro } from './analisis/models/analisisParametro.model';
import { AnalisisRequisito } from './analisis/models/analisisRequisito.model';
import { Categoria } from './analisis/models/categorias.model';
import { Insumo } from './analisis/models/insumo.model';
import { Laboratorio } from './analisis/models/laboratorio.model';
import { MuestraTipo } from './analisis/models/muestraTipo.model';
import { Parametro } from './analisis/models/parametro.model';
import { ProductoAnalisis } from './analisis/models/productoAnalisis';
import { Requisito } from './analisis/models/requisito.model';
import { RespuestaAC } from './analisis/models/respuestaAC';
@Injectable()
export class AnalisisClinicoService {

  private url = environment.analisisClinicoApi+'/AdminAnalisis'

  constructor(private httpAuth: HttpAuthService, private http: Http) { }

  ObtenerListaDeAnalisis(): Observable<Analisis[]>{
    const uri = `${this.url}/GetAllAnalisis`;
        return this.http.get(uri).map(r => r.json() as Analisis[]);
  }

  ObtenerAnalisisPorId(AnalisisId: string): Observable<Analisis>{
    const uri = `${this.url}/GetAnalisisPorId/${AnalisisId}`;
        return this.http.get(uri).map(r => r.json() as Analisis);
  }

  EliminarAnalisis(AnalisisId: string): Observable<RespuestaAC<Analisis>>{
    const uri = `${this.url}/${AnalisisId}`;
    return this.http.delete(uri).map(r => r.json() as RespuestaAC<Analisis>);
  }

  ObtenerProductosAnalisis(): Observable<ProductoAnalisis[]>{
    const uri = `${this.url}/Productos/Analisis`;
    return this.http.get(uri).map(r => r.json() as ProductoAnalisis[]);
  }

  ObtenerMuestrasTipos(): Observable<MuestraTipo[]>{
    const uri = `${this.url}/MuestrasTipos/GetAllMuestrasTipos`;
    return this.http.get(uri).map(r => r.json() as MuestraTipo[]);
  }

  ObtenerCategorias(): Observable<Categoria[]>{
    const uri = `${this.url}/Categorias/GetAllCategorias`;
    return this.http.get(uri).map(r => r.json() as Categoria[]);
  }

  ObtenerParametros(): Observable<Parametro[]>{
    const uri = `${this.url}/Parametros/GetAllParametros`;
    return this.http.get(uri).map(r => r.json() as Parametro[]);
  }

  ObtenerRequisitos(): Observable<Requisito[]>{
    const uri = `${this.url}/Requisitos/GetAllRequisitos`;
    return this.http.get(uri).map(r => r.json() as Requisito[]);
  }

  ObtenerLaboratorios(): Observable<Laboratorio[]>{
    const uri = `${this.url}/Laboratorios/GetAllLaboratorios`;
    return this.http.get(uri).map(r => r.json() as Laboratorio[]);
  }

  ObtenerInsumos(): Observable<Insumo[]>{
    const uri = `${this.url}/Insumos/GetAllInsumos`;
    return this.http.get(uri).map(r => r.json() as Insumo[]);
  }

  GuardarAnalisis(analisis:Analisis): Observable<RespuestaAC<Analisis>>{
    const uri = `${this.url}/Analisis`;
    return this.http.post(uri,analisis).map(r => r.json() as RespuestaAC<Analisis>);
  }

  EditarAnalisis(analisis:Analisis): Observable<RespuestaAC<Analisis>>{
    const uri = `${this.url}/Analisis`;
    return this.http.put(uri,analisis).map(r => r.json() as RespuestaAC<Analisis>);
  }

  EliminarAnalisisRequisito(Id: number): Observable<RespuestaAC<AnalisisRequisito>>{
    const uri = `${this.url}/AnalisisRequisitos/${Id}`;
    return this.http.delete(uri).map(r => r.json() as RespuestaAC<AnalisisRequisito>);
  }

  EliminarAnalisisParametro(Id: number): Observable<RespuestaAC<AnalisisParametro>>{
    const uri = `${this.url}/AnalisisParametros/${Id}`;
    return this.http.delete(uri).map(r => r.json() as RespuestaAC<AnalisisParametro>);
  }

  EliminarAnalisisInsumo(Id: number): Observable<RespuestaAC<AnalisisInsumo>>{
    const uri = `${this.url}/AnalisisInsumos/${Id}`;
    return this.http.delete(uri).map(r => r.json() as RespuestaAC<AnalisisInsumo>);
  }

  EliminarAnalisisLaboratorio(Id: number): Observable<RespuestaAC<AnalisisLaboratorios>>{
    const uri = `${this.url}/AnalisisLaboratorios/${Id}`;
    return this.http.delete(uri).map(r => r.json() as RespuestaAC<AnalisisLaboratorios>);
  }

  EditarAnalisisInsumo(analisisInsumo:AnalisisInsumo): Observable<RespuestaAC<AnalisisInsumo>>{
    const uri = `${this.url}/AnalisisInsumos`;
    return this.http.put(uri,analisisInsumo).map(r => r.json() as RespuestaAC<AnalisisInsumo>);
  }

  EditarAnalisisLaboratorio(analisisLaboratorio:AnalisisLaboratorios): Observable<RespuestaAC<AnalisisLaboratorios>>{
    const uri = `${this.url}/AnalisisLaboratorios`;
    return this.http.put(uri,analisisLaboratorio).map(r => r.json() as RespuestaAC<AnalisisLaboratorios>);
  }

}
