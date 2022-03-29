import { Injectable } from '@angular/core';
import { HttpAuthService } from '../../../helpers/http/http-auth.service';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ConfiguracionProductosRecompraService {

  constructor(private httpAuth: HttpAuthService) {

  }

  // CancelarPedidos(pedidos: CancelarPedidosRecompra) {
  //   const request = JSON.stringify(pedidos);
  //   return this.httpAuth.post(
  //     `${environment.ecommerceUsuariosApi}/api/usuarios/reorder/internal/cancelar`,
  //     request, [{ name: 'content-type', value: "application/json" }]).map(r => {
  //       return r.json();
  //     });
  // }

  // PosponerPedidos(pedidos: PosponerPedidosRecompra) {
  //   const request = JSON.stringify(pedidos);
  //   return this.httpAuth.post(
  //     `${environment.ecommerceUsuariosApi}/api/usuarios/reorder/internal/posponer`,
  //     request, [{ name: 'content-type', value: "application/json" }]).map(r => {
  //       return r.json();
  //     });
  // }

  // GenerarPedidos(pedidosRecompra: GenerarPedidosRecompra) {
  //   const request = JSON.stringify(pedidosRecompra);
  //   return this.httpAuth.post(
  //     `${environment.ecommerceUsuariosApi}/api/usuarios/reorder/internal/pedido/generar`,
  //     request, [{ name: 'content-type', value: "application/json" }]).map(r => {
  //       return r.json();
  //     });
  // }

  GuardarConfiguracionProductos(productos: any[]) {
    return this.httpAuth.put(`${environment.recompraConfiguracionProductos}/api/configuracion-productos/guardar-configuracion`, productos).map(r => {
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
    return this.httpAuth.post(`${environment.recompraConfiguracionProductos}/api/configuracion-productos/obtener-configuracion`, filtros).map(r => {
      return r.json();
    });
  }

  ObtenerTodosProductos() {
    return this.httpAuth.get(`${environment.maestrosFarmaciaApi}/api/productos/todos`).map(r => {
      return r.json();
    });
  }

}
