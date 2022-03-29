import { Injectable } from '@angular/core';
import { HttpAuthService } from '../../../../helpers/http/http-auth.service';
import { environment } from '../../../../../environments/environment';
import { IPedidosResumen } from '../models/IPedidosResumen';
import { Observable } from 'rxjs/Observable';
import { IPedidosEntregadosAsignadosResumen } from '../models/IPedidosEntregadosAsignadosResumen';
import { IPedidosVentasResumen } from '../models/IPedidosVentasResumen';
import { PedidoInformacion } from '../models/PedidoInformacion';
import { IResumenDeConserjes } from '../models/IResumenDeconserjes';

@Injectable()
export class DashboardService {

  constructor(private httpAuth: HttpAuthService) { }

  obtenerResumenPedidos(fechaInicio: Date, fechaFin: Date): Observable<IPedidosResumen[]> {
    const url = `${environment.conserjesApi}/api/dashboard/resumenDePedidos?fechaInicio=${fechaInicio.toDateString()}&fechaFin=${fechaFin.toDateString()}`;
    return this.httpAuth.get(url).map(r => r.json());
  }

  obtenerResumenPedidosEntregados(fechaInicio: Date, fechaFin: Date): Observable<IPedidosEntregadosAsignadosResumen[]> {
    const url = `${environment.conserjesApi}/api/dashboard/ResumenDePedidosEntregados?fechaInicio=${fechaInicio.toDateString()}&fechaFin=${fechaFin.toDateString()}`;
    return this.httpAuth.get(url).map(r => r.json());
  }

  obtenerResumenVentas(): Observable<IPedidosVentasResumen[]> {
    const url = `${environment.conserjesApi}/api/dashboard/ResumenDeVentas`;
    return this.httpAuth.get(url).map(r => r.json());
  }

  obtenerInformacionDePedidosPorFecha(fecha: Date, conserjeId: string): Observable<PedidoInformacion[]> {
    const url = `${environment.conserjesApi}/api/dashboard/Pedidos?fecha=${fecha.toDateString()}&conserjeId=${conserjeId}`;
    return this.httpAuth.get(url).map(r => r.json());
  }

  obtenerResumenDeConserjes(): Observable<IResumenDeConserjes> {
    const url = `${environment.conserjesApi}/api/dashboard/ResumenDeConserjes`;
    return this.httpAuth.get(url).map(r => r.json());
  }
}
