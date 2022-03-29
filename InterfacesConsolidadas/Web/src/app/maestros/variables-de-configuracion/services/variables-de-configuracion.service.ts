import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../environments/environment.prod';
import { HttpAuthService } from '../../../helpers/http/http-auth.service';
import { LoginService } from '../../../login/services/login.service';
import { ModificarVariableRequestDto } from '../models/ModificarVariableRequestDto.model';
import { VariableDeConfiguracion } from '../models/VariableDeConfiguracion.model';

@Injectable()
export class VariablesDeConfiguracionService {
  constructor( private httpAuth: HttpAuthService, 
    private _loginService : LoginService
    ) { }

  ObtenerVariablesDeConfiguracionPorSucursal(sucursaId : any): Observable<any> {
    const uri = `${environment.maestrosFarmaciaApi}/api/adminVariablesDeConfiguracion/ObtenerVariablesPorSucursal/${sucursaId}`;
    return this.httpAuth.get(uri).map(r => r.json());
  }
  ObtenerVariablesDeConfiguracionPorEmpresa(EmpresaId : any): Observable<any> {
    const uri = `${environment.maestrosFarmaciaApi}/api/adminVariablesDeConfiguracion/ObtenerVariablesPorEmpresa/${EmpresaId}`;
    return this.httpAuth.get(uri).map(r => r.json());
  }

  ModificarVariableDeConfiguracion(variable: VariableDeConfiguracion, sucursalId: any): Observable<any>{
    var Usuario = this._loginService.Usuario
    const uri = `${environment.maestrosFarmaciaApi}/api/adminVariablesDeConfiguracion/ModificarVariable/${sucursalId}/${Usuario.id}`;
    return this.httpAuth.post(uri, variable).map(r => r.json());
  }

  ModificarVariableDeConfiguracionMultipleSucursal(data: ModificarVariableRequestDto): Observable<any>{
    var Usuario = this._loginService.Usuario
    data.usuarioId = Usuario.id;
    const uri = `${environment.maestrosFarmaciaApi}/api/adminVariablesDeConfiguracion/ModificarVariableMultipleSucursal`;
    return this.httpAuth.post(uri, data).map(r => r.json());
  }
}
