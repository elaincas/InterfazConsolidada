import { Http, Request, Headers,  RequestOptions } from '@angular/http';
import { Productos} from '../../_Clases/Productos';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ProductosMaestros} from '../../_Clases/ProductosMaestros';

import 'rxjs/add/operator/map';
import { environment } from '../../../../../environments/environment';
import { Distribuidores } from '../../_Clases/Distribuidores';
import { CustomStore } from '../../../../helpers/respuestas/custom-store';

@Injectable()
export class AgregarProductosService {

  private url = environment.inventarioImpulso;
  constructor(private http: Http) {}

  obtenerProductos(): Observable<Productos[]> {
    const url = `${this.url}` + 'ObtenerProductos/0/10';
    return this.http.get(url)
      .map(r => r.json());
  }
  ObtenerDistribuidores(): Observable<Distribuidores[]> {
    const url = `${this.url}` + 'ObtenerDistribuidores';
    return this.http.get(url)
      .map(r => r.json());
  }




  obtenerProductoMaestroPorId(productoId: string): Observable<ProductosMaestros> {
    const url = `${this.url}` + 'ObtenerProductoMaestroPorId/' + productoId;
    return this.http.get(url)
      .map(r => r.json());
  }

  agregarProducto(producto: Productos) {
    const url = `${this.url}` + 'CrearProducto/{producto}';
    return this.http.post(url, producto)
      .map(r => r.json());
  }
  DescontinuarProducto(producto: Productos) {
    const url = `${this.url}` + 'DescontinuarProducto/{producto}';
    return this.http.post(url, producto)
      .map(r => r.json());
  }
  ActualizarProducto(producto:Productos){
    const url = `${this.url}` + 'ActualizarProducto';
    return this.http.post(url, producto)
      .map(r => r.json());
  }
}
export function isNull(objeto: any): boolean {
  return objeto == null || objeto == undefined || objeto.length == 0;
}

export function isNullEmptyOrWhiteSpace(texto: string): boolean {
  if (isNull(texto)) {
    return true;
  }
  return texto == "" || texto == " ";
}
