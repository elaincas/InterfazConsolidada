import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { environment } from "../../../../environments/environment";
import { HttpAuthService } from "../../../helpers/http/http-auth.service";
import { ActualizarNumerosDeFilaDto } from "../models/actualizar-numeros-de-fila.model";

@Injectable()
export class SeccionProductosService {
  constructor(private httpAuth: HttpAuthService) {}

  //#region Maestro - Sección Productos
  obtener() {
    const uri = `${environment.maestrosFarmaciaApi}/api/ProductoInformacion/SeccionProductos/Obtener`;
    return this.httpAuth.get(uri).map((respuesta) => {
      return respuesta.json();
    });
  }

  obtenerSSR() {
    const uri = `${environment.maestrosFarmaciaApi}/api/ProductoInformacion/SeccionProductos/ObtenerSSR`;
    return this.httpAuth.get(uri).map((respuesta) => {
      return respuesta.json();
    });
  }

  guardar(dto): Observable<any> {
    const uri = `${environment.maestrosFarmaciaApi}/api/ProductoInformacion/SeccionProductos/Crear`;
    return this.httpAuth.post(uri, dto).map((x) => x.json());
  }

  editar(dto): Observable<any> {
    const uri = `${environment.maestrosFarmaciaApi}/api/ProductoInformacion/SeccionProductos/actualizar`;
    return this.httpAuth.put(uri, dto).map((x) => x.json());
  }

  inactivar(id: number): Observable<any> {
    return this.httpAuth
      .post(
        `${environment.maestrosFarmaciaApi}/api/ProductoInformacion/SeccionProductos/inactivar/${id}`,
        null
      )
      .map((x) => x.json());
  }

  activar(id: number): Observable<any> {
    return this.httpAuth
      .post(
        `${environment.maestrosFarmaciaApi}/api/ProductoInformacion/SeccionProductos/activar/${id}`,
        null
      )
      .map((x) => x.json());
  }

  //#endregion

  //#region Detalle - Sección Productos Detalle
  obtenerDetalles(seccionProductoId: number) {
    const uri = `${environment.maestrosFarmaciaApi}/api/ProductoInformacion/SeccionProductos/obtenerDetalles/${seccionProductoId}`;
    return this.httpAuth.get(uri).map((respuesta) => {
      return respuesta.json();
    });
  }

  guardarDetalle(dto): Observable<any> {
    const uri = `${environment.maestrosFarmaciaApi}/api/ProductoInformacion/SeccionProductos/Detalle/crear`;
    return this.httpAuth.post(uri, dto).map((x) => x.json());
  }

  editarDetalle(dto): Observable<any> {
    const uri = `${environment.maestrosFarmaciaApi}/api/ProductoInformacion/SeccionProductos/Detalle/actualizar`;
    return this.httpAuth.put(uri, dto).map((x) => x.json());
  }

  inactivarDetalle(id: number): Observable<any> {
    return this.httpAuth
      .post(
        `${environment.maestrosFarmaciaApi}/api/ProductoInformacion/SeccionProductos/inactivar/detalle/${id}`,
        null
      )
      .map((x) => x.json());
  }

  activarDetalle(id: number): Observable<any> {
    return this.httpAuth
      .post(
        `${environment.maestrosFarmaciaApi}/api/ProductoInformacion/SeccionProductos/activar/detalle/${id}`,
        null
      )
      .map((x) => x.json());
  }
  //#endregion

  //#region Detalle - Tablas

  //#region Columnas
  agregarColumna(dto): Observable<any> {
    const uri = `${environment.maestrosFarmaciaApi}/api/ProductoInformacion/Tablas/columna`;
    return this.httpAuth.post(uri, dto).map((x) => x.json());
  }

  editarColumna(dto): Observable<any> {
    const uri = `${environment.maestrosFarmaciaApi}/api/ProductoInformacion/Tablas/columna`;
    return this.httpAuth.put(uri, dto).map((x) => x.json());
  }

  actualizarOrdenColumnas(dtos): Observable<any> {
    const uri = `${environment.maestrosFarmaciaApi}/api/ProductoInformacion/Tablas/columna/cambiar-orden`;
    return this.httpAuth.put(uri, dtos).map((x) => x.json());
  }

  activarColumna(id: number): Observable<any> {
    return this.httpAuth
      .post(
        `${environment.maestrosFarmaciaApi}/api/ProductoInformacion/Tablas/columna/activar/${id}`,
        null
      )
      .map((x) => x.json());
  }

  inactivarColumna(descripcionColumna: string): Observable<any> {
    return this.httpAuth
      .post(
        `${environment.maestrosFarmaciaApi}/api/ProductoInformacion/Tablas/columna/inactivar/porDescripcion/${descripcionColumna}`,
        null
      )
      .map((x) => x.json());
  }
  //#endregion

  //#region Filas
  agregarCeldas(dtos: any[], seccionProductoId: number): Observable<any> {
    const uri = `${environment.maestrosFarmaciaApi}/api/ProductoInformacion/Tablas/celdas?seccionProductoId=${seccionProductoId}`;
    return this.httpAuth.post(uri, dtos).map((x) => x.json());
  }

  editarCeldas(dtos: any[]): Observable<any> {
    const uri = `${environment.maestrosFarmaciaApi}/api/ProductoInformacion/Tablas/celdas`;
    return this.httpAuth.put(uri, dtos).map((x) => x.json());
  }

  inactivarFila(numeroFila: number): Observable<any> {
    const uri = `${environment.maestrosFarmaciaApi}/api/ProductoInformacion/Tablas/fila/inactivar/${numeroFila}`;
    return this.httpAuth.post(uri, null).map((x) => x.json());
  }

  actualizarNumerosDeFila(dto: ActualizarNumerosDeFilaDto): Observable<any> {
    const uri = `${environment.maestrosFarmaciaApi}/api/ProductoInformacion/Tablas/fila/actualizarNumerosDeFila`;
    return this.httpAuth.post(uri, dto).map((x) => x.json());
  }


  //#endregion

  //#endregion

  //#region Tabla
  obtenerTabla(seccionProductoId: number) {
    const uri = `${environment.maestrosFarmaciaApi}/api/ProductoInformacion/Tablas/${seccionProductoId}`;
    return this.httpAuth.get(uri).map((respuesta) => {
      return respuesta.json();
    });
  }
  //#endregion
}
