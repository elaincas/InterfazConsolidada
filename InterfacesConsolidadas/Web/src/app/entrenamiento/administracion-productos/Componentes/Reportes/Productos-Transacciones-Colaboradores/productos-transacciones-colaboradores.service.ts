import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { environment } from "../../../../../../environments/environment";
import { Observable } from "../../../../../../../node_modules/rxjs";
import { Productos } from "../../../../../desarrollo-productos/Inventario-Productos/_Clases/Productos";

@Injectable()
export class ProductoTransaccionesColaboradoresService {
    /**
     *
     */
    constructor(private http: Http) {
    }
    ObtenerTransaccionesProductosColaboradores(fechaDesde:string,FechaHasta:string,estadoID: number):Observable<Array<any>> {
        const uri = `${environment.productosEntrenamiento}/api/Productos/productoasignadocolaborador/${fechaDesde}/${FechaHasta}/${estadoID}`;
        return this.http.get(uri).map(r=>r.json());
      }      
      obtenerEstados(){
        const uri = `${environment.productosEntrenamiento}/api/Productos/estados`;
        return this.http.get(uri).map(r=>r.json());
      }     
      AnularAsignacion(productoTransaccionId:string){
        const uri = `${environment.productosEntrenamiento}/api/Productos/anularasignacion/${productoTransaccionId}`;
        return this.http.get(uri).map(r => r.json());
    }
}