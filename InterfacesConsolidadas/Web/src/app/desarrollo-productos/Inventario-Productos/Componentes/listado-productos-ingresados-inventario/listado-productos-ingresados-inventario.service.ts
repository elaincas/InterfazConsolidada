import { Http } from '@angular/http';
import {IngresoProductos } from '../../_Clases/IngresoProductos';
import { MovimientoDeProducto } from '../../_Clases/MovimientoDeProducto';
import {Observable} from 'rxjs/Observable';
import { InventarioProductosUbicacion, TipoTransaccion } from '../../_Clases/InventarioProductosUbicacion';
import {Distribuidores} from '../../_Clases/Distribuidores';
import {Sucursales} from '../../_Clases/Sucursales';
import 'rxjs/add/operator/map';
import {Injectable} from '@angular/core';
import {Finalidades} from "../../_Clases/Finalidades";
import { Promise } from 'q';
import { environment } from '../../../../../environments/environment';

@Injectable()
export class InventarioProductosService {

  private url = environment.inventarioImpulso;
  constructor(private http: Http) {}

  ObtenerInventario(inventario:InventarioProductosUbicacion):  Observable<Array<InventarioProductosUbicacion>>{
    const url = `${this.url}` + 'ObtenerProductosInventario';
    return this.http.post(url,inventario).map(r => r.json());
  }
  
  ObtenerTransacciones(): Observable<Array<Finalidades>> {
    const url = `${this.url}` + 'ObtenerFinalidades';
    return this.http.get(url).map(r => r.json());
  }
 
  
}

  
 