import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../../../environments/environment';
import { ProductoRecarga } from '../models/productoRecarga.model';
import { Operador, OperadorTipoProducto } from '../models/operadores.model';
import { ProductoRecargaConfigurado } from '../models/productoRecargaConfigurado.model';
import { RespuestaEstandar } from '../../../helpers/respuestasGeneralesEstandar/respuesta.core.standar';
import { RespuestaConfiguracionRecarga } from '../models/respuestaConfiguracionRecarga';

@Injectable()
export class AdministracionRecargasService {

  constructor(private http: Http) {

  }
  ObtenerTodosProductosRecarga(): Observable<ProductoRecarga[]> {
    return this.http.get(`${environment.maestrosFarmaciaApi}/api/ProductosRecargas/recargas`).map(r => {
      return r.json() as ProductoRecarga[];
    });
  }

  ObtenerOperadores(): Observable<Operador[]>{
    return this.http.get(`${environment.maestrosFarmaciaApi}/api/ProductosRecargas/operadores`).map(r => {
      return r.json() as Operador[];
    });
  }

  ObtenerOperadoresTipoProducto(): Observable<OperadorTipoProducto[]>{
    return this.http.get(`${environment.maestrosFarmaciaApi}/api/ProductosRecargas/recargasTipos`).map(r => {
      return r.json() as OperadorTipoProducto[];
    });
  }

  RegistrarRecargaConfigurada(recarga: ProductoRecargaConfigurado): Observable<RespuestaEstandar<RespuestaConfiguracionRecarga>>{
    const uri = `${environment.maestrosFarmaciaApi}/api/ProductosRecargas/GuardarConfiguracionRecarga`;
    return this.http.post(uri, recarga).map(data => data.json() as RespuestaEstandar<RespuestaConfiguracionRecarga>);
  }

  EditarRecargaConfigurada(recarga: ProductoRecargaConfigurado): Observable<RespuestaEstandar<RespuestaConfiguracionRecarga>>{
    const uri = `${environment.maestrosFarmaciaApi}/api/ProductosRecargas/GuardarConfiguracionRecarga`;
    return this.http.put(uri, recarga).map(data => data.json() as RespuestaEstandar<RespuestaConfiguracionRecarga>);
  }

  ObtenerRecargasConfiguradas(): Observable<ProductoRecargaConfigurado[]> {
    return this.http.get(`${environment.maestrosFarmaciaApi}/api/ProductosRecargas/RecargasConfiguradas`).map(r => {
      return r.json() as ProductoRecargaConfigurado[];
    });
  }

  ActivarRecargaConfigurada(ProductoRecargaId: string): Observable<RespuestaEstandar<boolean>>{
    const uri = `${environment.maestrosFarmaciaApi}/api/ProductosRecargas/ActivarRecarga/${ProductoRecargaId}`;
    return this.http.post(uri,null).map(data => data.json() as RespuestaEstandar<boolean>);
  }

  DesactivarRecargaConfigurada(ProductoRecargaId: string): Observable<RespuestaEstandar<boolean>>{
    const uri = `${environment.maestrosFarmaciaApi}/api/ProductosRecargas/DesactivarRecarga/${ProductoRecargaId}`;
    return this.http.post(uri, null).map(data => data.json() as RespuestaEstandar<boolean>);
  }

}

