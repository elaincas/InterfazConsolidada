import { Http } from '@angular/http';
import {IngresoProductos } from '../../_Clases/IngresoProductos';
import { MovimientoDeProducto } from '../../_Clases/MovimientoDeProducto';
import {Observable} from 'rxjs/Observable';
import { InventarioProductosUbicacion } from '../../_Clases/InventarioProductosUbicacion';
import {Distribuidores} from '../../_Clases/Distribuidores';
import {Sucursales} from '../../_Clases/Sucursales';
import 'rxjs/add/operator/map';
import {Injectable} from '@angular/core';
import {Finalidades} from "../../_Clases/Finalidades";
import { environment } from '../../../../../environments/environment';

@Injectable()
export class IngresarProductosService {

  private url = environment.inventarioImpulso
  constructor(private http: Http) {}

  ObtenerIngresosDeProductos(): Observable<IngresoProductos[]> {
    const url = `${this.url}` + 'ObtenerIngresosDeProductos';
    return this.http.get(url)
      .map(r => r.json());
  }

  IngresarProductos(ingresos: IngresoProductos) {
    const url = `${this.url}` + 'IngresarProductos';
     return this.http.post(url, ingresos)
       .map(r => r.json());
  }

  ObtenerDistribuidores(): Observable<Distribuidores[]> {
    const url = `${this.url}` + 'ObtenerDistribuidores';
    return this.http.get(url)
      .map(r => r.json());
  }

  ObtenerSucursales(): Observable<Sucursales[]> {
    const url = `${this.url}` + 'ObtenerSucursales';
    return this.http.get(url)
      .map(r => r.json());
  }

  ObtenerFinalidades(): Observable<Finalidades[]> {
    const url = `${this.url}` + 'ObtenerFinalidades';
    return this.http.get(url)
      .map(r => r.json());
  }
}
