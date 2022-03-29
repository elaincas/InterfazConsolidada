import { ProductoIndividual } from './../models/productoIndividual';
import { ProductoAlternativo } from './../models/productoAlternativo';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpAuthService } from './../../../helpers/http/http-auth.service';
import { Productos } from '../models/reporteComparativoModels/productos';
import { ResultadoComparacionProductos } from '../models/reporteComparativoModels/resultadoComparacionProductos';

@Injectable()
export class AdministracionProductosAlternativosService {

constructor(private httpAuth: HttpAuthService) { }

    GetAlternativos():Observable<ProductoAlternativo[]>{
        const uri = `${environment.maestrosFarmaciaApi}/api/productosAlternativos`;
        return this.httpAuth.get(uri).map(data => data.json());
    }

    PostAlternativo(alternativo:ProductoAlternativo):Observable<ProductoAlternativo>{
        const uri = `${environment.maestrosFarmaciaApi}/api/productosAlternativos`;
        return this.httpAuth.post(uri, alternativo).map(data => data.json());
    }

    PutAlternativo(alternativo:ProductoAlternativo):Observable<ProductoAlternativo>{
        const uri = `${environment.maestrosFarmaciaApi}/api/productosAlternativos`;
        return this.httpAuth.put(uri, alternativo).map(data => data.json());
    }

    DeleteAlternativo(productoId:number):Observable<ProductoAlternativo>{
        const uri = `${environment.maestrosFarmaciaApi}/api/productosAlternativos/eliminar/${productoId}`;
        return this.httpAuth.delete(uri).map(data => data.json());
    }

    GetIndividuales():Observable<ProductoIndividual[]>{
        const uri = `${environment.maestrosFarmaciaApi}/api/productosAlternativos/individuales`;
        return this.httpAuth.get(uri).map(data => data.json());
    }

    PostIndividual(individual:ProductoIndividual):Observable<ProductoIndividual>{
        const uri = `${environment.maestrosFarmaciaApi}/api/productosAlternativos/individuales`;
        return this.httpAuth.post(uri,individual).map(data => data.json());
    }

    PutIndividual(individual:ProductoIndividual):Observable<ProductoIndividual>{
        const uri = `${environment.maestrosFarmaciaApi}/api/productosAlternativos/individuales`;
        return this.httpAuth.put(uri,individual).map(data=>data.json());
    }

    DeleteIndividual(productoId:number):Observable<ProductoIndividual>{
        const uri = `${environment.maestrosFarmaciaApi}/api/productosAlternativos/individuales/eliminar/${productoId}`;
        return this.httpAuth.delete(uri).map(data => data.json());
    }

    ObtenerTodosProductos():Observable<Productos[]>{
      const uri = `${environment.maestrosFarmaciaApi}/api/productosAlternativos/productos`;
      return this.httpAuth.get(uri).map(data => data.json());
    }

    ObtenerProductosComparar(productosId: string[]):Observable<ResultadoComparacionProductos>{
      const uri = `${environment.maestrosFarmaciaApi}/api/productosAlternativos/productosParaComparacion`;
      return this.httpAuth.post(uri,productosId).map(data => data.json());
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
