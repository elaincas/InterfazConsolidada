import { Injectable } from "@angular/core";
import { RequestOptions,Headers } from "@angular/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { ArchivoExcelEImagenes } from "../../desarrollo-productos/Planimetrias/Clases/Archivos";
import { HttpAuthService } from "../../helpers/http/http-auth.service";
import { ProductoArchivo } from "./models/productoarchivo";

@Injectable()
export class ProductoArchivoService {

    private urlCommons = 'http://localhost:53436/api/common/';
    constructor(private http: HttpAuthService) {
    }

    ObtenerProductos(): Observable<Array<any>> {
        const url = `${environment.ecommerceArchivosMultimedia}` + '/api/Productos/obtenerProductos';
        return this.http.get(url).map(r => r.json());
      }
      ObtenerTags(): Observable<Array<any>> {
        const url = `${environment.ecommerceArchivosMultimedia}` + '/api/Productos/obtenerTags';
        return this.http.get(url).map(r => r.json());
      }
      ObtenerUrlPRoductoSeleccionado(productoID:string): Observable<Array<any>> {
        const url = `${environment.ecommerceArchivosMultimedia}` + '/api/Productos/obtenerUrlArchivosProducto/'+productoID;
        return this.http.get(url).map(r => r.json());
      }


    agregarArchivoFormData(files: Array<ArchivoExcelEImagenes>, formData: FormData, fileId?: string): string {
        files.forEach(file=>{
            formData.append(fileId,file.ArchivoImagen.File[0]);
      })
        return fileId;
    }
  
    AgregarArchivo(productoArchivo: ProductoArchivo){
        let uri: string
        let formData = new FormData();
        let modelo = 'archivo';

        debugger;
        this.agregarArchivoFormData(productoArchivo.Archivos, formData,modelo);

        formData.append(modelo, productoArchivo.toJson());
        uri = `${environment.ecommerceArchivosMultimedia}/api/Archivos/AgregarArchivos`;
        return this.http.post(uri, formData).map(x => x.json() as any);
    }
    // AgregarNuevoTipoPlanimetria(tipoPlanimetriaDescripcion:string){
    //     let uri = `${environment.planimetriaApi}/api/planimetrias/nuevotipoplamimetria?tipoPlanimetriaDescripcion=${tipoPlanimetriaDescripcion}`;
    //     return this.http.post(uri,tipoPlanimetriaDescripcion).map(x => x.json() as any);
    // }
    async getImage(url, fileName) {
        debugger;
        // on the first then you will return blob from response
       return await fetch(url,  {
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin':'*'
        }
      })
        .then(r => r.blob())
        .then((blob) => { // on the second, you just create a file from that blob, getting the type and name that intend to inform
            debugger;
           return new File([blob], fileName+'.'+   blob.type.split('/')[1]) ;
       });
   };
}
