import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { HttpAuthService } from "../../../helpers/http/http-auth.service";
import { ProductoRestringidosListado } from "../models/producto-restringido-listado.model";

@Injectable()
export class ProductosRestringidosService {
  constructor(private httpAuth: HttpAuthService) {}

  obtenerProductosRestringidos(): Observable<ProductoRestringidosListado[]> {
    const uri = `${environment.ecommerceApi}/api/Restringir/Productos`;
    return this.httpAuth.get(uri).map((r) => {
        let query = r.json();
        let reporte = query;
        return reporte;
      })

  }

  guardarProductoRestrigido(producto): Observable<any> {
    const uri = `${environment.ecommerceApi}/api/Restringir/Productos`;
    return this.httpAuth
      .post(uri,{
        descripcion: producto.descripcion,
        Prod_ID : producto.productoId,
        UsuarioID :producto.agente
      })
      .map((x) => x.json());
  }


  inactivarProductoRestringido(
    productoRestringidoId: string
  ): Observable<any> {
     console.log(`${environment.ecommerceApi}/api/Restringir/Productos/${productoRestringidoId}`);
     
    return this.httpAuth
      .delete(
        `${environment.ecommerceApi}/api/Restringir/Productos/${productoRestringidoId}`
      )
      .map((x) => x.json());
  }

}
