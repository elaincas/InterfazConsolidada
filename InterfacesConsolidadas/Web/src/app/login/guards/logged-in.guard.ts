import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { LoginService } from "../services/login.service";
import { Injectable } from "@angular/core";
import { Notificaciones, Alertas } from "../../helpers/notificaciones/notificaciones";
import { SearchRoutes } from "../services/searchRoutes";

@Injectable()
export class LoggedInGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

    let promesa = new Promise<boolean>((resolve, reject) => {
      // this.loginService.verificarToken().then((esTokenValido) => {
      //   if (esTokenValido) {
      //     this.loginService.CargarPermisos().then(() => resolve(true));
      //     return;
      //   }
      //   this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } })
      //   resolve(false);
      // });
      resolve(true);
    });

    return promesa;
  }

}

@Injectable()
export class CanActivateValidarAccesoRuta implements CanActivate {

  constructor(private loginService: LoginService, private router: Router, private searchRoutes: SearchRoutes) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

    let promesa = new Promise<boolean>((resolve) => {

      let screenId = this.searchRoutes.obtenerPermisoId(state.url);
      this.loginService.verificarPermisoPantalla(screenId).then(tienePermiso => {
        // if (!tienePermiso) {
        //   Alertas.noTienePermisoParaAcceder();
        //   this.router.navigate(['/home']);
        // }
        tienePermiso = true;
        resolve(tienePermiso);
      });

    });

    return promesa;
  }

}
