import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { HttpAuthService } from "../../../helpers/http/http-auth.service";
import { ProductodDescuentoExclusivoListado } from "../models/producto-descuento-exclusivo-listado.model";

@Injectable()
export class ProductosDescuentosExclusivosService {
  constructor(private httpAuth: HttpAuthService) {}

  obtenerProductosDescuentosExclusivos(): Observable<
    ProductodDescuentoExclusivoListado[]
  > {
    const uri = `${environment.maestrosFarmaciaApi}/api/productosDescuentosExclusivos`;
    return this.httpAuth
      .get(uri)
      .map((r) => {
        let query = r.json();
        let reporte = query;
        return reporte;
      })
      .map((data) => {
        const productosDescuentosExclusivosMap = data.map((data) => {
          return <ProductodDescuentoExclusivoListado>{
            ...data,
            fechaFin: new Date(data.fechaFin),
            fechaInicio: new Date(data.fechaInicio),
            descuento: data.descuento * 100,
          };
        });
        return productosDescuentosExclusivosMap;
      });
  }

  guardarProductoDescuentoExclusivo(
    productoDescuentoExclusivo
  ): Observable<any> {
    const uri = `${environment.maestrosFarmaciaApi}/api/productosDescuentosExclusivos`;
    return this.httpAuth
      .post(uri, productoDescuentoExclusivo)
      .map((x) => x.json());
  }

  actualizarProductoDescuentoExclusivo(
    productoDescuentoExclusivo
  ): Observable<any> {
    const uri = `${environment.maestrosFarmaciaApi}/api/productosDescuentosExclusivos`;
    return this.httpAuth
      .put(uri, productoDescuentoExclusivo)
      .map((x) => x.json());
  }

  inactivarProductoDescuentoExclusivo(
    productoDescuentoExclusivoId: number
  ): Observable<any> {
    return this.httpAuth
      .post(
        `${environment.maestrosFarmaciaApi}/api/productosDescuentosExclusivos/inactivar/${productoDescuentoExclusivoId}`,
        null
      )
      .map((x) => x.json());
  }

  activarProductoDescuentoExclusivo(
    productoDescuentoExclusivoId: number
  ): Observable<any> {
    return this.httpAuth
      .post(
        `${environment.maestrosFarmaciaApi}/api/productosDescuentosExclusivos/activar/${productoDescuentoExclusivoId}`,
        null
      )
      .map((x) => x.json());
  }
}
