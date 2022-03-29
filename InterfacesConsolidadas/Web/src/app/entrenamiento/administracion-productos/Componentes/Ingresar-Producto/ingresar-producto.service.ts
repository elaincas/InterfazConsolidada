import { Http } from "../../../../../../node_modules/@angular/http";
import { LoginService } from "../../../../login/services/login.service";
import { Injectable } from "../../../../../../node_modules/@angular/core";
import { environment } from "../../../../../environments/environment";
import { Producto } from "../../Clases/Producto";
import { Observable } from "../../../../../../node_modules/rxjs";

@Injectable()
export class ProductoEntrenamientoService {

    constructor(private http: Http) {}
    
    agregarProducto(producto: Producto) {
        const uri = `${environment.productosEntrenamiento}/api/Productos/ingresarProductos`;
        return this.http.post(uri,producto);
      }
    
      obtenerTodosLosProductos():Observable<Array<any>>{
        const uri = `${environment.productosEntrenamiento}/api/Productos/obtenerProductos`;
          return this.http.get(uri).map(r=>r.json());
      }
      ObtenerZonas(usuarioID:number):Observable<Array<any>>{
        const uri = `${environment.productosEntrenamiento}/api/Productos/obtenerzonasporusuario/`+usuarioID;
        return this.http.get(uri).map(r=>r.json());
      }
}
