import { Http } from "../../../../../../node_modules/@angular/http";
import { Injectable } from "../../../../../../node_modules/@angular/core";
import { environment } from "../../../../../environments/environment";
import { Observable } from "../../../../../../node_modules/rxjs";
import { Traslados } from "../../Clases/Traslados";

@Injectable()
export class AceptarDenegarTrasladoService {

  constructor(private http: Http) { }

  ObtenerTrasladosPorUsuario(usuarioID:number):Observable<Array<any>>{
    const uri = `${environment.productosEntrenamiento}/api/Productos/obtenerTraslados/`+usuarioID;
      return this.http.get(uri).map(r=>r.json());
  }
  AceptarDenegarReembolso(traslado: Traslados){
    const uri = `${environment.productosEntrenamiento}/api/Productos/aceptardenegartraslado`;
    return this.http.post(uri,traslado).map(r => r.json());
  }
  ObtenerZonas(usuarioID:number): Observable<Array<any>> {
    const uri = `${environment.productosEntrenamiento}/api/Productos/obtenerzonasporusuario/`+usuarioID;
    return this.http.get(uri).map(r => r.json());
  }
  obtenerTodosLosProductos():Observable<Array<any>>{
    const uri = `${environment.productosEntrenamiento}/api/Productos/obtenerProductos`;
      return this.http.get(uri).map(r=>r.json());
  }
}
