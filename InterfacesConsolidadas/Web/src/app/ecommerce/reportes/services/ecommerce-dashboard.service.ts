import { Injectable } from '@angular/core';
import { HttpAuthService } from '../../../helpers/http/http-auth.service';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../environments/environment';

@Injectable()
export class EcommerceDashboardService {
  resumen: any;
  constructor(private httpAuth:HttpAuthService) {
    this.resumen = {};
  }

  cargarInformacion(): Observable<any> {
    return this.httpAuth.get(`${environment.ecommerceReportesApi}/dashboard`).map(data => {
      this.resumen = data.json();
      console.log(this.resumen);
      return data.json();
    });
  }

  ventasPorAplicacion = [
    {
        "año": "2018",
        "mes": "January",
        "portalWeb": 3679724.49,
        "androidApp": 96300.99,
        "iosApp": 54104.5
    },
    {
        "año": "2018",
        "mes": "March",
        "portalWeb": 1230827.71,
        "androidApp": 430000,
        "iosApp": 90300
    },
    {
      "año": "2018",
      "mes": "Febrary",
      "portalWeb": 4839724.49,
      "androidApp": 906300.99,
      "iosApp": 554104.5
  }
];

}
