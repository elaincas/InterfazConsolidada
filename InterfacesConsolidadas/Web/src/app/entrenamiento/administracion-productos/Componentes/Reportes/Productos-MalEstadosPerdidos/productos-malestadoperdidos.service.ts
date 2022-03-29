import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Producto, ProductoPrestamos } from "../../../Clases/Producto";
import { environment } from "../../../../../../environments/environment";
import { Observable } from "../../../../../../../node_modules/rxjs";

@Injectable()
export class ProductoMalEstadoPerdidosService {
    /**
     *
     */
    constructor(private http: Http) {
    }
    ObtenerProductosMalEstadosPerdidos():Observable<any> {
        const uri = `${environment.productosEntrenamiento}/api/Productos/productosmalestados/`;
        return this.http.get(uri).map(r=>r.json());
      }     
      ActualizarValeProductoColaborador(productoColaboradorPrestamo:ProductoPrestamos):Observable<any> {
        const uri = `${environment.productosEntrenamiento}/api/Productos/actualizarvale/`;
        return this.http.post(uri,productoColaboradorPrestamo).map(r=>r.json());
      }           
}