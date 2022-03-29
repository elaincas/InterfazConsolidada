import { Proveedor } from './models/proveedor.model';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Distribuidor } from './models/distribuidor.model';
import { Observable } from 'rxjs';
import { LoginService } from './../../login/services/login.service';
import { HttpAuthService } from './../../helpers/http/http-auth.service';
import { Injectable } from '@angular/core';
import { Linea } from './models/linea.model';
import { Producto } from './models/producto.model';
import { ProductToChangePrice } from './models/ProductToChangePrice.model';
import { Http } from '@angular/http';
import { ConfigurationProductsToChange } from './models/ConfigurationProductsToChange';
import { ItemInformationList } from './models/item-information-list';
import { LoadGridOptions } from '../../ecommerce/distribuidores-externos/models/LoadGridOptions';

@Injectable()
export class AdministracionPreciosService {

    constructor(private httpAuth: HttpAuthService, 
        private LoginService: LoginService, private http:Http) {
    }

    ObtenerDistribuidores(): Observable<Distribuidor[]> {
        const uri = `${environment.productosMaestrosApi}api/productos/ObtenerDistribuidores/`;
        return this.httpAuth.get(uri).map(data => data.json());
    }

    ObtenerLineas(): Observable<Linea[]> {
        const uri = `${environment.productosMaestrosApi}api/productos/ObtenerLineas`;
        return this.httpAuth.get(uri).map(data => data.json());
    }

    ObtenerProductos(distribuidorId: string,
        lineaId: string,
        descripcion: string): Observable<Producto[]> {

        const uri = `${environment.productosMaestrosApi}api/productos/ObtenerProductos/${distribuidorId}/${lineaId}/${descripcion}`;
        return this.httpAuth.get(uri).map(data => data.json());
    }

    ObtenerProveedores(): Observable<Proveedor[]> {
        const uri = `${environment.productosMaestrosApi}api/productos/ObtenerProveedores`;
        return this.httpAuth.get(uri).map(data => data.json());
    }

    RegistrarProductoParaActualizarPrecio(producto: Producto): Observable<Producto> {
        const uri = `${environment.productosMaestrosApi}api/productos/RegistrarProductoParaActualizarPrecio`;
        return this.httpAuth.post(uri, producto).map(x => x.json());
    }

    RegistrarListadDeProductoParaActualizarPrecio(productos: Producto[]): Observable<Producto> {
        const uri = `${environment.productosMaestrosApi}api/productos/RegistrarListadDeProductoParaActualizarPrecio`;
        return this.httpAuth.post(uri, productos).map(x => x.json());
    }
    CalculateNewPrices(productsToChangePrice: ProductToChangePrice[],smallMArgin: number): Observable<any> {
        const uri = `${environment.farsimanProducts}api/ChangePrice/calculateNewPrices/${smallMArgin}`;
        return this.http.post(uri, productsToChangePrice).map(x => x.json());
    }
    SaveNewPrices(configurationProductsToChange: ConfigurationProductsToChange): Observable<ProductToChangePrice[]> {
        const uri = `${environment.farsimanProducts}api/ChangePrice/saveNewPrices`;
        return this.http.post(uri, configurationProductsToChange).map(x=> x.json());
    }
    GetAllList(): Observable<ItemInformationList[]> {
        const uri = `${environment.farsimanProducts}api/ChangePrice/getAllList`;
        return this.http.get(uri).map(x=> x.json());
    }

    GridListPrice(loadGridOptions: LoadGridOptions): Observable<any> {
        const uri = `${environment.farsimanProducts}api/ChangePrice/gridListPrice`;
        return this.http.post(uri, loadGridOptions).map(x=> x.json());
    }

  GridProductos(id: string): Observable<any> {
        const uri = `${environment.farsimanProducts}api/ChangePrice/gridProductos/${id}`;
        return this.http.get(uri).map(x=> x.json());
    }

  DeleteList(id: string): Observable<any> {
        const uri = `${environment.farsimanProducts}api/ChangePrice/deleteList/${id}`;
        return this.http.get(uri);
    }
    GetList(id: string): Observable<ConfigurationProductsToChange> {
        const uri = `${environment.farsimanProducts}api/ChangePrice/getList/${id}`;
        return this.http.get(uri).map(x=> x.json());
    }
}
