
import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Productos} from '../../_Clases/Productos';
import {Observable} from 'rxjs/Observable';
import {InventarioProductosUbicacion} from '../../_Clases/InventarioProductosUbicacion';
import {isUndefined} from "util";
import { environment } from '../../../../../environments/environment';

@Injectable()
export class TablaAgregarProductosService {
  private url = environment.inventarioImpulso;
  constructor(private http: Http) {}

  ObtenerProductoImpulsadoPorId(productoId: number): Observable<Productos> {
    const url = `${this.url}` + 'ObtenerProductoImpulsadoPorId/' + productoId;
    return this.http.get(url)
      .map(r =>
        r.json()
      );
  }
  ObtenerProducto(){
    const url = `${this.url}` + 'ObtenerProductos/';
    return this.http.get(url)
      .map(r =>
        r.json()
      );
  }
}
