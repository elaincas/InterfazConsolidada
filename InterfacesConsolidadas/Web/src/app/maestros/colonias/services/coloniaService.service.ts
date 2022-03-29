import { Sucursal } from './../models/sucursal.model';
import { Colonia } from './../models/colonia.model';
import { environment } from './../../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Ciudad } from '../models/ciudad.model';
import { ColoniaCorregir } from '../models/coloniaCorregir.model';
import { ColoniaSad } from '../models/coloniaSad.model';

@Injectable()
export class ColoniaService {

  constructor(private _httpClient: Http) { }

  ObtenerCiudades(): Observable<Ciudad[]> {
    const uri = `${environment.maestrosFarmaciaApi}/api/colonias/ObtenerCiudades`;
    return this._httpClient.get(uri).map(r => r.json() as Ciudad[]);
  }

  ObtenerColoniasDeCiudad(ciudadId: string): Observable<Colonia[]> {
    const uri = `${environment.maestrosFarmaciaApi}/api/colonias/ObtenerColoniasV2/${ciudadId}`;
    return this._httpClient.get(uri).map(r => r.json());
  }

  ObtenerColoniasActivasDeCiudad(ciudadId: string): Observable<Colonia[]> {
    const uri = `${environment.maestrosFarmaciaApi}/api/colonias/ObtenerColonias/${ciudadId}`;
    return this._httpClient.get(uri).map(r => r.json());
  }

  ActualizarColoniaCorrecta(colonias: ColoniaCorregir[]): Observable<ColoniaCorregir> {
    const uri = `${environment.maestrosFarmaciaApi}/api/colonias/ActualizarColoniaCorrecta`;
    return this._httpClient.post(uri, colonias).map(x => x.json());
  }

  AgregarColoniasSad(colonias: ColoniaSad[]): Observable<ColoniaSad> {
    const uri = `${environment.maestrosFarmaciaApi}/api/colonias/AgregarColoniasSad`;
    return this._httpClient.post(uri, colonias).map(x => {
      return x.json()
    });
  }

  ActualizarColoniasSad(colonias: ColoniaSad[]): Observable<ColoniaSad> {
    const uri = `${environment.maestrosFarmaciaApi}/api/colonias/ActualizarColoniasSad`;
    return this._httpClient.post(uri, colonias).map(x => x.json());
  }

  ObtenerColoniasSAD(ciudadId: string): Observable<Colonia[]> {
    const uri = `${environment.maestrosFarmaciaApi}/api/colonias/ObtenerColoniasSAD/${ciudadId}`;
    return this._httpClient.get(uri).map(x => x.json());
  }

  ObtenerColoniasSadDeCiudad(ciudadId: string): Observable<ColoniaSad[]> {
    const uri = `${environment.maestrosFarmaciaApi}/api/colonias/ActualizarColoniasSad/${ciudadId}`;
    return this._httpClient.get(uri).map(x => x.json());
  }

  ObtenerSucursalesSadDeCiudad(ciudadId: string): Observable<Sucursal[]> {
    const uri = `${environment.maestrosFarmaciaApi}/api/colonias/ObtenerSucursalesSadDeCuidad/${ciudadId}`;
    return this._httpClient.get(uri).map(x => x.json());
  }

  ObtenerSucursalesSadPorEmpresa(empresaId: number): Observable<Sucursal[]> {
    const uri = `${environment.maestrosFarmaciaApi}/api/colonias/ObtenerSucursalesPorEmpresa/${empresaId}`;
    return this._httpClient.get(uri).map(x => x.json());
  }

  ObtenerColoniasSadDeSucursal(ciudadId: string, sucursalId: number): Observable<ColoniaSad[]> {
    const uri = `${environment.maestrosFarmaciaApi}/api/colonias/ObtenerColoniasSadDeSucursal/${ciudadId}/${sucursalId}`;
    return this._httpClient.get(uri).map(x => x.json());
  }

  RegistrarColonia(colonia: Colonia): Observable<ColoniaSad[]> {
    const uri = `${environment.maestrosFarmaciaApi}/api/colonias/registrar`;
    return this._httpClient.post(uri, colonia).map(x => x.json());
  }

  ActualizarColonia(colonia: Colonia): Observable<ColoniaSad[]> {
    const uri = `${environment.maestrosFarmaciaApi}/api/colonias/ActualizarColonia`;
    return this._httpClient.post(uri, colonia).map(x => x.json());
  }

  ObtenerCoordenadasCiudad(ciudadNombre: string): Observable<Array<number>> {
    const uri = `https://maps.googleapis.com/maps/api/geocode/json?address=${ciudadNombre}%20HONDURAS&key=AIzaSyAVJDQloRbF_t9VZ7CClS1FwHhosgeTKx0`;
    return this._httpClient.get(uri).map(x => {
      if (x.json().status != "OK") return null;

      let ubicacion = x.json().results[0].geometry.location;

      return [ubicacion.lat, ubicacion.lng];
    });
  }

}
