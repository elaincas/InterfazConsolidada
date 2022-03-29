import { ProductoPresentacion, Producto, ProductoAtributo, ProductoPresentaciones } from '../models/productoPresentacion';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpAuthService } from '../../../helpers/http/http-auth.service';

@Injectable()
export class AdministracionProductoPresentacionesService {

constructor(private httpAuth: HttpAuthService) { }

    GetProductosPresentacionesAgrupadas():Observable<ProductoPresentaciones[]>{
        const uri = `http://localhost:56380/api/productosPresentaciones/ObtenerProductosPresentacionesAgrupadas`;
        return this.httpAuth.get(uri).map(data => data.json());
    }

    GetProductoPresentacionesAgrupadasPorProductoId(productoId: number):Observable<ProductoPresentaciones>{
        const uri = `http://localhost:56380/api/productosPresentaciones/ObtenerProductosPresentacionesAgrupadasPorProductoId/${productoId}`;
        return this.httpAuth.get(uri).map(data => data.json());
    }

    PostProductoPresentaciones(productoPresentaciones:ProductoPresentaciones):Observable<ProductoPresentaciones>{
        const uri = `http://localhost:56380/api/productosPresentaciones/AgregarNuevasPresentaciones`;
        return this.httpAuth.post(uri, productoPresentaciones).map(data => data.json());
    }

    PutProductoPresentaciones(productoPresentaciones:ProductoPresentaciones):Observable<ProductoPresentaciones>{
        const uri = `http://localhost:56380/api/productosPresentaciones/ActualizarPresentaciones`;
        return this.httpAuth.put(uri, productoPresentaciones).map(data => data.json());
    }

    DeleteProductoPresentacion(productoPresentacionId:number):Observable<ProductoPresentacion>{
        const uri = `http://localhost:56380/api/productosPresentaciones/EliminarProductoPresentacion/${productoPresentacionId}`;
        return this.httpAuth.delete(uri).map(data => data.json());
    }

    GetProductosAtributos():Observable<ProductoAtributo[]>{
        const uri = `http://localhost:56380/api/productosPresentaciones/ObtenerProductosAtributos`;
        return this.httpAuth.get(uri).map(data => data.json());
    }

    // Presentaciones individuales
    GetProductosPresentaciones():Observable<ProductoPresentacion[]>{
        const uri = `http://localhost:56380/api/productosPresentaciones`;
        return this.httpAuth.get(uri).map(data => data.json());
    }

    GetProductoPresentacionPorId(productoPresentacionId: number):Observable<ProductoPresentacion[]>{
        const uri = `http://localhost:56380/api/productosPresentaciones/productoPresentacionPorId/${productoPresentacionId}`;
        return this.httpAuth.get(uri).map(data => data.json());
    }

    PostProductoPresentacion(productoPresentacion:ProductoPresentacion):Observable<ProductoPresentacion>{
        const uri = `http://localhost:56380/api/productosPresentaciones/AgregarNuevoProductoPresentacion`;
        return this.httpAuth.post(uri, productoPresentacion).map(data => data.json());
    }

    PutProductoPresentacion(productoPresentacion:ProductoPresentacion):Observable<ProductoPresentacion>{
        const uri = `http://localhost:56380/api/productosPresentaciones/EditarProductoPresentacion`;
        return this.httpAuth.put(uri, productoPresentacion).map(data => data.json());
    }
}

export function isNull(objeto: any): boolean {
    return objeto == null || objeto == undefined || objeto.length == 0;
}

export function isNullEmptyOrWhiteSpace(texto: string): boolean {
    if (isNull(texto)) {
    return true;
    }
    return texto == "" || texto == " ";
}
