import { Injectable} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Finalidades } from '../../_Clases/Finalidades';
import { Http } from '@angular/http';
import { MovimientoDeProducto } from '../../_Clases/MovimientoDeProducto';
import { environment } from '../../../../../environments/environment';

@Injectable()
export  class TrasladarProductosService {

  private url = environment.inventarioImpulso;

constructor(private http: Http) {
}

  ObtenerTransacciones(): Observable<Array<Finalidades>> {
    const url = `${this.url}` + 'ObtenerFinalidades';
    return this.http.get(url).map(r => r.json());
  }
  ObtenerProductosInventarioId(productoId:number): Observable<any> {
    const url = `${this.url}` + 'Obtener/ProductoInventarioId/'+productoId;
    return this.http.get(url).map(r => r.json());
  }
  ObtenerSucursales(): Observable<any> {
    const url = `${this.url}` + 'ObtenerSucursales';
    return this.http.get(url).map(r => r.json());
  }
  AgregarTraslados(movimiento: MovimientoDeProducto)
  {
    const url = `${this.url}` + 'IngresarMovimiento';
    return this.http.post(url,movimiento).map(x=>x.json());
  }
  ObtenerProductos(){
    const url = `${this.url}` + 'ObtenerProductos';
    return this.http.get(url).map(x=>x.json());
    
  }

}