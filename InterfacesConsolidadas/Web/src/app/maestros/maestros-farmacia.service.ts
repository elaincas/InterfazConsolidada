import { Sucursal } from './../mercadeo/cupones/cupones-admin/models/Sucursal';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpAuthService } from '../helpers/http/http-auth.service';
import { environment } from '../../environments/environment.prod';
import { Empresa } from '../shared/Models/Empresa.model';

@Injectable()
export class MaestrosFarmaciaService {

  constructor(private httpAuth: HttpAuthService) {

  }

  ObtenerSucursales() {
    return this.httpAuth.get(`${environment.maestrosFarmaciaApi}/api/sucursales`).map(r => {
      return r.json();
    });
  }

  ObtenerDireccionesDeUsuarioEcommerce(usuarioId: number) {
    return this.httpAuth
      .get(`${environment.maestrosFarmaciaApi}/api/ecommerce-usuarios/direcciones/usuario/` + usuarioId).map(r => {
        return r.json();
      });
  }

  ObtenerDistribuidores() {
    return this.httpAuth.get(`${environment.maestrosFarmaciaApi}/api/distribuidores`).map(r => {
      return r.json();
    });
  }

  ObtenerLineas() {
    return this.httpAuth.get(`${environment.maestrosFarmaciaApi}/api/lineas`).map(r => {
      return r.json();
    });
  }

  ObtenerProveedores() {
    return this.httpAuth.get(`${environment.maestrosFarmaciaApi}/api/proveedores`).map(r => {
      return r.json();
    });
  }

  ObtenerProductos(filtros: any) {
    return this.httpAuth.post(`${environment.maestrosFarmaciaApi}/api/productos/filtrados`, filtros).map(r => {
      return r.json();
    });
  }

  ObtenerTodosProductos() {
    return this.httpAuth.get(`${environment.maestrosFarmaciaApi}/api/productos/todos`).map(r => {
      return r.json();
    });
  }

  ObtenerSucursalesDeCiudad(): Observable<Sucursal> {
    return this.httpAuth.get(`${environment.maestrosFarmaciaApi}/api/productos/todos`).map(r => {
      return r.json();
    });
  }

  ObtenerEmpresas(): Observable<Empresa[]> {
    const url = `${environment.maestrosFarmaciaApi}/api/empresas/ObtenerEmpresas`;
    return this.httpAuth.get(url).map(r => r.json());
  }

}
