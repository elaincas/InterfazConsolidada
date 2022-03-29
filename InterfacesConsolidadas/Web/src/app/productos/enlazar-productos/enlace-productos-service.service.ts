import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpAuthService } from '../../helpers/http/http-auth.service';
import { LoginService } from '../../login/services/login.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ProductoEnlace } from './models/productoenlace.model';

@Injectable()

export class EnlaceProductosService {

    constructor(private http: Http,
        private httpAuth: HttpAuthService,
        private loginService: LoginService) {}

    
ObtenerTipoEnlaceProductos(): Observable<Array<any>> {
    const url = `${environment.ecommerceApi}/api/Productos/obtenerTipoEnlacesProductos`;
    return this.http.get(url).map(r => r.json());
  }
    
ObtenerProductos(): Observable<Array<any>> {
    const url = `${environment.ecommerceApi}/api/Productos/obtenerProducto`;
    return this.http.get(url).map(r => r.json());
  }
  ELiminarEnlaceProducto(productoEnlace: ProductoEnlace): Observable<Array<any>> {
    const url = `${environment.ecommerceApi}/api/Productos/eliminarEnlazarProducto`;
    return this.http.post(url,productoEnlace).map(r => r.json());
  }
  obtenerProductoEnlazadosPorProductoId(productoId: string): Observable<Array<any>> {
    const url = `${environment.ecommerceApi}/api/Productos/obtenerProductoEnlazados/`+productoId;
    return this.http.get(url).map(r => r.json());
  }
  enlazarProducto(productoEnlace: ProductoEnlace): Observable<any> {
    const url = `${environment.ecommerceApi}/api/Productos/enlazarProducto`;
    return this.http.post(url,productoEnlace).map(r => r.json());
  }

}