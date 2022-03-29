import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CustomStore } from '../../../helpers/respuestas/custom-store';
import { Agente } from '../_Clases/agente';
import { Distribuidores } from '../_Clases/Distribuidores';
import { Finalidades } from '../_Clases/Finalidades';
import { IngresoInventarioSucursal } from '../_Clases/ingreso-inventario-sucursal';
import { IngresoInventarioSucursalDetalle } from '../_Clases/ingreso-inventario-sucursal-detalle';
import { MovimientoDeProducto } from '../_Clases/MovimientoDeProducto';
import { Productos} from '../_Clases/Productos';
@Injectable()
export class InventarioProductosImpulsadoService {
  private url = environment.inventarioImpulso;
  constructor(private http: Http) { }
  ObtenerDistribuidoresFiltrado(pagina:string,paginaTamanio, filtro:string): Promise<CustomStore<Distribuidores>>{
    let filtrostring="/null";
    if(filtro!=""){
      filtrostring="/"+filtro
    }
    const url = `${this.url}ObtenerDistribuidoresFiltrado/${pagina}/${paginaTamanio}`+filtrostring;
    return this.http.get(url)
      .map(r => r.json() as CustomStore<Distribuidores>).toPromise();
  }

  ObtenerProveedor(pagina:string,paginaTamanio,filtro:string): Promise<any[]> {
    let filtrostring="/null";
    if(filtro!=""){
      filtrostring="/"+filtro
    }
    const url = `${this.url}ObtenerProveedor/${pagina}/${paginaTamanio}`+filtrostring;
    return this.http.get(url)
      .map(r => r.json()).toPromise();
  }

  ObtenerProductos(pagina:string,paginaTamanio, filtro:string): Promise<CustomStore<Productos>>{
    let filtrostring="/null";
    if(filtro!=""){
      filtrostring="/"+filtro
    }
    const url = `${this.url}ObtenerProductosFiltrado/${pagina}/${paginaTamanio}`+filtrostring;
    return this.http.get(url)
      .map(r => r.json() as CustomStore<Productos>).toPromise();
  }

  ObtenerProductosConInventario(pagina:string,paginaTamanio, filtro:string): Promise<CustomStore<Productos>>{
    let filtrostring="/null";
    if(filtro!=""){
      filtrostring="/"+filtro
    }
    const url = `${this.url}ObtenerProductosConInventario/${pagina}/${paginaTamanio}`+filtrostring;
    return this.http.get(url)
      .map(r => r.json() as CustomStore<Productos>).toPromise();
  }
  ObtenerSucursalesFiltradas(pagina:string,paginaTamanio, filtro:string): Promise<CustomStore<any>>{
    let filtrostring="/null";
    if(filtro!=""){
      filtrostring="/"+filtro
    }
    const url = `${this.url}ObtenerSucursalesFiltradas/${pagina}/${paginaTamanio}`+filtrostring;
    return this.http.get(url)
      .map(r => r.json() as CustomStore<any>).toPromise();
  }


  ObtenerIngresosDeProductosReporte(filtro:any): Observable<any>{

    const url = `${this.url}ObtenerIngresosDeProductosReporte`;
    return this.http.post(url,filtro)
      .map(r => r.json() );
  }
  ObtenerFinalidades(): Observable<any[]> {
    const url = `${this.url}` + 'ObtenerFinalidades';
    return this.http.get(url)
      .map(r => r.json());
  }

  ObtenerAgente(agenteId:string): Observable<Agente> {
    const url = `${this.url}ObtenerAgente/${agenteId}`;
    return this.http.get(url)
      .map(r => r.json());
  }

  ObtenerMovimientoFiltradosPorSucursal(pagina:string,paginaTamanio,sucursalId:number, filtro:string): Promise<CustomStore<MovimientoDeProducto>>{
    let filtrostring="/null";
    if(filtro!=""){
      filtrostring="/"+filtro
    }
    const url = `${this.url}ObtenerMovimientoFiltradosPorSucursal/${pagina}/${paginaTamanio}/${sucursalId}`+filtrostring;
    return this.http.get(url)
      .map(r => r.json() as CustomStore<MovimientoDeProducto>).toPromise();
  }
  ObtenerMovimientoProductoParaIngresoSucursal(MovimientoProductoId:number): Observable<IngresoInventarioSucursalDetalle[]> {
    const url = `${this.url}ObtenerMovimientoProductoParaIngresoSucursal/${MovimientoProductoId}`;
    return this.http.get(url)
      .map(r => r.json());
  }
  IngresarTrasladoSucursal(ingresoInventarioSucursal:IngresoInventarioSucursal): Observable<any> {
    const url = `${this.url}IngresarTrasladoSucursal`;
    return this.http.post(url,ingresoInventarioSucursal)
      .map(r => r.json());
  }
}
