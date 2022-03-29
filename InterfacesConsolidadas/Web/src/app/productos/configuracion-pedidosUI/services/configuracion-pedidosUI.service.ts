import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpAuthService } from './../../../helpers/http/http-auth.service';
import { MaestrosFarmaciaService } from '../../../maestros/maestros-farmacia.service';
import { ConfiguracionPedidoUI } from '../models/configuracion-pedido.model';

@Injectable()
export class ConfiguracionPedidoUIService {

constructor(private httpAuth: HttpAuthService) { }

    ObtenerConfiguracionesPedidosUI():Observable<ConfiguracionPedidoUI[]>{
        const uri = `${environment.farsimanProducts}api/ProductosUI/obtenerConfiguraciones`;
        return this.httpAuth.get(uri).map(data => data.json());
    }
    ObtenerProductoUI():Observable<any[]>{
        const uri = `${environment.farsimanProducts}api/ProductosUI/ObtenerProductosUI`;
        return this.httpAuth.get(uri).map(data => data.json());
    }


    IngresarConfiguracion(configuracion:ConfiguracionPedidoUI):Observable<ConfiguracionPedidoUI>{
        const uri = `${environment.farsimanProducts}api/ProductosUI/insertarConfiguracion`;
        return this.httpAuth.post(uri, configuracion).map(data => data.json());
    }

    ModificarConfiguracion(configuracion:ConfiguracionPedidoUI):Observable<ConfiguracionPedidoUI>{
        const uri = `${environment.farsimanProducts}api/ProductosUI/modificarConfiguracion`;
        return this.httpAuth.post(uri, configuracion).map(data => data.json());
    }
    DesactivarConfiguracion(configuracion:ConfiguracionPedidoUI):Observable<ConfiguracionPedidoUI>{
        const uri = `${environment.farsimanProducts}api/ProductosUI/desactivarConiguracion`;
        return this.httpAuth.post(uri, configuracion).map(data => data.json());
    }

}


