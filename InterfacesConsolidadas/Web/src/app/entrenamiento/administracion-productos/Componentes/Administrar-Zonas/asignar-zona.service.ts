import { Http } from "../../../../../../node_modules/@angular/http";
import { LoginService } from "../../../../login/services/login.service";
import { Injectable } from "../../../../../../node_modules/@angular/core";
import { environment } from "../../../../../environments/environment";
import { Producto } from "../../Clases/Producto";
import { Observable } from "../../../../../../node_modules/rxjs";
import { ZonaEncargado } from "../../Clases/Zonas";
import { HttpAuthService } from '../../../../helpers/http/http-auth.service';

@Injectable()
export class AsignarZonaService {

  constructor(private http: Http,private httpAuth: HttpAuthService) { }

  obtenerInformacionColaborador(colaboradorID: number,esColaboradorDespedido: boolean) {
    const uri = `${environment.productosEntrenamiento}/api/Productos/obtenerColaborador/` + colaboradorID+`/`+esColaboradorDespedido ;
    debugger;
    return this.http.get(uri).map(r => r.json());
  }
  ObtenerZonas(): Observable<Array<any>> {
    const uri = `${environment.productosEntrenamiento}/api/Productos/obtenerzonas`;
    return this.http.get(uri).map(r => r.json());
  }

  AgregarEncargadoZona(zona: ZonaEncargado){
    const uri = `${environment.productosEntrenamiento}/api/Productos/asignarzona`;
    return this.httpAuth.post(uri,zona);
  }
}
