import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../../login/services/login.service';
import { AuxiliarService } from './producto-auxiliar.service';
import { Producto, AuxiliarProductos } from '../../../Clases/Producto';
import { Alertas } from '../../../../../helpers/notificaciones/notificaciones';

declare var $: any;
@Component({
    selector: 'app-ingreso-producto',
    templateUrl: './producto-auxiliar.component.html',
    styleUrls: ['./producto-auxiliar.component.css'],

})
export class AuxiliarProductosComponent implements OnInit {


    ngOnInit(): void {
    }

    productos: any[];
    fechaDesde = new Date;
    fechaHasta = new Date;
    productosAuxiliar: AuxiliarProductos;
    productoID: number;
    mostrarInventarioInicial: boolean = false;
    constructor(private service: AuxiliarService, private loginService: LoginService) {
        this.productosAuxiliar = new AuxiliarProductos();
        this.productos = [];
        this.ObtenerProductos();
    }
    ObtenerProductos() {
        this.service.ObtenerProductos().subscribe(data => {
            this.productos = data;
        });
    }
    ObtenerAuxiliarProductos() {
        let mesDesde:string = (this.fechaDesde.getMonth()+1<10)?(0+""+(this.fechaDesde.getMonth()+1).toString()):(this.fechaDesde.getMonth()+1).toString()
        let mesHasta = (this.fechaHasta.getMonth()+1<10)?(0+""+(this.fechaHasta.getMonth()+1).toString()):(this.fechaHasta.getMonth()+1).toString()
        let diaDesde = (this.fechaDesde.getDate()<10)?(0+""+(this.fechaDesde.getDate()).toString()):(this.fechaDesde.getDate()).toString()
        let diaHasta = (this.fechaHasta.getDate()<10)?(0+""+(this.fechaHasta.getDate()).toString()):(this.fechaHasta.getDate()).toString()
        let fechaDesdeNueva:string = this.fechaDesde.getFullYear().toString()+mesDesde+diaDesde;
        let fechaHastaNueva:string = this.fechaHasta.getFullYear().toString()+mesHasta+diaHasta;
        this.service.ObtenerAuxiliarProductos(fechaDesdeNueva,fechaHastaNueva, this.productoID).subscribe(data => {
            this.productosAuxiliar = data
        },error=>{
            Alertas.warning("Advertencia",error._body)
        })
    }
    BusquedaInformacion() {
        if (this.SonDatosValidos()) {
            this.ObtenerAuxiliarProductos();
            this.mostrarInventarioInicial = true;
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
        if (this.productoID == null) {
            Alertas.warning("", "Producto inválido.");
            return false;
        }
        return true;
    }
}