import { DatePipe } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import { Component, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import dataSource from 'devextreme/data/data_source';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { ReporteFacturaProductoDom } from '../../models/reporteexamencallcenter.models'
import { ReporteFacturaProductoService } from '../../services/ReporteFacturaProductoService'
import { DxDataGridComponent,DxSelectBoxModule } from 'devextreme-angular';
import DataSource from "devextreme/data/data_source";
import { ThrowStmt } from '@angular/compiler';

@Component({
    selector: 'app-reporte',
    templateUrl: './reporteexamenescallcenter.component.html',
    styleUrls: [ './reporteexamenescallcenter.component.css'],
    
})

export class ReporteExamenesCallCenterComponent implements OnInit {
    ReporteFacturaProducto = new Array<any>();
    bloquearBusqueda: boolean = true;
    fechaFinal:Date = new Date();
    fechaInicial:Date = new Date();
    sucursales:DataSource;
    sucursal:any;
    _mostrarPopup: boolean;

    constructor(private ReporteFacturaProductoService: ReporteFacturaProductoService) {
 
    }

    ngOnInit() {
       
       /*this.ReporteFacturaProductoService.obtenerSucursales().subscribe(data => {
           let consulta = data as any[]
           console.log(consulta);
           this.sucursales = new DataSource({
            store: consulta,
            map: function(item) {
                return {
                    key: item.sucursalID,
                    nombre:item.nombreSucursal
                }
            }
        });
       }, error =>{})
       */
       this.sucursales =new DataSource([{ key: 37 , nombre: 'RIO DE PIEDRAS'}])
       
    }

    validarBoton(){
        
        if(this.validarCamposVacios() || 
            this.validarFechaInicialMenor() || 
            this.validarFormato()
            ){
            this.bloquearBusqueda = true
            return
        }
        this.bloquearBusqueda = false;
    }

    validarCamposVacios(){
        if(!this.sucursal || !this.fechaInicial || !this.fechaFinal){
            return true
        }
        
        return false;
    }
    validarFechaInicialMenor(){
        if( this.fechaInicial > this.fechaFinal){
            Alertas.error("La fecha inicial tiene que ser menor o igual")
            this.resetearFechas();
            return true
        }
        return false
    }

    validarFormato(){
        var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/; //Declare Regex
        if( !this.fechaInicial.toLocaleDateString().match(rxDatePattern) ||
            !this.fechaFinal.toLocaleDateString().match(rxDatePattern) 
        ){
            Alertas.error("Formato de fecha Incorrecto")
            this.resetearFechas();
            return true
        }
        return false
    }
    resetearFechas(){
        this.fechaFinal = new Date()
        this.fechaInicial = new Date();
    }
    obtenerReporte() {
        
        this.ReporteFacturaProductoService.obtenerReporteExamenCallCenter(this.sucursal,this.fechaInicial,this.fechaFinal).subscribe(data => {
            this.ReporteFacturaProducto = data as any[];
            
        }, error => {
        });
       
    }
}
