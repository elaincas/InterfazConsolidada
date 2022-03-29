import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { environment } from "../../../../../../environments/environment";
import { Observable } from "../../../../../../../node_modules/rxjs";
import { Productos } from "../../../../../desarrollo-productos/Inventario-Productos/_Clases/Productos";

@Injectable()
export class AuxiliarService {
    /**
     *
     */
    constructor(private http: Http) {
    }
    ObtenerProductos():Observable<Array<any>> {
        const uri = `${environment.productosEntrenamiento}/api/Productos/obtenerProductos`;
        return this.http.get(uri).map(r => r.json());
    }
    ObtenerAuxiliarProductos(fechaDesde:string,FechaHasta:string,filtroID: number):Observable<any> {
        const uri = `${environment.productosEntrenamiento}/api/Productos/obtenerAuxiliar/${fechaDesde}/${FechaHasta}/${filtroID}`;
        return this.http.get(uri).map(r=>r.json());
      }  
}