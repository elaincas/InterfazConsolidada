import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { GuardarNotificacion } from '../_models/GuardarNotificacion';
import { HttpAuthService } from '../../../helpers/http/http-auth.service';

@Injectable()
export class NotificacionesPushService {
  constructor(private httpAuth: HttpAuthService) { }

  RegistrarNotificacion(notificacion: GuardarNotificacion) {
    const request = JSON.stringify(notificacion);
    return this.httpAuth.post(
      `${environment.ecommerceCampañasApi}/Comunicaciones/NotificacionesPush`, request, [{name:"Content-Type", value:"application/json; charset=utf-8"}]);
  }

  ObtenerHistorial() {
    return this.httpAuth.get(`${environment.ecommerceCampañasApi}/Comunicaciones/NotificacionesPush`);
  }

}