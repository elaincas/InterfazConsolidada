import { Injectable } from '@angular/core';
import { HttpAuthService } from '../../helpers/http/http-auth.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { DistribuidorExterno } from './models/distribuidor-externo';
import { DistribuidorExternoCategorias } from './models/distribuidor-externo-categoria';
import { DistribuidorExternoCategoriaProductos } from './models/distribuidor-externo-categorias-productos';
import { LoadGridOptions } from './models/LoadGridOptions';
import { SucursalHabilitadaDistribuidor } from './models/SucursalHabilitadaDistribuidor';

@Injectable()
export class DistribuidoresExternosService {

constructor(private http: HttpAuthService) { }

ObtenerDistribuidores(): Observable<Array<any>> {
    const url = `${environment.distribuidoresApi}/api/DistribuidorExterno/obtenerDistribuidores`;
    return this.http.get(url).map(r => r.json());
  }
  ObtenerCategorias(): Observable<Array<any>> {
    const url = `${environment.distribuidoresApi}/api/DistribuidorExterno/obtenerCategorias`;
    return this.http.get(url).map(r => r.json());
  }
  ObtenerProductoCategoria(categoriaId: any): Observable<Array<any>> {
    const url = `${environment.distribuidoresApi}/api/DistribuidorExterno/obtenerProductoCategoria/`+categoriaId;
    return this.http.get(url).map(r => r.json());
  }
  ObtenerProductos(): Observable<Array<any>> {
    const url = `${environment.distribuidoresApi}/api/DistribuidorExterno/obtenerProductos`;
    return this.http.get(url).map(r => r.json());
  }
  
  AgregarDistribuidor(distribuidorExterno: DistribuidorExterno): Observable<any> {
    const url = `${environment.distribuidoresApi}/api/DistribuidorExterno/agregarDistribuidor`;
    return this.http.post(url,distribuidorExterno).map(r => r.json());
  }
  AgregarCategoria(categoria: DistribuidorExternoCategorias): Observable<any> {
    const url = `${environment.distribuidoresApi}/api/DistribuidorExterno/agregarCategoria`;
    return this.http.post(url,categoria).map(r => r.json());
  }
  AgregarProductoCategoria(productoCategoria: DistribuidorExternoCategoriaProductos): Observable<any> {
    const url = `${environment.distribuidoresApi}/api/DistribuidorExterno/agregarProductoCategoria`;
    return this.http.post(url,productoCategoria).map(r => r.json());
  }
  ActualizarProductoCategoria(productoCategoria: DistribuidorExternoCategoriaProductos): Observable<any> {
    const url = `${environment.distribuidoresApi}/api/DistribuidorExterno/actualizarProductoCategoria`;
    return this.http.post(url,productoCategoria).map(r => r.json());
  }
  ActualizarCategoria(categoria: DistribuidorExternoCategorias): Observable<any> {
    const url = `${environment.distribuidoresApi}/api/DistribuidorExterno/actualizarCategoria`;
    return this.http.post(url,categoria).map(r => r.json());
  }



  ActulizarProductosHugo( ): Observable<any> {
    const url = `${environment.ecommerceBuscadorApi}/api/sincronizador/sincronizarProductosEnHugo`;
    return this.http.get(url).map(r => r.json());
  }
  ObtenerSucursales( ): Observable<any> {
    const url = `${environment.ecommerceBuscadorApi}/api/common/obtenersucursales`;
    return this.http.get(url).map(r => r.json());
  }
  ObtenerSucursalesHabilitadas(gridOptions: LoadGridOptions ): Observable<any> {

    const uri = `${environment.ecommerceBuscadorApi}/api/common/gridSucrusaleshabilitadas/`;

    return this.http.post(uri, gridOptions).map(r => r.json());
  }

  GuardarSucursalHabilitadaExterna(sucursal: SucursalHabilitadaDistribuidor ): Observable<any> {

    const uri = `${environment.ecommerceBuscadorApi}/api/common/guardarSucursalhabilitadaexterna/`;

    return this.http.post(uri, sucursal).map(r => r.json());
  }
  ActualiazarSucursalHabilitadaExterna(sucursal: SucursalHabilitadaDistribuidor ): Observable<any> {

    const uri = `${environment.ecommerceBuscadorApi}/api/common/actualiazarsucursalhabilitadaexterna/`;

    return this.http.post(uri, sucursal).map(r => r.json());
  }
  SubirproductosExcel(formData : FormData,usuarioId:string ): Observable<any> {

    const uri = `${environment.distribuidoresApi}/api/DistribuidorExterno/agregarProductoCategoriaExcel/${usuarioId}/`;

    return this.http.post(uri, formData).map(r => r.json());
  }
}
