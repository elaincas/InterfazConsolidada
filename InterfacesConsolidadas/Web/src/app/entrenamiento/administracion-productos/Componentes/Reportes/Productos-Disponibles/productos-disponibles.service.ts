import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Producto } from "../../../Clases/Producto";
import { environment } from "../../../../../../environments/environment";
import { Observable } from "../../../../../../../node_modules/rxjs";

@Injectable()
export class ProductoDisponibleService {
    /**
     *
     */
    constructor(private http: Http) {
    }
    ObtenerProductosDisponibles(usuario:number):Observable<Array<any>> {
        const uri = `${environment.productosEntrenamiento}/api/Productos/productosdisponibles/`+usuario;
        return this.http.get(uri).map(r=>r.json());
      }            
}
