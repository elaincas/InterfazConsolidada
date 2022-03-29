import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { ImagenforS3 } from "../models/ImagenForS3";
import { Observable } from "rxjs/Observable";
import { ImagenFactura } from "../models/imagen-factura";
import { ImagenFacturaGrid } from "../models/imagen-factura-grid";
import { environment } from '../../../../../environments/environment';
import { Empresa } from "../models/empresa.model";
import { Sucursal } from "../../../../maestros/colonias/models/sucursal.model";

@Injectable()
export class SubirImagenesService {
  /**
   *
   */
  constructor(private http: Http) {


  }
  AgregarImagenFactura(imgenforS3: any): Observable<any> {

    const uri = "https://eij1047et1.execute-api.us-east-1.amazonaws.com/Production/upload-image";
    return this.http
      .post(uri, imgenforS3)
      .map(response => response.json());
  }


  ObtenerSeccionesFactura(): Observable<Array<any>> {

    const uri = environment.configuracionesApi + "/api/FacturacionImpresiones/ObtenerSecciones";
    return this.http
      .get(uri)
      .map(response => response.json());
  }

  ObtenerSucursales(): Observable<Sucursal[]> {
    const uri = environment.configuracionesApi + "/api/FacturacionImpresiones/Sucursales";
    return this.http
      .get(uri)
      .map(response => response.json());
  }


  ObtenerEmpresas(): Observable<Empresa[]> {
    const uri = environment.configuracionesApi + "/api/FacturacionImpresiones/ObtenerEmpresas";
    return this.http
      .get(uri)
      .map(response => response.json());
  }

  ObtenerImagenesFactura(seccionFacturaId=0): Observable<Array<any>> {
    const uri = environment.configuracionesApi + "/api/FacturacionImpresiones/ObtenerImagenesFactura?seccionFacturaId=" + seccionFacturaId;
    return this.http
      .get(uri)
      .map(response => response.json());
  }

  GuardarInformacionBaseDeDatos(imagenFactura: ImagenFactura): Observable<string> {

    const uri = environment.configuracionesApi + "/api/FacturacionImpresiones/GuardarImagen";
    return this.http
      .post(uri, imagenFactura)
      .map(response => response.json());
  }

  ActualizarInformacionBaseDeDatos(imagenFactura: ImagenFactura): Observable<string> {

    const uri = environment.configuracionesApi + "/api/FacturacionImpresiones/ActualizarImagen";
    return this.http
      .post(uri, imagenFactura)
      .map(response => response.toString());
  }
  EliminarImmagen(imagenId: string,sucursalId:number): Observable<string> {

    const uri = environment.configuracionesApi + "/api/FacturacionImpresiones/EliminarImagen/" + imagenId+"/"+sucursalId;
    return this.http
      .get(uri)
      .map(response => response.json());
  }

}
