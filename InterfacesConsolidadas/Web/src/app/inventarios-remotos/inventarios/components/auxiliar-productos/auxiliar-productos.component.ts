import { Component, OnInit, ViewChild } from '@angular/core';
import { THROW_IF_NOT_FOUND } from '@angular/core/src/di/injector';

import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { LoginService } from '../../../../login/services/login.service';
import { InventariosRemotosService } from '../../../inventarios-remotos.service';
import { EstadoTransaccion } from '../../enums/estadoTransaccion';
import { TipoTransaccion } from '../../enums/tipoTransaccion';
import { AuxiliarFiltro } from '../../models/filtroAuxiliar.model';
import { TransaccionInventarioRemotoDto } from '../../models/transaccion-inventario-remoto.model';



@Component({
    selector: 'app-auxiliar-productos',
    templateUrl: './auxiliar-productos.component.html',

})
export class AuxiliarProductoRemotoComponent implements OnInit {
    productos: any[];
    sucursales: any[];
    filtro: AuxiliarFiltro;
    transacciones: any[];
    trasladoEnviar : TransaccionInventarioRemotoDto;

    constructor(private service: InventariosRemotosService, private loginService: LoginService) {
        this.productos = [];
        this.sucursales = [];
        this.filtro = new AuxiliarFiltro();
        this.transacciones = new Array<any>();
        this.trasladoEnviar = new TransaccionInventarioRemotoDto();
    }


    ngOnInit() {
        this.ObtenerSucursales();
    }
    ObtenerDataSucursal(){
        debugger;
        if(this.filtro.sucursalId == 0){
            return;
        }

        this.ObtenerProductos();
    }
    ObtenerProductos() {
        this.service.ObtenerProductos(this.filtro.sucursalId,false).subscribe(data => {
            this.productos = data
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

    AceptarTraslado(dataTraslado){
        
        this.trasladoEnviar = new   TransaccionInventarioRemotoDto();
        
        Alertas.question(`Aceptar Traslado`, '¿Está seguro que desea aceptar este traslado?')
        .then(() => {
            this.trasladoEnviar.usuarioRecibe = Number(this.loginService.Usuario.id);
            this.trasladoEnviar.transaccionTipoId = TipoTransaccion.Entrada;
            this.trasladoEnviar.estadoId = EstadoTransaccion.Recibido;
            this.trasladoEnviar.activo = true;
            this.trasladoEnviar.id = dataTraslado.id;
            this.trasladoEnviar.sucursalId = this.filtro.sucursalId;
            
            
            this.service.IngresarTransaccion (this.trasladoEnviar).subscribe(data=>{
                Alertas.ok("Exito","");
                this.Limpiar();
            },error=>{
                Alertas.warning("Advertencia",error);
            });
        })
    }
    Denegar(dataTraslado){
        this.trasladoEnviar = new   TransaccionInventarioRemotoDto();
        Alertas.question(`Denegar Traslado`, '¿Está seguro que desea denegar este traslado?')
        .then(() => {
            this.trasladoEnviar.usuarioRecibe = Number(this.loginService.Usuario.id);
            this.trasladoEnviar.transaccionTipoId = TipoTransaccion.Entrada;
            this.trasladoEnviar.estadoId = EstadoTransaccion.Denegado;
            this.trasladoEnviar.activo = false;
            this.trasladoEnviar.id = dataTraslado.id;
            this.trasladoEnviar.sucursalId = this.filtro.sucursalId;
            
            
            this.service.IngresarTransaccion (this.trasladoEnviar).subscribe(data=>{
                Alertas.ok("Exito","");
                this.Limpiar();
            },error=>{
                Alertas.warning("Advertencia",error);
            });
        })

    }

    Buscar() {
        debugger;
        this.service.ObtenerAuxiliar(this.filtro).subscribe(data => {
            Alertas.ok("Exito", "");
            this.transacciones = data;
        }, error => {
            Alertas.warning("Advertencia", error);
        });
    }

    Limpiar(){
        // this.cantidadProductoSeleccionado = 0;
        // this.trasladoEnviar = new TransaccionInventarioRemotoDto()
        // this.trasladoEnviarDetalle = new TransaccionInventarioRemotoDetalle()
        // this.trasladoEnviarDetalles = [];
        // this.trasladosPendientes = [];

    }

}
