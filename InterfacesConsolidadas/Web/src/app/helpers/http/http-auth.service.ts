import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { isNullOrUndefined } from 'util';
import { VariablesGlobales } from '../../helpers/VariablesGlobales';

@Injectable()
export class HttpAuthService {

  constructor(private http: Http) { }

  get(uri: string, headersArgs?: IHeader[]): Observable<Response> {
    return this.http.get(uri, this.agregarHeaders(headersArgs));
  }

  getfile(uri: string, headersArgs?: IHeader[]): Observable<Response> {
    let headers = this.obtenerHeaders(headersArgs);
    return this.http.get(uri, new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob }));
  }

  private obtenerHeaders(headersArgs?: IHeader[]): Headers {
    let headers = new Headers();
    this.agregarTokenHeader(headers);
    this.agregarMultipaisHeaders(headers);

    if (Array.isArray(headersArgs)) {
      headersArgs.forEach(args => headers.append(args.name, args.value))
    }

    return headers;
  }

  post(uri: string, body: any, headersArgs?: IHeader[]): Observable<Response> {
    return this.http.post(uri, body, this.agregarHeaders(headersArgs));
  }

  put(uri: string, body: any, headersArgs?: IHeader[]): Observable<Response> {
    return this.http.put(uri, body, this.agregarHeaders(headersArgs));
  }

  delete(uri: string, headersArgs?: IHeader[]): Observable<Response> {
    return this.http.delete(uri, this.agregarHeaders(headersArgs));
  }

  private agregarHeaders(headersArgs?: IHeader[]): RequestOptions {
    let headers = new Headers();
    this.agregarTokenHeader(headers);
    this.agregarMultipaisHeaders(headers);   

    if (Array.isArray(headersArgs)) {
      headersArgs.forEach(args => headers.append(args.name, args.value))
    }
    return new RequestOptions({ headers: headers });
  }

  public agregarTokenHeader(headers: Headers) {
    let currentUser = JSON.parse(localStorage.getItem('auth'));
    if (currentUser && currentUser.token) {
      headers.append('Authorization', 'Bearer ' + currentUser.token);
      headers.append('Access-Control-Allow-Origin', '*');
    }
  }

  public agregarMultipaisHeaders(headers: Headers) {
    headers.append('x-empresaid', VariablesGlobales.CodigoEmpresa);
    headers.append('x-codigo-pais', VariablesGlobales.CodigoPais);
  }

  public ObtenerError(err: any){
    console.log(err);
  }

}

export interface IHeader {
  name: any;
  value: any;
}