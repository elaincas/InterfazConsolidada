import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { HttpAuthService } from "../../../helpers/http/http-auth.service";
import { ProductoReproducionesListado } from "../models/producto-reproduciones-listado.model";

@Injectable()
export class ProductosReproducionesService {
  constructor(private httpAuth: HttpAuthService) {}

  obtenerReproducionesDeVideo(inicio:Date, final:Date): Observable<ProductoReproducionesListado[]> {
    const uri = `${environment.ecommerceApi}/api/Producto/Videos/Reporte/${inicio.toLocaleDateString('en-CA')}/${final.toLocaleDateString('en-CA')}`;
    return this.httpAuth.get(uri).map((r) => {
        let query = r.json();
        let reporte = query;
        return reporte;
      })
  }

}
