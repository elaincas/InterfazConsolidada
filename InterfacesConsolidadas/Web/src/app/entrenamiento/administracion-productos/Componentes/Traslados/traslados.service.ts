import { Http } from "../../../../../../node_modules/@angular/http";
import { Injectable } from "../../../../../../node_modules/@angular/core";
import { environment } from "../../../../../environments/environment";
import { Observable } from "../../../../../../node_modules/rxjs";
import { Traslados } from "../../Clases/Traslados";

@Injectable()
export class TrasladoService {

  constructor(private http: Http) { }

  obtenerTodosLosProductos():Observable<Array<any>>{
    const uri = `${environment.productosEntrenamiento}/api/Productos/obtenerProductos`;
      return this.http.get(uri).map(r=>r.json());
  }
  ObtenerZonas(): Observable<Array<any>> {
    const uri = `${environment.productosEntrenamiento}/api/Productos/obtenerzonas`;
    return this.http.get(uri).map(r => r.json());
  }
  ObtenerZonasUsuario(usuarioID:number): Observable<Array<any>> {
    const uri = `${environment.productosEntrenamiento}/api/Productos/obtenerzonasporusuario/`+usuarioID;
    return this.http.get(uri).map(r => r.json());
  }
  IngresarTraslado(traslado: any){
    const uri = `${environment.productosEntrenamiento}/api/Productos/trasladarproducto`;
    return this.http.post(uri,traslado).map(r => r.json());
  }
}
