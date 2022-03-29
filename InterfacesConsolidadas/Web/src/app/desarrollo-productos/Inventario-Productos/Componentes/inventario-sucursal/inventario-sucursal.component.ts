import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MovimientoDeProducto, MovimientoProductoDetalle } from '../../_Clases/MovimientoDeProducto'
import { Finalidades } from '../../_Clases/Finalidades';
import { debugOutputAstAsTypeScript } from '@angular/compiler';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { ProductoGrid, ProductosGridTraslados } from '../../_Clases/GridTrasladoProductos';
import { DxDataGridComponent } from 'devextreme-angular';
import { TrasladosEnviados } from '../../_Clases/TrasladosEnviados';
import { InventarioService } from './inventario-sucursal.service';
import { Sucursales } from '../../_Clases/Sucursales';
import { InventarioSucursal } from '../../_Clases/InventarioSucursal';
import { ImprimirDocumento } from '../../helpers/impresion/imprimir'
import customStorage from 'devextreme/data/custom_store';
import dataSource from 'devextreme/data/data_source';
import { InventarioProductosImpulsadoService } from '../../services/inventario-service.service';

@Component({
    selector: 'app-inventario-sucursal',
    templateUrl: './inventario-sucursal.component.html',
    styleUrls: ['./inventario-sucursal.component.css'],
    providers: [InventarioService],

})


export class InventarioSucursalComponent implements OnInit {
    habilitar: boolean = false;
    sucursal: number = 0;
    sucursales: Sucursales[];
    inventarios: InventarioSucursal[];
    dataSourceSucursales:dataSource;
    sucursalNombre: string;
     constructor(private service: InventarioService ,private serviceInventarioProductoImpulsados: InventarioProductosImpulsadoService) {
        this.sucursales = new Array<Sucursales>();
        this.inventarios = new Array<InventarioSucursal>();
    }

    ngOnInit() {

        this.configurarDataSource();
    };

    ObtenerInventario() {
        if (this.Validar()) {
            this.service.ObtenerInventario(this.sucursal).subscribe(data => {
                this.inventarios = data as InventarioSucursal[];
            });
        }
    }

    Validar(): boolean {
        if (this.sucursal == 0) {
            Alertas.warning("", "Favor elija una sucursal!");
            return false;
        }
        return true;
    }
    Imprimir(data) {

        this.habilitar = true;



    }

    Cancelar(){
        this.habilitar = false;
    }

    printToCart(printSectionId: string) {
        let popupWinindow
        let innerContents = document.getElementById(printSectionId).innerHTML;
        popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
        popupWinindow.document.open();
        popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + innerContents + '</html>');
        popupWinindow.document.close();
        this.habilitar = false;
    }

    configurarDataSource() {



      const customs = new customStorage({
        load: this.buscarSucursales.bind(this),
        byKey: (key: any) => new Promise<any>((resolve, reject) => {
          resolve(null);
        }),
      });

      this.dataSourceSucursales = new dataSource({
        store: customs
      });
    }
    buscarSucursales(options: any): Promise<any> {
      return new Promise<any>((resolve, reject) => {
        const textoBusqueda = this.dataSourceSucursales.searchValue();



        this.serviceInventarioProductoImpulsados.ObtenerSucursalesFiltradas( this.dataSourceSucursales.pageIndex().toString(), this.dataSourceSucursales.pageSize().toString(),textoBusqueda)
          .then(data => resolve(data));
      });
    }
    onValueCha(e:any):void{
    this.sucursalNombre= e.component.option("text");
    }
}


