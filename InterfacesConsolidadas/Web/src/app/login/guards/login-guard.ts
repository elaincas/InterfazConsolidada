import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { LoginService } from "../services/login.service";
import { Injectable } from "@angular/core";


@Injectable()
export class LoginGuard implements CanActivate {

    constructor(private loginService: LoginService, private router: Router) {

    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!this.loginService.EsAutenticado) {
            return true;
        }
        this.router.navigate(['/'])
        return false;
    }

}