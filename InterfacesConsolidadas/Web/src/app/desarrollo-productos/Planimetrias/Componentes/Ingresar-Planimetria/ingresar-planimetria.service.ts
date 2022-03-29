import { Injectable } from "@angular/core";
import { Http, RequestOptions,Headers } from "@angular/http";
import { Observable } from "rxjs";
import { Planimetria } from "../../Clases/Planimetria";
import { environment } from "../../../../../environments/environment";
import { Archivos, ArchivoExcelEImagenes } from "../../Clases/Archivos";

@Injectable()
export class IngresarPlanimetriaService {

    private urlCommons = 'http://localhost:53436/api/common/';
    constructor(private http: Http) {
    }

    ObtenerTipoPlanimetrias(): Observable<Array<any>> {
        const url = `${this.urlCommons}` + 'tipoplanimetrias';
        return this.http.get(url).map(r => r.json());
      }
      ObtenerSucursales():Observable<Array<any>>{
        const url = `${this.urlCommons}` + 'sucursales';
        return this.http.get(url).map(r => r.json());      
    }
    agregarArchivoFormData(files: Array<ArchivoExcelEImagenes>, formData: FormData, fileId?: string): string {
        files.forEach(file=>{
            if (file.ArchivoExcel != null){
                formData.append(fileId,file.ArchivoExcel.File[0]);
            }
            formData.append(fileId,file.ArchivoImagen.File[0]);
      })
        return fileId;
    }
    AgregarPlanimetria(planimetria: Planimetria){
        let uri: string
        let formData = new FormData();
        let modelo = 'model';

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        this.agregarArchivoFormData(planimetria.Archivos, formData,modelo);

        formData.append(modelo, planimetria.toJson());
        uri = `${environment.planimetriaApi}/api/planimetrias/crear`;
        return this.http.post(uri, formData).map(x => x.json() as any);
    }
    AgregarNuevoTipoPlanimetria(tipoPlanimetriaDescripcion:string){
        let uri = `${environment.planimetriaApi}/api/planimetrias/nuevotipoplamimetria?tipoPlanimetriaDescripcion=${tipoPlanimetriaDescripcion}`;
        return this.http.post(uri,tipoPlanimetriaDescripcion).map(x => x.json() as any);
    }
}
