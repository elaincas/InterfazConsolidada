import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpAuthService } from '../../helpers/http/http-auth.service';
import { LoginService } from './../../login/services/login.service';
import { ProductoAtributo } from './models/producto-atributo';
import { ProductoAtributoDetalle } from './models/producto-atributo-detalle';
import { ProductoAtributoValor } from './models/producto-atributo-valor';
import { ProductoRow } from './models/producto-row';
import { RespuestaSaveListAtributos } from './models/respuesta-save-list-atributos';
@Injectable()
export class EconoMascotasService {

  constructor(private httpAuth: HttpAuthService,
    private LoginService: LoginService, private http: Http) { }


  GetAtributosProductos(): Observable<ProductoAtributo[]> {
    const uri = `${environment.farsimanProducts}api/EconoMascotas/getatributosproductos`;
    return this.http.get(uri).map(response => response.json());
  }
  GetAtributosProductosValor(productoAtributoId: string): Observable<ProductoAtributoValor[]> {
    const uri = `${environment.farsimanProducts}api/EconoMascotas/getatributosproductosvalor/${productoAtributoId}`;
    return this.http.get(uri).map(response => response.json());
  }

  SaveProductoAtributoDetalle(productoAtributoDetalle: ProductoAtributoDetalle): Observable<ProductoAtributoDetalle> {
    productoAtributoDetalle.usuarioAgregaId = Number(this.LoginService.Usuario.id)
    const uri = `${environment.farsimanProducts}api/EconoMascotas/saveproductoatributodetalle`;
    return this.http.post(uri, productoAtributoDetalle).map(response => response.json());
  }
  ObtenerTodosProductos() {
    return this.httpAuth.get(`${environment.maestrosFarmaciaApi}/api/productos/todos`).map(r => {
      return r.json();
    });
  }

  GetAtributosProductosDetalle(): Observable<ProductoRow[]> {
    return this.httpAuth.get(`${environment.farsimanProducts}api/EconoMascotas/getatributosproductosdetalle`).map(r => {
      return r.json();
    });
  }

  GetAtributosProductosDetalleValor(productoId: string): Observable<ProductoRow[]> {
    return this.httpAuth.get(`${environment.farsimanProducts}api/EconoMascotas/getatributosproductosdetallevalor/${productoId}`).map(r => {
      return r.json();
    });
  }

  DeleteProductoAtributoDetalle(productoDetalleId: string): Observable<any> {
    return this.httpAuth.get(`${environment.farsimanProducts}api/EconoMascotas/deleteproductoatributodetalle/${productoDetalleId}`);
  }
  SaveProductoAtributoDetalles(productoAtributoDetalles: ProductoAtributoDetalle[]): Observable<RespuestaSaveListAtributos> {

    productoAtributoDetalles.forEach(productoAtributoDetalle => {
      productoAtributoDetalle.usuarioAgregaId = Number(this.LoginService.Usuario.id);
    });

    const uri = `${environment.farsimanProducts}api/EconoMascotas/saveproductoatributodetalles`;
    return this.http.post(uri, productoAtributoDetalles).map(r => { return r.json(); });
  }
  ObtenerProductosPorDescripcion(busqueda: string): Promise<Array<any>> {
    const promesa = new Promise<Array<any>>((resolve, reject) => {
      if (busqueda === null || busqueda.length < 3) {
        resolve(this.productosResultado);
        return;
      }

      const resultadoLocal = this.obtenerProductosEnLocal(busqueda);
      if (resultadoLocal.length > 0) {
        resolve(resultadoLocal);
        return;
      }
      const query = ` query { productosBusqueda (busqueda:"${busqueda}", top:10) {
                                productoId,
                                descripcion
                          }
                        }`;
      const request = {
        query: query
      };

      return this.httpAuth.post(`${environment.ecommerceApi}/graphql`, request).subscribe(r => {
        const queryRespuesta = r.json();
        const listaProductos = queryRespuesta.data.productosBusqueda;
        this.productosResultado = listaProductos as Array<any>;
        this.productosResultado.forEach(producto => {
          producto.searchData = `${producto.productoId} ${producto.descripcion}`;
        });
        resolve(this.productosResultado);
      });
    });
    return promesa;
  }

  private obtenerProductosEnLocal(descripcion: string): Array<any> {
    return this.productosResultado.filter((elemento) => elemento.descripcion.
    toLocaleLowerCase().indexOf(descripcion.toLocaleLowerCase()) !== -1);
  }
  productosResultado = new Array<any>();
}
