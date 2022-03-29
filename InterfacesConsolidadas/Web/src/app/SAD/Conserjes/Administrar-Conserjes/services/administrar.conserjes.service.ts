import {Injectable} from '@angular/core';
import {HttpAuthService} from '../../../../helpers/http/http-auth.service';
import {RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../../../../environments/environment';
import {Conserje, FiltrosConjerje} from '../models/Conserje';
import {Headers} from '@angular/http';
import { PedidoMetricas, PedidoMetricasRespuesta } from '../../mapa-conserjes/models/PedidoMetricas';

@Injectable()
export class AdministrarConserjesService {
  constructor(private httpAuth: HttpAuthService) { }


  ObtenerConserjes(filtros: FiltrosConjerje): Observable<Array<Conserje>> {
    const url = `${environment.conserjesApi}/api/Conserjes/ObtenerConserjes`;
    return this.httpAuth.post(url, filtros).map(r => r.json());
  }

  ObtenerNombreUsuarioPorCodigoVhur(codigoVhur: string): Observable<string> {
    const url = `${environment.seguridadCorporativaAdmin}/api/usuarios/ObtenerNombreUsuario/${codigoVhur}`;
    return this.httpAuth.get(url).map(r => r.json());
  }

  ObtenerPedidosPendientesMasCercanos(conserje: Conserje): Observable<PedidoMetricasRespuesta> {
    const url = `${environment.conserjesApi}/api/Conserjes/obtenerPedidosAsignadosPorMejorRuta/${conserje.codigoVhur}`;
    return this.httpAuth.get(url).map(r => r.json());
  }

  EditarConserje(conserje: Conserje, fotografiaConserje: any){

    conserje.rutaFotografia = "";
    const formData = new FormData();
    formData.append("image", fotografiaConserje);
    formData.append('model', JSON.stringify(conserje));

    const uri = `${environment.conserjesApi}/api/Conserjes/EditarConserje/` ;
    return this.httpAuth.post(uri, formData).map(x => x.json());
  }

  AgregarConserje(conserje: Conserje, fotografiaConserje: any) {

    conserje.rutaFotografia = "";
    const formData = new FormData();
    formData.append("image", fotografiaConserje);
    formData.append('model', JSON.stringify(conserje));
    const uri = `${environment.conserjesApi}/api/Conserjes/RegistrarConserje/` ;
    return this.httpAuth.post(uri, formData).map(x => x.json());
  }

  InactivarConserje(conserje: Conserje): Observable<any> {
    const uri = `${environment.conserjesApi}/api/Conserjes/InactivarConserje` ;
    return this.httpAuth.post(uri, conserje);
  }

  ObtenerConserjeAEditar(conserjeId: number): Observable<Conserje>{
    const url = `${environment.conserjesApi}/api/Conserjes/ObtenerConserjePorId/${conserjeId}`;
    return this.httpAuth.get(url).map(r => r.json());
  }
}