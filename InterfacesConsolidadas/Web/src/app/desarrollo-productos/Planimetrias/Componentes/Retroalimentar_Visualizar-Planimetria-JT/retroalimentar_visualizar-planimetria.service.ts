import { Injectable } from "@angular/core";
import { Http, RequestOptions,Headers, ResponseContentType } from "@angular/http";
import { Observable } from "rxjs";
import { Planimetria } from "../../Clases/Planimetria";
import { environment } from "../../../../../environments/environment";
import { Archivos, ArchivoExcelEImagenes, DevolverArchivo } from "../../Clases/Archivos";
import { HttpAuthService } from "../../../../helpers/http/http-auth.service";

@Injectable()
export class VisualizarRetroalimentarPlanimetriaService {
    private urlCommons = 'http://localhost:53436/api/common/';
    private urlPlanimetria = 'http://localhost:53436/api/planimetrias/';
   
    constructor(private http: Http,private httpAuth: HttpAuthService) {
    }
    
     ObtenerInformacionImagenes(tipoPlanimetriaID:number,sucursalID: number): Observable<DevolverArchivo> {
        const url = `${this.urlPlanimetria}ObtenerInfoImagenes/`+tipoPlanimetriaID+`/`+sucursalID;
        return this.http.get(url).map(r=>r.json());
      }
      ObtenerInformacionArchivos(tipoPlanimetriaID:number,sucursalID: number): Observable<DevolverArchivo> {
        const url = `${this.urlPlanimetria}ObtenerInfoArchivos/`+tipoPlanimetriaID+`/`+sucursalID;
        return this.http.get(url).map(r=>r.json());
      }
      descargarArchivos(nombreArchivo: string) {
        const url = `${this.urlPlanimetria}ObtenerArchivo?nombreArchivo=${nombreArchivo}`;
            return this.httpAuth
                .getfile(url)
                .map(res => {
                    console.log(this.getFileNameFromHttpResponse(res));
                    return {
                        filename: this.getFileNameFromHttpResponse(res),
                        data: res.blob()
                    };
              })
    }

    getFileNameFromHttpResponse(httpResponse) {
        var contentDispositionHeader = httpResponse.headers.get('content-disposition');
        var result = contentDispositionHeader.split(';')[1].trim().split('=')[1];
        return result.replace(/"/g, '');
    }
      ObtenerTipoPlanimetrias(): Observable<Array<any>> {
        const url = `${this.urlCommons}` + 'tipoplanimetrias';
        return this.http.get(url).map(r => r.json());
      }
      ObtenerSucursales():Observable<Array<any>>{
        const url = `${this.urlCommons}` + 'sucursales';
        return this.http.get(url).map(r => r.json());      
    }
    ObtenerArchivo(nombreArchivo: string) {
        let headers = new Headers();
        headers.append('Content-Type', 'image/png');
        let options = new RequestOptions({headers,responseType: ResponseContentType.Blob});
        const url = `${this.urlPlanimetria}ObtenerArchivo?nombreArchivo=${nombreArchivo}`;
        return this.http.get(url,options) 
          .map(res => res.blob());
      }
      RetroAlimentarPlanimetria(planimetria: Planimetria){
        let uri: string
        let formData = new FormData();
        let modelo = 'model';

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        this.agregarArchivoFormData(planimetria.Archivos, formData,modelo);

        formData.append(modelo, planimetria.toJson());
        uri = `${environment.planimetriaApi}/api/planimetrias/retroalimentar`;
        return this.http.post(uri, formData).map(x => x.json() as any);
    }
    agregarArchivoFormData(files: Array<ArchivoExcelEImagenes>, formData: FormData, fileId?: string): string {
        files.forEach(file=>{
            formData.append(fileId,file.ArchivoImagen.File[0]);
      })
        return fileId;
    }
}