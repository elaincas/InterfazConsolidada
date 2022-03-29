import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { DescuentoAdicionalConfiguracionConsulta, DescuentoAdicionalConfiguracion } from "../../Models/DescuentoAdicionalConfiguracion";
import { Observable } from "rxjs";
import { environment } from "../../../../../environments/environment";

@Injectable()
export class DescuentoAdicionalService {
    constructor(private http: Http) { 
        this.setDiasSemana();
    }

    diasSemana: any[];

    ObtenerDescuentosConfigurados(top: number): Observable<Array<DescuentoAdicionalConfiguracionConsulta>> {
        const url = `${environment.configuracionesApi}/api/Descuentos/ObtenerDescuentosConfigurados/${top}`;
        return this.http.get(url).map(r => r.json());
    }

    GuardarConfiguracionDeDescuento(nuevaConfiguracionDescuento: DescuentoAdicionalConfiguracion): Observable<DescuentoAdicionalConfiguracionConsulta> {
        const url = `${environment.configuracionesApi}/api/Descuentos/GuardarConfiguracionDeDescuento`;
        return this.http.post(url, nuevaConfiguracionDescuento).map(r => r.json());
    }

    ActualizarConfiguracionDeDescuento(nuevaConfiguracionDescuento: DescuentoAdicionalConfiguracion): Observable<DescuentoAdicionalConfiguracion> {
        const url = `${environment.configuracionesApi}/api/Descuentos/ActualizarConfiguracionDeDescuento`;
        return this.http.post(url, nuevaConfiguracionDescuento).map(r => r.json());
    }

    EliminarConfiguracionDeDescuento(usuarioId: number, descuentoId: number): Observable<DescuentoAdicionalConfiguracion> {
        const url = `${environment.configuracionesApi}/api/Descuentos/EliminarConfiguracionDeDescuento/${usuarioId}/${descuentoId}`;
        return this.http.get(url).map(r => r.json());
    }

    getDiasSemana() {
        return this.diasSemana;
    }

    setDiasSemana() {
        this.diasSemana = [
            {
                nombre: 'Domingo',
                valor: '1'
            },
            {
                nombre: 'Lunes',
                valor: '2'
            },
            {
                nombre: 'Martes',
                valor: '3'
            },
            {
                nombre: 'Miércoles',
                valor: '4'
            },
            {
                nombre: 'Jueves',
                valor: '5'
            },
            {
                nombre: 'Viernes',
                valor: '6'
            },
            {
                nombre: 'Sábado',
                valor: '7'
            }
        ];
    }

}