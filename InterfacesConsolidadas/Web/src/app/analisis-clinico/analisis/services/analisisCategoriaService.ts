import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { HttpAuthService } from "../../../helpers/http/http-auth.service";
import { Categoria } from "../models/categorias.model";
import { ProductoInsumoBusqueda } from "../models/productoInsumoBusqueda";
import { RespuestaAC } from "../models/respuestaAC";

@Injectable()
export class AnalisisCategoriasService {

  private url = environment.analisisClinicoApi + '/AdminAnalisis/Categorias/'

  constructor(private httpAuth: HttpAuthService, private http: Http) { }

  ObtenerCategorias(): Observable<Categoria[]> {
    const uri = `${this.url}GetAllCategorias`;
    return this.http.get(uri).map(r => r.json() as Categoria[]);
  }

  ObtenerCategoriaPorId(categoriaId: string): Observable<Categoria> {
    const uri = `${this.url}${categoriaId}`;
    return this.http.get(uri).map(r => r.json() as Categoria);
  }

  GuardarCategoria(categoria:Categoria): Observable<RespuestaAC<Categoria>>{
    const uri = `${this.url}Categoria`;
    return this.http.post(uri,categoria).map(r => r.json() as RespuestaAC<Categoria>);
  }

  EditarCategoria(categoria:Categoria): Observable<RespuestaAC<Categoria>>{
    const uri = `${this.url}Categoria`;
    return this.http.put(uri,categoria).map(r => r.json() as RespuestaAC<Categoria>);
  }

  EliminarCategoria(categoriaId: number): Observable<RespuestaAC<Categoria>>{
    const uri = `${this.url}${categoriaId}`;
    return this.http.delete(uri).map(r => r.json() as RespuestaAC<Categoria>);
  }

}
