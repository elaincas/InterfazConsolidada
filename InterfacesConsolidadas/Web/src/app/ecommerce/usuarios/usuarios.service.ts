import { UsuarioAtributoBloqueoConfiguracionRequest, AtributoProcesosBloqueo } from './models/UsuarioAtributoBloqueoConfiguracion';
import { UsuarioProceso } from './models/UsuarioProceso';
import { Injectable } from '@angular/core';
import { HttpAuthService } from '../../helpers/http/http-auth.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { UsuarioAtributo } from './models/UsuarioAtributo';
import { UsuarioProcesoBloqueoConfiguracionRequest } from './models/UsuarioProcesoBloqueoConfiguracion';

@Injectable()
export class UsuariosService {

  constructor(private httpService: HttpAuthService) { }

  public obtenerUsuario(usuarioId: number): Observable<any> {
    return this.httpService.get(`${environment.ecommerceApi}/api/usuarios/${usuarioId}`).map(r => r.json());
  }

  public obtenerUsuariosPendientesDeConfirmarIdentidad(): Observable<any[]> {
    let query = `?activos=true&subioDocumentosIdentidad=true&identidadConfirmada=false`;
    return this.httpService.get(`${environment.ecommerceApi}/api/usuarios${query}`).map(r => r.json());
  }

  public obtenerUsuarios(
    recargasNoHabilitadas?: boolean,
    bloqueados?: boolean,
    subioDocumentosIdentidad?: boolean,
    identidadConfirmada?: boolean,
    nombre?: string,
    apellido?: string,
    noIdentidad?: string,
    correo?: string
  ): Observable<any[]> {

    let query = `?activos=true`;
    if (subioDocumentosIdentidad) {
      query = `${query}&subioDocumentosIdentidad=${subioDocumentosIdentidad}`;
    }

    if (identidadConfirmada) {
      query = `${query}&identidadConfirmada=${identidadConfirmada}`;
    }

    if (nombre) {
      query = `${query}&nombre=${nombre}`;
    }

    if (apellido) {
      query = `${query}&apellido=${apellido}`;
    }

    if (noIdentidad) {
      query = `${query}&noIdentidad=${noIdentidad}`;
    }
    if (bloqueados) {
      query = `${query}&bloqueados=${bloqueados}`;
    }

    if (recargasNoHabilitadas) {
      query = `${query}&recargasHabilitadas=false`;
    }

    if (correo) {
      query = `${query}&correo=${correo}`;
    }

    return this.httpService.get(`${environment.ecommerceApi}/api/usuarios${query}`).map(r => r.json());
  }

  public actualizar(usuario: any,agente:any) {
    return this.httpService.put(`${environment.ecommerceApi}/api/usuarios/${agente}`, usuario);
  }

  public eleimnarDocumentosUsuario(usuarioId: number) {
    return this.httpService.get(`${environment.ecommerceApi}/api/usuarios/EliminarDocumentos/${usuarioId}`).map(r => r.json());
  }

  public reenviarCodigoDeConfirmacion(usuario: any): Observable<any> {
    const uri = `${environment.ecommerceApi}/api/usuarios/ReenviarCodigoDeConfirmacion`;
    return this.httpService.post(uri, usuario).map(x => x.json());
  }

  public eliminarUsuario(usuario: any): Observable<any> {
    const uri = `${environment.ecommerceUsuariosApi}/api/registro/eliminar/`+usuario;
    return this.httpService.get(uri).map(x => x.json());
  }
  public confirmarUsuario(usuario: any): Observable<any> {
    const uri = `${environment.ecommerceApi}/api/usuarios/ConfirmarUsuario`;
    return this.httpService.post(uri, usuario).map(x => x.json());
  }
  public obtenerCodigos(usuario: any): Observable<any> {
    const uri = `${environment.ecommerceApi}/api/usuarios/usuarioCodigo/`+usuario;
    return this.httpService.get(uri).map(x => x.json());
  }

  public obtenerAtributosDeUsuario(): Observable<UsuarioAtributo[]> {
    const uri = `${environment.ecommerceApi}/api/BloqueoDeProcesos/atributos?activos=true`;
    return this.httpService.get(uri).map(x => x.json());
  }

  public obtenerProcesosDeUsuario(): Observable<UsuarioProceso[]> {
    const uri = `${environment.ecommerceApi}/api/BloqueoDeProcesos/procesos?activos=true`;
    return this.httpService.get(uri).map(x => x.json());
  }

  public obtenerAtributosProcesosBloqueados(): Observable<AtributoProcesosBloqueo[]> {
    const uri = `${environment.ecommerceApi}/api/BloqueoDeProcesos/AtributosProcesosBloqueados`;
    return this.httpService.get(uri).map(x => x.json());
  }

  public configurarBloqueoAtributo(requestData: UsuarioAtributoBloqueoConfiguracionRequest): Observable<any> {
    const uri = `${environment.ecommerceApi}/api/BloqueoDeProcesos/ConfigurarBloqueoAtributo`;

    return this.httpService.post(uri, requestData).map(x => x.json());
  }

  public configurarBloqueoProceso(requestData: UsuarioProcesoBloqueoConfiguracionRequest): Observable<any> {
    const uri = `${environment.ecommerceApi}/api/BloqueoDeProcesos/ConfigurarBloqueoProceso`;

    return this.httpService.post(uri, requestData).map(x => x.json());
  }

  public cambiarEstadoAtributoBloqueo(id: number, estado: boolean): Observable<boolean> {
    const uri = `${environment.ecommerceApi}/api/BloqueoDeProcesos/CambiarEstadoAtributoBloqueo/${id}`;
    const dataRequest = JSON.stringify(estado);

    return this.httpService.post(uri, dataRequest, [{ name: 'content-type', value: 'application/json' }]).map(r => r.json());
  }

  public cambiarEstadoProcesoBloqueo(id: number, estado: boolean): Observable<boolean> {
    const uri = `${environment.ecommerceApi}/api/BloqueoDeProcesos/CambiarEstadoProcesoBloqueo/${id}`;
    const dataRequest = JSON.stringify(estado);

    return this.httpService.post(uri, dataRequest, [{ name: 'content-type', value: 'application/json' }]).map(r => r.json());
  }
}

