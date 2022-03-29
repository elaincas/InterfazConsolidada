import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpAuthService } from '../../../helpers/http/http-auth.service';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ListaServiciosService {
  constructor(private httpAuth: HttpAuthService) { }

  ObtenerListaServicios(): Observable<Array<any>> {
    const url = `${environment.ecommerceApi}/api/ServiciosDisponibles/ObtenerServicios`;
    return this.httpAuth.get(url).map(r => r.json());
  }

  ActualizarEstadoVisibleEnPaginaWeb(servicioId, visible, usuarioId){
    const url = `${environment.ecommerceApi}/api/ServiciosDisponibles/ActualizarEstadoVisibleEnPaginaWeb/${servicioId}/${visible}/${usuarioId}`;
    return this.httpAuth.get(url).map(r => r.json());
  }

  ActualizarServicio(servicioId, descripcion, usuarioId){
    const url = `${environment.ecommerceApi}/api/ServiciosDisponibles/ActualizarServicio/${servicioId}/${descripcion}/${usuarioId}`;
    return this.httpAuth.get(url).map(r => r.json());
  }

}
