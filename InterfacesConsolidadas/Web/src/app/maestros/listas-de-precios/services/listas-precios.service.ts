import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { environment } from '../../../../environments/environment';
import { HttpAuthService } from '../../../helpers/http/http-auth.service';
import { LoginService } from '../../../login/services/login.service';
import { ListaPreciosProductoDto, ListaPreciosDto } from '../models/dto';

/* import {  } from '../models/Proveedor.models'; */

@Injectable()
export class ListasPreciosService {

  constructor(private http: Http, private httpAuth: HttpAuthService, private loginService: LoginService) { }

  obtenerListasPrecios(): Observable<Array<ListaPreciosDto>> {
    return this.httpAuth.get(`${environment.maestrosFarmaciaApi}/api/listas-precios`).map(r => {
      return r.json();
    });
  }

  guardarProductoLista(listaId: number, producto: ListaPreciosProductoDto): Observable<any> {
    const uri = `${environment.maestrosFarmaciaApi}/api/listas-precios/${listaId}/productos`;
    producto.UsuarioCreaId = this.loginService.Usuario.id;
    return this.httpAuth.post(uri, producto);
  }
  actualizarProductoLista(listaId: number, productoId: string, producto: ListaPreciosProductoDto): Observable<any> {
    const uri = `${environment.maestrosFarmaciaApi}/api/listas-precios/${listaId}/productos/${productoId}`;
    producto.UsuarioCreaId = this.loginService.Usuario.id;
    return this.httpAuth.put(uri, producto);
  }
  guardarLista(lista: ListaPreciosDto): Observable<any> {
    const uri = `${environment.maestrosFarmaciaApi}/api/listas-precios`;
    lista.UsuarioCreaId = this.loginService.Usuario.id;
    return this.httpAuth.post(uri, lista);
  }
  actualizarLista(listaId: number, lista: ListaPreciosDto): Observable<any> {
    const uri = `${environment.maestrosFarmaciaApi}/api/listas-precios/${listaId}`;
    lista.UsuarioCreaId = this.loginService.Usuario.id;
    return this.httpAuth.put(uri, lista);
  }

}
