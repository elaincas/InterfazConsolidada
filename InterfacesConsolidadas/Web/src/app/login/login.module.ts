import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { FormsModule } from '@angular/forms';

import { LoginRoutes } from './logint.routing';
import { AuthLayoutComponent } from './auth-layout.component';
import { LoginComponent } from './components/login.component';
import { LoginService } from './services/login.service';
import { LoggedInGuard, CanActivateValidarAccesoRuta } from './guards/logged-in.guard';
import { LoginGuard } from './guards/login-guard';
import { SearchRoutes } from './services/searchRoutes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(LoginRoutes)
  ],
  declarations: [
    AuthLayoutComponent,
    LoginComponent
  ],
  providers: [LoginService, LoggedInGuard, LoginGuard, CanActivateValidarAccesoRuta, SearchRoutes]
})
export class LoginModule { }
