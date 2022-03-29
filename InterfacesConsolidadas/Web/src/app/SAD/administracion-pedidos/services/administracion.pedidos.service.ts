import {Injectable} from '@angular/core';
import {HttpAuthService} from '../../../helpers/http/http-auth.service';
import {RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../../../environments/environment';
import {EstadoPedido, ReportePedido, Sucursal} from '../models/ReportePedido';
import {Headers} from '@angular/http';

@Injectable()
export class AdministracionPedidosService {
  constructor(private httpAuth: HttpAuthService) { }

  ObtenerReportePedidos(): Observable<Array<ReportePedido>> {
    const url = `${environment.conserjesApi}/api/Conserjes/ObtenerConserjes`;
    return this.httpAuth.get(url).map(r => r.json());
  }

  ObtenerEstados(): Observable<any> {
    const url = `${environment.conserjesApi}/api/Conserjes/estados`;
    return this.httpAuth.get(url).map(r => r.json());
  }

  ObtenerSucursales( ): Observable<Sucursal[]> {
    const url = `${environment.maestrosFarmaciaApi}/api/sucursales`;
    return this.httpAuth.get(url).map(r => r.json());
  }
}