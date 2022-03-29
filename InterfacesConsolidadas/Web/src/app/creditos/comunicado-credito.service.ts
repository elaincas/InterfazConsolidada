import { Injectable } from '@angular/core';
import { TipoConfiguracion } from './models/tipoConfiguracion.model';
import { ComunicadoCredito } from './models/comunicado-credito.model';
import { environment } from '../../environments/environment';
import { Http } from '@angular/http';
import { EmpresaPorAseguradora } from './models/empresa-por-aseguradora.model';
import { ClienteCredito } from './models/clienteCredito.model';
import { ComunicadoCreditoDocumento } from './models/comunicado-credito-documento.model';
import { FiltroComunicadoCredito } from './models/filtroComunicadoCredito.model';

@Injectable()
export class ComunicadoCreditoService {
    clientes : any[]  = [];
    polizas : any[] = [];
    constructor(
        private http: Http
    ) { 
      
    }

    obtenerConfiguracionComunicados(): TipoConfiguracion[] {
        this.obtenerClientes().subscribe(data=>{
            this.clientes = data as any[];
            console.log(this.clientes)
        })

        this.obtenerPolizas().subscribe(data=>{
            this.polizas = data as any[];
            console.log(this.polizas)
        })
        let tipoConfiguraciones: TipoConfiguracion[] = [{
            id: 1,
            nombre: "Clientes",
            source : this.clientes
        },
        {
            id: 2,
            nombre: "Pólizas",
            source : this.polizas
        }];
        return tipoConfiguraciones;
    }
    agregarComunicadoAsync(comunicado: ComunicadoCredito) {
        const formData = new FormData();
        const uri = `${environment.comunicadoCreditoApi}/api/Comunicado/agregarComunicado`;

        let headers = new Headers();
        formData.append("model", JSON.stringify(comunicado));
        formData.append("otro", comunicado.imagen[0]);
        return this.http.post(uri, formData).map(x => x.json() as ComunicadoCredito);
      }
    
      obtenerPolizas(){
        const uri = `${environment.comunicadoCreditoApi}/api/Comunicado/obtenerPolizas`;
        return this.http.get(uri).map(x=>x.json() as EmpresaPorAseguradora[])

      }
      obtenerClientes(){
        const uri = `${environment.comunicadoCreditoApi}/api/Comunicado/obtenerClientes`;
        return this.http.get(uri).map(x=>x.json() as ClienteCredito[])
      }
      ObtenerComunicados(filtro: FiltroComunicadoCredito){
        const uri = `${environment.comunicadoCreditoApi}/api/Comunicado/obtenerComunicados`;
        return this.http.post(uri,filtro).map(x=>x.json() as ComunicadoCreditoDocumento[])
      }
      DeshabilitarComunicadoDocumento(comunicado: ComunicadoCreditoDocumento){
        const uri = `${environment.comunicadoCreditoApi}/api/Comunicado/eliminarDocumento`;
        return this.http.post(uri,comunicado).map(x=>x.json() as ComunicadoCreditoDocumento[])
      }
}
