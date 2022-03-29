import { environment } from './../../environments/environment.prod';
import { Observable } from 'rxjs';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ProductoService {

    constructor(private _httpClient: Http) { }

    Buscador(busqueda: string): Observable<any> {
        const uri = `${environment.cuponDigital}/buscador/Search/` + busqueda;
        return this._httpClient.get(uri).map(x => x.json());
    }
}
