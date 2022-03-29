import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpAuthService } from '../../../helpers/http/http-auth.service';

@Injectable()
export class ConsultorioService {

    private url = environment.ecommerceApi + '/api/Consultorios'


    constructor(private httpAuth: HttpAuthService, private http: Http) { }

    ObtenerConsultorios(): Observable<any[]> {
        const uri = `${this.url}/ObtenerConsultorios`;
        return this.http.get(uri).map(r => r.json() as any[]);
    }

    ObtenerMedicos(): Observable<any[]> {
        const uri = `${this.url}/ObtenerMedicos`;
        return this.http.get(uri).map(r => r.json() as any[]);
    }
    ObtenerMedicosConsultorio(conultorioId : number): Observable<any[]> {
        const uri = `${this.url}/ObtenerMedicosConsultorio/`+conultorioId;
        return this.http.get(uri).map(r => r.json() as any[]);
    }
    AgregarConsultorio(consultorio : any): Observable<any[]> {
        const uri = `${this.url}/AgregarConsultorio`;
        return this.http.post(uri,consultorio).map(r => r.json() as any[]);
    }
    AgregarMedicoConsultorio(consultorioMedico : any): Observable<any[]> {
        const uri = `${this.url}/AgregarMedicoConsultorio`;
        return this.http.post(uri,consultorioMedico).map(r => r.json() as any[]);
    }
    ModificarConsultorio(consultorio : any): Observable<any[]> {
        const uri = `${this.url}/ModificarConsultorio`;
        return this.http.post(uri,consultorio).map(r => r.json() as any[]);
    }
    ModificarMedicoConsultorio(consultorioMedico : any): Observable<any[]> {
        const uri = `${this.url}/ModificarConsultorioMedico`;
        return this.http.post(uri,consultorioMedico).map(r => r.json() as any[]);
    }

}