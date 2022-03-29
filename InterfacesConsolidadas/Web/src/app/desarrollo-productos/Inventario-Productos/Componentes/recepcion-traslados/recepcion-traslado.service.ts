import { Injectable} from '@angular/core';
import { TipoTransaccion, InventarioProductosUbicacion } from '../../_Clases/InventarioProductosUbicacion';
import { Observable } from 'rxjs/Observable';
import { Finalidades } from '../../_Clases/Finalidades';
import { Http } from '@angular/http';
import { MovimientoDeProducto } from '../../_Clases/MovimientoDeProducto';
import { environment } from '../../../../../environments/environment';

@Injectable()
export  class RecepcionTrasladoService {

  private url = environment.inventarioImpulso;
constructor(private http: Http) {
}

  ObtenerTraslados(usuarioID: number): Observable<Array<any>> {
    const url = `${this.url}` + 'RecepcionMovimientos/'+usuarioID;
    return this.http.get(url).map(r => r.json());
  }
  RealizarSalida(salidas: Array<any>): Observable<any> {
    const url = `${this.url}` + 'Realizar/Salida';
    return this.http.post(url,salidas).map(r => r.json());
  }
  ObtenerSucursales(): Observable<any> {
    const url = `${this.url}` + 'ObtenerSucursales';
    return this.http.get(url).map(r => r.json());
  }
}