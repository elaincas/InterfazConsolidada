import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule } from './shared/navbar/navbar.module';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AppRoutes } from './app.routing';
import { ProductosModule } from './productos/productos.module';

import { LoginModule } from './login/login.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReembolsosModule } from './entrenamiento/reembolsos/reembolsos.module';
import {EcommerceModule} from './ecommerce/ecommerce.module';
import { InventarioImpulsoModule } from './desarrollo-productos/Inventario-Productos/inventarioproductos.module';
import { MercadeoModule } from "./mercadeo/mercadeo.module";
import { ConfiguracionesFarmaciaModule } from "./ConfiguracionesFarmacia/configuraciones-farmacia.module";
import { AgregarAtributosComponent } from './productos/administracion-atributos/agregar-atributos/agregar-atributos.component';
import { PlanimetriaModule } from './desarrollo-productos/Planimetrias/planimetria.module';
import { CreditoCobroModule } from './creditos/credito.module';
import { MaestrosModule } from './maestros/maestros.module';
import { DEFAULT_TIMEOUT, TimeoutInterceptor } from './helpers/TimeoutInterceptor';
import { AnalisisClinicoModule } from './analisis-clinico/analisis-clinico.module';
import { SadModule } from './SAD/sad.module';
import { InventariosRemotosModule } from './inventarios-remotos/inventarios-remotos.module';
import { MetasModule } from './metas/metas.module';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        RouterModule.forRoot(AppRoutes),
        HttpModule,
        LoginModule,
        SidebarModule,
        NavbarModule,
        FooterModule,
        ProductosModule,
        ReembolsosModule,
        EcommerceModule,
        InventarioImpulsoModule,
        MercadeoModule,
        PlanimetriaModule,
        ConfiguracionesFarmaciaModule,
        CreditoCobroModule,
        MaestrosModule,
        AnalisisClinicoModule,
        SadModule,
        InventariosRemotosModule,
        MetasModule
    ],
    declarations: [
        AppComponent,
        AdminLayoutComponent,
        DashboardComponent
    ],
    bootstrap: [AppComponent],
    providers: [
        [{ provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true }],
        [{ provide: DEFAULT_TIMEOUT, useValue: 600000 }]
    ]
})
export class AppModule {

}
