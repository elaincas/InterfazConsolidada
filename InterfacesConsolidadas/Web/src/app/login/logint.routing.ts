import { Routes } from "@angular/router";
import { LoginComponent } from "./components/login.component";
import { LoginGuard } from "./guards/login-guard";

export const LoginRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [LoginGuard]
    }
]