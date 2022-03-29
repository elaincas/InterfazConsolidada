import { Component, OnInit, ViewChild } from '@angular/core';
import { Alert } from 'selenium-webdriver';

import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { LoginService } from '../../../../login/services/login.service';
import { InventariosRemotosService } from '../../../inventarios-remotos.service';
import { EstadoTransaccion } from '../../enums/estadoTransaccion';
import { TipoTransaccion } from '../../enums/tipoTransaccion';
import { AuxiliarFiltro } from '../../models/filtroAuxiliar.model';
import { TransaccionInventarioRemotoDevolucionDto } from '../../models/transaccion-inventario-remoto-devolucion';
import { TransaccionInventarioRemotoDto } from '../../models/transaccion-inventario-remoto.model';



@Component({
    selector: 'app-devolver-traslado-ir',
    templateUrl: './devolver-traslado.component.html',

})


export class DevolverTrasladoRemotoComponent implements OnInit {
    
    sucursalId: number = 0
    sucursales : any[];
    traslados : any[];
    trasladoDetalles : any[];
    traslado:any;
    trasladoEnviar: TransaccionInventarioRemotoDto;
    trasladoDevolucion : TransaccionInventarioRemotoDevolucionDto;
    nombreProductoPopup : string;
    mostrarPopup: boolean = false;
    constructor(private service: InventariosRemotosService, private loginService: LoginService) {
            this.traslados = new Array<any>();
            this.trasladoDetalles = new Array<any>();
            this.sucursales  = new Array<any>();
            this.trasladoEnviar = new TransaccionInventarioRemotoDto();
            this.trasladoDevolucion = new TransaccionInventarioRemotoDevolucionDto();
            this.nombreProductoPopup = "";
    }

    ngOnInit(): void {
    this.ObtenerSucursales();

    }

    obtenerTrasladosRecibidos()
    {
        if (this.sucursalId == 0){
            Alertas.error("Advertencia","Favor elija una sucursal")
            return;
        }
        this.service.ObtenerTrasladosRecibidos(this.sucursalId).subscribe(data => {
            debugger;
            this.traslados = data
        }, error => {
            Alertas.warning("", error);
        })
    }
    
    ObtenerSucursales() {
        this.service.ObtenerSucursales().subscribe(data => {
            this.sucursales = data
        }, error => {
            Alertas.warning("", error);
        })
    }
    Devolver(data){
        debugger;
        this.trasladoEnviar = new   TransaccionInventarioRemotoDto();
        this.nombreProductoPopup = data.nombreProducto;
        this.trasladoDevolucion.transaccionInventarioRemotoDetalleId = data.id;
        this.trasladoDevolucion.cantidadDisponible = data.cantidadDisponible;
        this.trasladoDevolucion.usuarioId = Number(this.loginService.Usuario.id);
        this.mostrarPopup = true;
        
        
        
        
    }
    RegistrarDevolucion(){
        debugger;
        if (this.trasladoDevolucion.cantidadDevuelta <= 0 ){
            Alertas.error("Error","La cantidad a devolver no puede ser menor a 1")
            return;
        }
        if (this.trasladoDevolucion.cantidadDevuelta > this.trasladoDevolucion.cantidadDisponible ){
            Alertas.error("Error","La cantidad a devolver no puede ser mayor a la cantidad disponible")
            return;
        }

        Alertas.question(`Devolver Traslado`, '¿Está seguro que desea devolver este traslado?')
        .then(() => {
            this.trasladoEnviar.usuarioRecibe = Number(this.loginService.Usuario.id);
            this.trasladoEnviar.transaccionTipoId = TipoTransaccion.Devolucion;
            this.trasladoEnviar.estadoId = EstadoTransaccion.Devuelto;
            this.trasladoEnviar.activo = false;
            this.trasladoEnviar.id = this.trasladoDevolucion.transaccionInventarioRemotoDetalleId;
            this.trasladoEnviar.sucursalId = this.sucursalId;
            this.trasladoEnviar.transaccionInventarioRemotoDevolucionDto = this.trasladoDevolucion;
            
            this.service.IngresarTransaccion (this.trasladoEnviar).subscribe(data=>{
                Alertas.ok("Exito","");
                this.Limpiar();
            },error=>{
                this.mostrarPopup = false;
                Alertas.warning("Advertencia",error._body);
            });
        })
    }
    Limpiar(){
        this.mostrarPopup = false;
        this.trasladoDevolucion = new TransaccionInventarioRemotoDevolucionDto();
        this.trasladoEnviar = new TransaccionInventarioRemotoDto()
        this.obtenerTrasladosRecibidos();
    }
    CerrarPopup(){
        this.mostrarPopup = false;
    }

}