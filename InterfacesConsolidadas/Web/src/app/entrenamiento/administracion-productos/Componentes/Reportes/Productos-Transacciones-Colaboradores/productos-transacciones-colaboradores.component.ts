import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../../login/services/login.service';
import { ProductoTransaccionesColaboradoresService } from './productos-transacciones-colaboradores.service';
import { Producto } from '../../../Clases/Producto';
import { Alertas } from '../../../../../helpers/notificaciones/notificaciones';

declare var $: any;
@Component({
    selector: 'app-ingreso-producto',
    templateUrl: './productos-transacciones-colaboradores.component.html',
    styleUrls: ['./productos-transacciones-colaboradores.component.css'],

})
export class ProductosTransaccinoesColaboradorComponent implements OnInit {


    ngOnInit(): void {
    }

    transaccionesProductos: any[];
    fechaDesde = new Date;
    fechaHasta = new Date;
    estadoID: number = 6;//default asignado
    estados: any[];
    constructor(private service: ProductoTransaccionesColaboradoresService, private loginService: LoginService) {
        this.ObtenerEstados();
    }
    ObtenerEstados() {
        this.service.obtenerEstados().subscribe(data => {
            this.estados = data;
            this.estados.splice(0,1);
        });
    }
    ObtenerProductosdisponibles() {
        let mesDesde:string = (this.fechaDesde.getMonth()+1<10)?(0+""+(this.fechaDesde.getMonth()+1).toString()):(this.fechaDesde.getMonth()+1).toString()
        let mesHasta = (this.fechaHasta.getMonth()+1<10)?(0+""+(this.fechaHasta.getMonth()+1).toString()):(this.fechaHasta.getMonth()+1).toString()
        let diaDesde = (this.fechaDesde.getDate()<10)?(0+""+(this.fechaDesde.getDate()).toString()):(this.fechaDesde.getDate()).toString()
        let diaHasta = (this.fechaHasta.getDate()<10)?(0+""+(this.fechaHasta.getDate()).toString()):(this.fechaHasta.getDate()).toString()
        let fechaDesdeNueva:string = this.fechaDesde.getFullYear().toString()+mesDesde+diaDesde;
        let fechaHastaNueva:string = this.fechaHasta.getFullYear().toString()+mesHasta+diaHasta;
        this.service.ObtenerTransaccionesProductosColaboradores(fechaDesdeNueva,fechaHastaNueva, this.estadoID).subscribe(data => {
            this.transaccionesProductos = data as any[];
        })
    }
    BusquedaInformacion() {
        if (this.SonDatosValidos()) {
            this.ObtenerProductosdisponibles();
        }
    }
    SonDatosValidos(): Boolean {
        if (this.fechaDesde == null) {
            Alertas.warning("", "Fecha desde inválida.");
            return false;
        }
        if (this.fechaHasta == null) {
            Alertas.warning("", "Fecha hasta inválida.");
            return false;
        }
        if (this.estadoID == null) {
            Alertas.warning("", "Estado inválida.");
            return false;
        }
        return true;
    }
    anular(transccionId: number): void {
        Alertas.question("¡Advertencia!","¿Seguro que desea anular la asignación?").then(d=>{
            this.service.AnularAsignacion(transccionId.toString()).subscribe(data=>{
               Alertas.ok("", "La asignación a sido anulada con éxito.");
            })
            
        })
      } 
}
