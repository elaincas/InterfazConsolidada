import { CuponDigital } from './../models/cuponDigital.model';
import { CuponDigitalProducto } from './../models/cuponDigitalProducto.model';
import { environment } from './../../../environments/environment.prod';
import { CuponDigitalTipo } from './../models/cuponDigitalTipo.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpAuthService } from '../../helpers/http/http-auth.service';

@Injectable()
export class MercadeoService {

    constructor(private httpAuth: HttpAuthService) { }


    ObtenerTiposDeCupon(): Observable<CuponDigitalTipo[]> {
        const uri = `${environment.cuponDigital}/cupones/ObtenerTiposDeCupon`;
        return this.httpAuth.get(uri).map(x => x.json());
    }

    AgregarProductos(productos: CuponDigitalProducto[]): Observable<CuponDigitalProducto[]> {
        const uri = `${environment.cuponDigital}/cupones/AgregarProductos`;
        return this.httpAuth.post(uri, productos).map(x => x.json());
    }

    ActulizarProducto(producto: CuponDigitalProducto[]): Observable<CuponDigitalProducto[]> {
        const uri = `${environment.cuponDigital}/cupones/ActulizarProducto`;
        return this.httpAuth.post(uri, producto).map(x => x.json());
    }

    RegistrarCuponDigital(cuponDigital: CuponDigital): Observable<CuponDigital> {
        const uri = `${environment.cuponDigital}/cupones/RegistrarCuponDigital`;
        return this.httpAuth.post(uri, cuponDigital).map(x => x.json());
    }

    ActualizarCuponDigital(cuponDigital: CuponDigital): Observable<CuponDigital> {
        const uri = `${environment.cuponDigital}/cupones/ActualizarCuponDigital`;
        return this.httpAuth.post(uri, cuponDigital).map(x => x.json());
    }

    ObtenerCupones(): Observable<CuponDigital[]> {
        const uri = `${environment.cuponDigital}/cupones/ObtenerCupones`;
        return this.httpAuth.get(uri).map(x => x.json());
    }

}

