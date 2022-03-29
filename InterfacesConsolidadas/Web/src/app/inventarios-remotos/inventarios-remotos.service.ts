import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpAuthService } from '../helpers/http/http-auth.service';
import { Respuesta, RespuestaTipo } from '../helpers/respuestas/respuesta';
import { AuxiliarFiltro } from './inventarios/models/filtroAuxiliar.model';
import { TransaccionInventarioRemotoDto } from './inventarios/models/transaccion-inventario-remoto.model';
@Injectable()
export class InventariosRemotosService {

  private url = environment.inventarioRemotosApi+'/api/inventarioremoto'

  constructor(private httpAuth: HttpAuthService, private http: Http) { }

  ObtenerEstados(): Observable<any[]>{
    const uri = `${this.url}/obtenerEstados`;
        return this.http.get(uri).map(r => r.json() as any[]);
  }
  ObtenerTransaccionTipos(): Observable<any[]>{
    const uri = `${this.url}/obtenerTransaccionTipo`;
        return this.http.get(uri).map(r => r.json() as any[]);
  }
  ObtenerProductos(sucursalId: number,esIngresoDeTraslado : boolean = true): Observable<any[]>{
    const uri = `${this.url}/obtenerProductos/`+sucursalId+`/`+esIngresoDeTraslado;
        return this.http.get(uri).map(r => r.json() as any[]);
  }
  ObtenerSucursales(): Observable<any[]>{
    const uri = `${this.url}/obtenerSucursales`;
        return this.http.get(uri).map(r => r.json() as any[]);
  }
  ObtenerTrasladosPendientesSucursal(sucursalId: number): Observable<any[]>{
    const uri = `${this.url}/obtenerPendientes/`+sucursalId;
    return this.http.get(uri).map(r => r.json() as any[]);
  }

  IngresarTransaccion(transaccion : TransaccionInventarioRemotoDto){
    let uri: string
    uri = `${this.url}/insertarTransaccion`;
    return this.http.post(uri, transaccion).map(x => x.json() as any);
  }
  ObtenerAuxiliar(filtros : AuxiliarFiltro){
    let uri: string
    uri = `${this.url}/obtenerAuxiliar`;
    return this.http.post(uri, filtros).map(x => x.json() as any);
  }
  ObtenerTrasladosRecibidos(sucursalId : number){
    let uri: string
    uri = `${this.url}/obtenerTrasladosRecibidos/`+sucursalId;
    return this.http.get(uri).map(x => x.json() as any);
  }
}