import { Component, OnInit, ViewChild } from '@angular/core';
import { defaultIterableDiffers } from '@angular/core/src/change_detection/change_detection';

import { DxLookupComponent } from 'devextreme-angular';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { LoginService } from '../../../../login/services/login.service';
import { InventariosRemotosService } from '../../../inventarios-remotos.service';
import { EstadoTransaccion } from '../../enums/estadoTransaccion';
import { TipoTransaccion } from '../../enums/tipoTransaccion';
import { TransaccionInventarioRemotoDetalle } from '../../models/transaccion-inventario-remoto-detalle.model';
import { TransaccionInventarioRemotoDto } from '../../models/transaccion-inventario-remoto.model';



@Component({
    selector: 'app-traslados-productos',
    templateUrl: './traslados-productos.component.html',
    styleUrls: ['./traslados-productos.component.css'],
})
export class TrasladoProductoInventarioRemotoComponent implements OnInit {
    productos: any[];
    sucursales: any[];
    estados: any[];
    transaccionestipos: any[];
    trasladoEnviar: TransaccionInventarioRemotoDto;
    trasladoEnviarDetalle: TransaccionInventarioRemotoDetalle;
    trasladoEnviarDetalles: TransaccionInventarioRemotoDetalle[];
    trasladosPendientes: any[];
    cantidadProductoSeleccionado: number = 0;
    textoParaListadoDeProductos: string = "Lista de productos a Enviar";
    esTraslado: boolean = true;
    mostrarPopup: boolean = false;
    constructor(private service: InventariosRemotosService, private loginService: LoginService) {
        this.productos = [];
        this.sucursales = [];
        this.estados = [];
        this.transaccionestipos = [];
        this.trasladoEnviar = new TransaccionInventarioRemotoDto() ;
        this.trasladoEnviarDetalle = new TransaccionInventarioRemotoDetalle ();
        this.trasladosPendientes = new Array<any>();
        this.trasladoEnviarDetalles = new Array<TransaccionInventarioRemotoDetalle>();
    }


    ngOnInit() {
        this.ObtenerEstados();
        this.ObtenerTransaccionesTipos();
        this.ObtenerSucursales();
    }

    ObtenerProductos() {
        this.service.ObtenerProductos(this.trasladoEnviar.sucursalId).subscribe(data => {
            this.productos = data
        }, error => {
            Alertas.warning("",error);
        })
    }
    ObtenerTrasladosPendientes() {
        this.service.ObtenerTrasladosPendientesSucursal(this.trasladoEnviar.sucursalId).subscribe(data => {
            debugger;
            this.trasladosPendientes = data
        }, error => {
            debugger;
            Alertas.warning("",error);
        });

    }

    RevisarTrasladosPendientes(){
        debugger;
        if (this.trasladoEnviar.sucursalId == 0){
            this.mostrarPopup= false;
            Alertas.warning("Advertencia","Por favor elija una sucursal")
            return;
        }
        this.mostrarPopup = true;
    }

    ObtenerDataSucursal(){
        if(this.trasladoEnviar.sucursalId == 0){
            return;
        }

        this.ObtenerTrasladosPendientes();
        this.ObtenerProductos();
    }

    ObtenerEstados() {
        this.service.ObtenerEstados().subscribe(data => {
            this.estados = data
        }, error => {
            Alertas.warning("",error);
        })
    }
    ObtenerSucursales() {
        this.service.ObtenerSucursales().subscribe(data => {
            this.sucursales = data
        }, error => {
            Alertas.warning("",error);
        })
    }
    ObtenerTransaccionesTipos() {
        this.service.ObtenerTransaccionTipos().subscribe(data => {
            this.transaccionestipos = data
        }, error => {
            Alertas.warning("",error);
        })
    }
    AgregarProducto(){
        debugger;
        if (this.ValidarItemAgregar()){
            this.trasladoEnviarDetalle.activo = true;
            this.trasladoEnviarDetalles.push(this.trasladoEnviarDetalle);
            this.trasladoEnviarDetalle = new TransaccionInventarioRemotoDetalle();
        }
    }

    GuardarTransaccion(){
        debugger;
        if (this.esTraslado){
            this.trasladoEnviar.usuarioEnvia = Number(this.loginService.Usuario.id);
            this.trasladoEnviar.transaccionTipoId = TipoTransaccion.Traslado;
            this.trasladoEnviar.estadoId = EstadoTransaccion.Pendiente;
            this.trasladoEnviar.activo = true;
            this.trasladoEnviar.transaccionInventarioRemotoDetalles =  this.trasladoEnviarDetalles;
            this.service.IngresarTransaccion (this.trasladoEnviar).subscribe(data=>{
                Alertas.ok("Exito","");
                this.Limpiar();
            },error=>{
                Alertas.warning("Advertencia",error);
            });
        }
        if (!this.esTraslado){
            this.trasladoEnviar.usuarioRecibe = Number(this.loginService.Usuario.id);
            this.trasladoEnviar.transaccionTipoId = TipoTransaccion.Entrada;
            this.trasladoEnviar.estadoId = EstadoTransaccion.Recibido;
            this.trasladoEnviar.activo = true;
            
            this.trasladoEnviar.transaccionInventarioRemotoDetalles =  this.trasladoEnviarDetalles;
            this.service.IngresarTransaccion (this.trasladoEnviar).subscribe(data=>{
                Alertas.ok("Exito","");
                this.Limpiar();
            },error=>{
                Alertas.warning("Advertencia",error);
            });
        }
    }

    ObtenerProductoSeleccionado(data){
        if (data.value == ""){
            return;
        }
        this.cantidadProductoSeleccionado = this.productos.filter(x => x.productoId == data.value)[0].invActual;
    }
    ValidarItemAgregar (): boolean{
        debugger;
        if (this.trasladoEnviar.sucursalId == 0){
            Alertas.warning("Advertencia","Favor seleccione una sucursal de origen")
            return false
        }
        if (this.trasladoEnviar.sucursalDestinoId == 0){
            Alertas.warning("Advertencia","Favor seleccione una sucursal de destino")
            return false
        }
        if (this.trasladoEnviarDetalle.productoId == ""){
            Alertas.warning("Advertencia","Favor seleccione un producto")
            return false
        }
        if (this.trasladoEnviarDetalle.cantidad <= 0){
            Alertas.warning("Advertencia","Favor ingrese una cantidad valida")
            return false
        }
        if (this.trasladoEnviarDetalle.cantidad > this.cantidadProductoSeleccionado ){
            Alertas.warning("Advertencia","La cantidad ingresada se excede sobre el Inventario Actual ("+this.cantidadProductoSeleccionado+")");
            return false
        }
        
        return true;
    }


    MostrarDataTraslado(trasladoId){
        debugger;
        this.mostrarPopup = false;
        this.textoParaListadoDeProductos = "Listado de Productos a Recibir"
        this.esTraslado = false;
        var traslado = this.trasladosPendientes.filter(x=>x.id == trasladoId) as TransaccionInventarioRemotoDto[]
        if (traslado.length == 0)
        {
            Alertas.warning("Advertencia","Ocurrió un error inesperado al obtener la información del traslado a recibir");
        }
        this.trasladoEnviar.id = trasladoId
        this.trasladoEnviarDetalles = traslado[0].transaccionInventarioRemotoDetalles

        
    }

    Limpiar(){
        this.cantidadProductoSeleccionado = 0;
        this.trasladoEnviar = new TransaccionInventarioRemotoDto()
        this.trasladoEnviarDetalle = new TransaccionInventarioRemotoDetalle()
        this.trasladoEnviarDetalles = [];
        this.trasladosPendientes = [];
        this.esTraslado = true;

    }

}
