import { ProductoAgregarPedido } from "./../_models/ProductoAgregarPedido";
import { FormReportePedidos } from "./../_models/FormReportePedidos";
import { ProductoInventario } from "./../_models/ProductoInventario";
import { Observable } from "rxjs/Observable";
import { ReporteClienteSuscrito } from "./../_models/reporteClienteSuscrito.modal";
import { ReporteVenta } from "./../_models/reporteVenta.model";
import { Injectable } from "@angular/core";
import { HttpAuthService } from "../../../helpers/http/http-auth.service";
import { environment } from "../../../../environments/environment";
import { GenerarPedidosRecompra } from "../_models/GenerarPedidosRecompra";
import { CancelarPedidosRecompra } from "../_models/CancelarPedidosRecompra";
import { PosponerPedidosRecompra } from "../_models/PosponerPedidosRecompra";
import { CambiarLugarPedidosRecompra } from "../_models/CambiarLugarPedidosRecompra";
import { CambiarTipoPagoPedidoReorder } from "../_models/CambiarTipoPagoPedidoReorder";
import { HttpParams, HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";

@Injectable()
export class PedidosRecompraService {
  constructor(private httpAuth: HttpAuthService, private http: HttpClient) {}

  CancelarPedidos(pedidos: CancelarPedidosRecompra) {
    const request = JSON.stringify(pedidos);
    return this.httpAuth
      .post(
        `${environment.ecommerceUsuariosApi}/api/usuarios/reorder/internal/cancelar`,
        request,
        [{ name: "content-type", value: "application/json" }]
      )
      .map((r) => {
        return r.json();
      });
  }

  PosponerPedidos(pedidos: PosponerPedidosRecompra) {
    const request = JSON.stringify(pedidos);
    return this.httpAuth
      .post(
        `${environment.ecommerceUsuariosApi}/api/usuarios/reorder/internal/posponer`,
        request,
        [{ name: "content-type", value: "application/json" }]
      )
      .map((r) => {
        return r.json();
      });
  }

  PosponerPedidosClientes(pedidosClientes: PosponerPedidosRecompra[]) {
    const request = JSON.stringify(pedidosClientes);
    return this.httpAuth
      .post(
        `${environment.ecommerceUsuariosApi}/api/usuarios/reorder/internal/posponer-multiple`,
        request,
        [{ name: "content-type", value: "application/json" }]
      )
      .map((r) => {
        return r.json();
      });
  }

  CambiarTipoDePagoPedido(pedido: CambiarTipoPagoPedidoReorder) {
    const request = JSON.stringify(pedido);
    return this.httpAuth
      .post(
        `${environment.ecommerceUsuariosApi}/api/usuarios/reorder/internal/cambiar-tipo-pago`,
        request,
        [{ name: "content-type", value: "application/json" }]
      )
      .map((r) => {
        return r.json();
      });
  }

  CambiarLugarPedidos(pedidos: CambiarLugarPedidosRecompra) {
    const request = JSON.stringify(pedidos);
    return this.httpAuth
      .post(
        `${environment.ecommerceUsuariosApi}/api/usuarios/reorder/internal/cambiar-lugar-entrega`,
        request,
        [{ name: "content-type", value: "application/json" }]
      )
      .map((r) => {
        return r.json();
      });
  }

  GenerarPedidos(pedidosRecompra: GenerarPedidosRecompra) {
    const request = JSON.stringify(pedidosRecompra);
    return this.httpAuth
      .post(
        `${environment.ecommerceUsuariosApi}/api/usuarios/reorder/internal/pedido/generar`,
        request,
        [{ name: "content-type", value: "application/json" }]
      )
      .map((r) => {
        return r.json();
      });
  }

  ObtenerMensajeDePedidosDeRecompra(pedidosRecompra: any[]): Observable<any> {
    const uri = `${environment.recompraConfiguracionProductos}/api/configuracion-productos/ObtenerMensajeDePedidosDeRecompra`;
    return this.httpAuth.post(uri, pedidosRecompra).map((x) => x.json());
  }

  ObtenerPedidos(datos: FormReportePedidos) {
    const fechaPedido = datos.fechaPedido
      ? datos.fechaPedido.toDateString()
      : null;
    const uri =
      `${environment.ecommerceUsuariosApi}/api/usuarios/reorder/internal?fechaPedido=${fechaPedido}` +
      `&usuarioId=${datos.usuarioId}&pedidoReorderEstado=${datos.pedidoReorderEstado}&empresaId=${datos.empresaId}`;
    return this.httpAuth.get(uri).map((pedidos) => {
      const pedidosJson = pedidos.json().pedidosClientes;
      return pedidosJson;
    });
  }

  ObtenerReporteDeVentas(
    fechaDesde: Date,
    fechaHasta: Date, empresaID : number = 2
  ): Observable<ReporteVenta[]> {
    const uri = `${environment.recompraConfiguracionProductos}/api/reportes/ObtenerReporteDeVentas`;
    const reporte = { fechaDesde: fechaDesde, fechaHasta: fechaHasta, empresa: empresaID };
    return this.httpAuth.post(uri, reporte).map((r) => r.json());
  }

  ObtenerReporteDeClientesSuscritos(
    mostrarClientesSuscritos: boolean
  ): Observable<ReporteClienteSuscrito[]> {
    const uri =
      `${environment.recompraConfiguracionProductos}/api/reportes/ObtenerClientesSuscritos/` +
      mostrarClientesSuscritos;
    return this.httpAuth.get(uri).map((r) => r.json());
  }

  BuscarClientes(params: HttpParams): Observable<any[]> {
    const uri = `${environment.recompraConfiguracionProductos}/api/reportes/BuscarClientes`;
    return this.http.get<any[]>(uri, { params: params });
  }

  ObtenerResumenDeFacturas(
    fechaDesde: Date,
    fechaHasta: Date,
    empresaId: number
  ): Observable<any[]> {
    const uri = `${environment.recompraConfiguracionProductos}/api/reportes/ObtenerResumenDeFacturas`;
    const resumen = {
      fechaDesde: fechaDesde,
      fechaHasta: fechaHasta,
      empresa: empresaId
    };
    return this.httpAuth.post(uri, resumen).map((r) => r.json());
  }

  ObtenerInventarioDeProductosPorSucursal(
    sucursalId: number,
    productosId: string[],
    incluirInventarioCiudad: boolean = false
  ): Observable<ProductoInventario[]> {
    const uri = `${environment.UrlApiFarmaciaSimanCom}/api/productos/buscador/porId/sucursal/${sucursalId}/${incluirInventarioCiudad}`;

    return this.http.post<any[]>(uri, productosId).pipe(
      map((r) =>
        r.map(
          (p: {
            productoId: string;
            prod_Desc: string;
            invActual: number;
          }) => ({
            sucursalId: sucursalId,
            productoId: p.productoId,
            descripcion: p.prod_Desc,
            inventarioActual: p.invActual,
          })
        )
      )
    );
  }

  ObtenerInventarioDeProductosPorColonia(
    coloniaId: number,
    productosId: string[]
  ): Observable<ProductoInventario[]> {
    const uri = `${environment.UrlApiFarmaciaSimanCom}/api/sucursales/ConectarSucursalColonia/${coloniaId}`;

    return this.ObtenerSucursalIdAsignadaAColonia(coloniaId).flatMap((r) => {
      return this.ObtenerInventarioDeProductosPorSucursal(r, productosId);
    });
  }

  ObtenerSucursalIdAsignadaAColonia(coloniaId: number): Observable<number> {
    const uri = `${environment.UrlApiFarmaciaSimanCom}/api/sucursales/ConectarSucursalColonia/${coloniaId}`;

    return this.httpAuth
      .get(uri)
      .map((r) => r.json())
      .catch((error) => Observable.of(5));
  }

  EditarObservacionesDePedido(data: {
    pedidoReorderId: number;
    observaciones: string;
  }) {
    const uri = `${environment.ecommerceUsuariosApi}/api/usuarios/reorder/internal/editar-observaciones/${data.pedidoReorderId}`;
    const dataRequest = JSON.stringify(data.observaciones);

    return this.httpAuth
      .post(uri, dataRequest, [
        { name: "content-type", value: "application/json" },
      ])
      .map((r) => r.json());
  }

  EditarHoraEntregaDePedido(data: { productoReorderId: number; time: Date }) {
    const uri = `${environment.ecommerceUsuariosApi}/api/usuarios/reorder/internal/cambiar-hora-entrega/${data.productoReorderId}`;
    const dataRequest = JSON.stringify(data.time);

    return this.httpAuth
      .post(uri, dataRequest, [
        { name: "content-type", value: "application/json" },
      ])
      .map((r) => r.json());
  }

  BuscarProductos(textSearch: string, empresaId: string) {
    let httpOptions: Object = {
      headers: new HttpHeaders({        
        'x-empresaid': `${empresaId}`
      })
    }
    const uri =
      `${environment.UrlApiFarmaciaSimanCom}/api/Productos/SugerenciasProducto/v2?text=${textSearch}` +
      `&mostrarNombreProducto=true`;

    return this.http.get<any>(uri, httpOptions);
  }

  ObtenerDetalleDeProducto(
    productoId: string,
    sucursalId: number,
    incluirInventarioCiudad: boolean
  ) {
    const uri =
      `${environment.UrlApiFarmaciaSimanCom}/api/productos/buscador/v2/detalle/?producto=${productoId}` +
      `&sucursal=${sucursalId}&incluirInventarioCiudad=${incluirInventarioCiudad}`;

    return this.http.get<any>(uri);
  }

  AgregarPedido(
    producto: ProductoAgregarPedido,
    usuarioId: number,
    fechaPedido: Date
  ) {
    const fechaPedidoString = fechaPedido ? fechaPedido.toDateString() : null;
    const uri =
      `${environment.ecommerceUsuariosApi}/api/usuarios/reorder/internal/agregar/${usuarioId}` +
      `?fechaPedido=${fechaPedidoString}`;

    return this.httpAuth.post(uri, producto).map((r) => r.json());
  }
}
