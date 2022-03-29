
import { Injectable} from '@angular/core';
import { TipoTransaccion, InventarioProductosUbicacion } from '../../_Clases/InventarioProductosUbicacion';
import { Observable } from 'rxjs/Observable';
import { Finalidades } from '../../_Clases/Finalidades';
import { Http } from '@angular/http';
import { MovimientoDeProducto } from '../../_Clases/MovimientoDeProducto';
import { Sucursales } from '../../_Clases/Sucursales';
import { environment } from '../../../../../environments/environment';

@Injectable()
export  class InventarioService {

  private url =environment.inventarioImpulso;
  private html: string;
constructor(private http: Http) {
}

  ObtenerSucursales(): Observable<Array<Sucursales>> {
    const url = `${this.url}` + 'ObtenerSucursales/';
    return this.http.get(url).map(r => r.json());
  }
  ObtenerInventario(sucursal: number): Observable<Array<any>  > {
    const url = `${this.url}` + 'DevolverInventario/'+sucursal;
    return this.http.get(url).map(r => r.json());
  }
  
}