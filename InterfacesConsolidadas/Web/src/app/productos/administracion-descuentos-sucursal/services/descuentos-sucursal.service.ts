import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { HttpAuthService } from "../../../helpers/http/http-auth.service";
import { ProductoDescuentoSucursal } from "../models/producto-descuento-sucursal.model";
import { Producto } from "../models/producto.model";
import { Sucursal } from "../models/sucursal.model";

@Injectable()
export class DescuentosSucursalService {
  private controllerUrl = "api/Productos/Descuentos/Sucursal";
  constructor(private httpAuthService: HttpAuthService) {}

  obtenerSucursales(): Observable<Sucursal[]> {
    const url = `${environment.ecommerceApi}/${this.controllerUrl}/Sucursales`;
    return this.httpAuthService.get(url).map((r) => r.json());
  }

  obtenerProductosDescuentosSucursal(
    codigoSucursal: number
  ): Observable<ProductoDescuentoSucursal[]> {
    const url = `${environment.ecommerceApi}/${this.controllerUrl}/Listado`;
    return this.httpAuthService
      .get(url, [{ name: "x-codigo-sucursal", value: codigoSucursal }])
      .map((r) => r.json());
  }

  obtenerProductosDescuentosSucursalPorFechas(
    codigoSucursal: number,
    desde: Date,
    hasta: Date
  ): Observable<ProductoDescuentoSucursal[]> {
    const url = `${environment.ecommerceApi}/${
      this.controllerUrl
    }/ObtenerPorFechas/${desde.toISOString()}/${hasta.toISOString()}`;
    return this.httpAuthService
      .get(url, [{ name: "x-codigo-sucursal", value: codigoSucursal }])
      .map((r) => r.json());
  }

  buscarProductos(
    busqueda: string,
    codigoSucursal: number
  ): Observable<Producto[]> {
    const url = `${environment.ecommerceApi}/${this.controllerUrl}/Productos/${busqueda}`;
    return this.httpAuthService
      .get(url, [{ name: "x-codigo-sucursal", value: codigoSucursal }])
      .map((r) => r.json());
  }

  agregarProductosDescuentosSucursal(
    productosDescuentosSucursal: ProductoDescuentoSucursal[],
    codigoSucursal: number
  ): Observable<ProductoDescuentoSucursal[]> {
    const url = `${environment.ecommerceApi}/${this.controllerUrl}/Agregar`;
    return this.httpAuthService
      .post(url, productosDescuentosSucursal, [
        { name: "x-codigo-sucursal", value: codigoSucursal },
      ])
      .map((r) => r.json());
  }

  modificarProductoDescuentoSucursal(
    codigoSucursal: number,
    productoDescuentoSucursal: ProductoDescuentoSucursal,
    usuarioModifica: number
  ): Observable<ProductoDescuentoSucursal> {
    const url = `${environment.ecommerceApi}/${this.controllerUrl}/Modificar/${usuarioModifica}`;
    return this.httpAuthService
      .put(url, productoDescuentoSucursal, [
        { name: "x-codigo-sucursal", value: codigoSucursal },
      ])
      .map((r) => r.json());
  }
}
