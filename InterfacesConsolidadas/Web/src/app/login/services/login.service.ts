import { Injectable } from '@angular/core';
import { Usuario, Credenciales, IUsuario } from '../models/usuario.model';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { helpers } from '../../helpers/utils';
import { Router } from '@angular/router';
import { IPermiso } from '../models/IPermiso.Model';
import { HttpAuthService } from '../../helpers/http/http-auth.service';
import { reject } from 'q';

@Injectable()
export class LoginService {
  constructor(private http: Http, private httpAuth: HttpAuthService, private router: Router) { }
  private _esTokenVerificado: boolean;

  salir() {
    localStorage.clear();
    this._esTokenVerificado = false;
    this.router.navigate(['/login']);
  }

  acceder(usuario: string, clave: string): Promise<IUsuario> {
    let promesa = new Promise<IUsuario>((resolve, reject) => {

      let credenciales = new Credenciales(usuario, clave, 2);
      let uri = `${environment.seguridadApi}/Auth`
      debugger;

      this.http.post(uri, credenciales).subscribe(data => {

        debugger;
        let token = data.json() ;
        let usuario = new Usuario({ usuario: token.usuario, id: token.id, token: token });
        this._esTokenVerificado = true;
        this.guardarUsuarioEnLocalStorage(usuario);

        resolve(usuario);
      }, error => {
        reject(error);
      });
    });
    return promesa;
  }

  verificarToken(): Promise<boolean> {
    let promesa = new Promise<boolean>((resolve, reject) => {
      if (this._esTokenVerificado) {
        resolve(true);
        return;
      }

      if (!this.EsAutenticado) {
        this._esTokenVerificado = false;
        resolve(false);
        return;
      }

      let uri = `${environment.seguridadApi}/Auth/validate`;

      this.http.post(uri, { token: this.Usuario.token }).subscribe(data => {
        this._esTokenVerificado = true;
        resolve(true);
      }, error => {
        this._esTokenVerificado = false;
        localStorage.removeItem('auth');
        resolve(false);
      });

    });

    return promesa;
  }

  guardarUsuarioEnLocalStorage(usario: IUsuario) {
    localStorage.setItem("auth", JSON.stringify(usario));
  }

  get EsAutenticado() {
    return this.Usuario != null;
  }

  get Usuario(): IUsuario {
    let usuario = localStorage.getItem("auth");
    if (usuario == null) {
      return null;
    }
    return JSON.parse(usuario) as IUsuario;
  }

  // private obtenerPayload(token: string): IUsuario {
  //   // if (helpers.isNullEmptyOrWhiteSpace(token)) {
  //   //   return null;
  //   // }
  //   // let tokenBase64 = token.split('.')[1];
  //   // let payload = JSON.parse(atob(tokenBase64));
  //   // return new Usuario({ usuario: payload.userName, id: payload.userId, token: token });
  // }

  public tieneAccesoLaRuta(location): boolean {
    let tieneAcceso = false;
    let subModulos = JSON.parse(localStorage.getItem("authPaths"));
    if (location === "/" || location === "/home") {
      return true;
    }
    for (let pantalla of subModulos) {
      console.log(pantalla);
      if (location === pantalla.path) {
        tieneAcceso = true;
        break;
      }
    }
    return tieneAcceso;
  }

  ObtenerPermisos(): Observable<Array<IPermiso>> {
    let uri = `${environment.seguridadApi}/Auth/Permissions`;
    return this.httpAuth.get(uri).map(data => data.json());
  }

  verificarPermisoPantalla(pantallaId: number): Promise<boolean> {
    let promesa = new Promise<boolean>((resolve, reject) => {
      let uri = `${environment.seguridadApi}/Auth/Permissions/verify/?screenId=${pantallaId}`;
      this.httpAuth.get(uri).subscribe(data => {
        resolve(true);
      }, error => {
        resolve(false);
      })
    });
    return promesa;
  }

  CargarPermisos(): Promise<void> {
    let promesa = new Promise<void>((resolve, reject) => {
      let uri = `${environment.seguridadApi}/Auth/Permissions`;
      this.httpAuth.get(uri).map(data => data.json()).subscribe(permisos => {
        localStorage.setItem("Auth_permisos", JSON.stringify(permisos));
        resolve();
      });
    });

    return promesa;
  }
}
