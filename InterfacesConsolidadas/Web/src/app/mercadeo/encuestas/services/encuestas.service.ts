import { Injectable } from '@angular/core';
import { HttpAuthService } from '../../../helpers/http/http-auth.service';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../environments/environment';
import { PedidoTipoValido } from '../models/pedido-tipo-valido.model';
import {
  ReporteEncuesta,
  ReporteEncuestaMap,
} from '../models/reporte-encuesta.model';

@Injectable()
export class EncuestasService {
  constructor(private httpAuth: HttpAuthService) {}

  ObtenerTodasLasPreguntas(): Observable<any> {
    return this.httpAuth
      .get(`${environment.mercadeoApi}/ExperienciaUsuariosPreguntas`)
      .map((r) => {
        let query = r.json();
        let listaExperienciaUsuariosPreguntas = query;
        return listaExperienciaUsuariosPreguntas;
      });
  }

  ObtenerTodosLosPedidosTipos(): Observable<any> {
    return this.httpAuth
      .get(`${environment.mercadeoApi}/PedidosTipos/ObtenerPedidosTipos`)
      .map((r) => {
        let query = r.json();
        let listaPedidosTipos = query;
        return listaPedidosTipos;
      });
  }

  ObtenerPedidosTiposPorPregunta(idPregunta: number): Observable<any> {
    return this.httpAuth
      .get(
        `${environment.mercadeoApi}/PedidosTipos/ObtenerPedidosTiposPorPregunta/${idPregunta}`
      )
      .map((r) => {
        let query = r.json();
        let listaPedidosTipos = query;
        return listaPedidosTipos;
      });
  }

  crearPregunta(pregunta): Observable<any> {
    const uri = `${environment.mercadeoApi}/ExperienciaUsuariosPreguntas`;
    return this.httpAuth.post(uri, pregunta).map((x) => x.json());
  }

  actualizarPregunta(pregunta): Observable<any> {
    const uri = `${environment.mercadeoApi}/ExperienciaUsuariosPreguntas/${pregunta.id}`;

    return this.httpAuth.put(uri, pregunta).map((x) => x.json());
  }

  sePuedeAgregarPedido(pedidoTipoId: number): Observable<PedidoTipoValido> {
    return this.httpAuth
      .get(
        `${environment.mercadeoApi}/ExperienciaUsuariosPreguntas/SePuedeAgregarPedido/${pedidoTipoId}`
      )
      .map((x) => x.json());
  }

  sePuedeActivarPregunta(preguntaId: number): Observable<PedidoTipoValido> {
    return this.httpAuth
      .get(
        `${environment.mercadeoApi}/ExperienciaUsuariosPreguntas/SePuedeActivar/${preguntaId}`
      )
      .map((x) => x.json());
  }

  activarPregunta(preguntaId: number): Observable<any> {
    return this.httpAuth
      .get(
        `${environment.mercadeoApi}/ExperienciaUsuariosPreguntas/Activar/${preguntaId}`
      )
      .map((x) => x.json());
  }

  existePregunta(pregunta: string): Observable<any> {
    return this.httpAuth
      .get(
        `${environment.mercadeoApi}/ExperienciaUsuariosPreguntas/ExistePregunta?pregunta=${pregunta}`
      )
      .map((x) => x.json());
  }

  inactivarPregunta(preguntaId: number): Observable<any> {
    return this.httpAuth
      .delete(
        `${environment.mercadeoApi}/ExperienciaUsuariosPreguntas/${preguntaId}`
      )
      .map((x) => x.json());
  }

  eliminarPreguntaPedidoTipo(id: number): Observable<any> {
    return this.httpAuth
      .delete(
        `${environment.mercadeoApi}/ExperienciaUsuariosPreguntas/EliminarExperienciaUsuarioPedidoTipo/${id}`
      )
      .map((x) => x.json());
  }

  obtenerPedidosTiposRelacionadosConPedidosAleatoriamente(): Observable<any> {
    return this.httpAuth
      .get(
        `${environment.mercadeoApi}/ExperienciaUsuariosPreguntas/ObtenerPedidosParaPreview`
      )
      .map((x) => x.json());
  }

  obtenerReporte(): Observable<any> {
    return this.httpAuth
      .get(
        `${environment.mercadeoApi}/ExperienciaUsuariosPreguntas/ObtenerReporte`
      )
      .map((r) => {
        let query = r.json();
        let reporte = query;
        return reporte;
      })
      .map<ReporteEncuesta[], ReporteEncuestaMap[]>((reporte) => {
        const reporteEncuestaMap = reporte.map((reporte) => {
          return <ReporteEncuestaMap>{
            descripcion: reporte.descripcion,
            id: reporte.id,
            imagenInsatisfechoUrl: reporte.imagenInsatisfechoUrl,
            imagenSatisfechoUrl: reporte.imagenSatisfechoUrl,
            totalInsatisfecho: reporte.totalInsatisfecho,
            totalSatisfecho: reporte.totalSatisfecho,
            momentoEvaluar: reporte.momentoEvaluar,
            totalPorcentajeInsatisfecho:
              reporte.totalPorcentajeInsatisfecho + '%',
            totalPorcentajeSatisfecho: reporte.totalPorcentajeSatisfecho + '%',
            totalRespuestas: reporte.totalRespuestas,
          };
        });
        return reporteEncuestaMap;
      });
  }

  obtenerDatosGeneralesReporte(): Observable<any> {
    return this.httpAuth
      .get(
        `${environment.mercadeoApi}/ExperienciaUsuariosPreguntas/DatosGeneralesReporte`
      )
      .map((r) => {
        let query = r.json();
        let reporte = query;
        return reporte;
      });
  }

  obtenerReporteEncuestasNPS(): Observable<any>{
    return this.httpAuth
      .get(
        `${environment.mercadeoApi}/ExperienciaUsuariosPreguntas/ObtenerReporteNPS`
      )
      .map((r) => {
        let query = r.json();
        let reporte = query;
        return reporte;
      });
  }
}
