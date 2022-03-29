import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../login/services/login.service';
import { Producto, ProductoPrestamos, ProductoTraslado } from '../../Clases/Producto';
import { Zonas, ZonaEncargado } from '../../Clases/Zonas';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { _appIdRandomProviderFactory } from '../../../../../../node_modules/@angular/core/src/application_tokens';
import { Productos } from '../../../../desarrollo-productos/Inventario-Productos/_Clases/Productos';
import { TrasladoService } from './traslados.service';
import { Traslados, TrasladosDetalle } from '../../Clases/Traslados';
import { Notificaciones } from '../../../../desarrollo-productos/Inventario-Productos/helpers/notificaciones/notificacion';
import { isUndefined } from 'util';
import { TrasladoProductoInventarioRemotoComponent } from '../../../../inventarios-remotos/inventarios/components/traslados-productos/traslados-productos.component';
import { throttleTime } from 'rxjs/operator/throttleTime';

declare var $: any;
@Component({
    selector: 'app-ingreso-producto',
    templateUrl: './traslados.component.html',

})
export class TrasladosComponent implements OnInit {

    zonas: Array<Zonas>
    zonasTraslado: Array<Zonas>
    producto: Producto
    productos: Array<any>
    colaboradorID: number;
    traslado: Traslados;
    trasladoDetalle: TrasladosDetalle;
    trasladoAMandar = new Array<any>();

    productosAtrasladar: ProductoTraslado[];
    productoSeleccionado: ProductoTraslado;
    constructor(private login: LoginService, private trasladoService: TrasladoService) {
        this.zonas = new Array<Zonas>();
        this.zonasTraslado = new Array<Zonas>();
        this.producto = new Producto();
        this.traslado = new Traslados();
        this.trasladoDetalle = new TrasladosDetalle();
        this.traslado.UsuarioID = this.login.Usuario.id;
        this.productoSeleccionado = new ProductoTraslado();
        this.productosAtrasladar = [];
        this.ObtenerZonas();
        this.ObtenerProducto();
    }

    ngOnInit() {
    }

    ObtenerProducto() {
        this.trasladoService.obtenerTodosLosProductos().subscribe(data => {
            this.productos = data;
        }, error => {
            this.LimpiarControles();
            this.trasladoService.obtenerTodosLosProductos().subscribe(data => {
                this.productos = data;
            });
        })
    }

    AgregarProductosAlista(){
        if (this.productoSeleccionado.Cantidad <= 0){
            Notificaciones.error("Cantidad inválida. Verifica que ésta sea mayor a 0");
            return;
        }
        debugger;
        if (this.ExisteProducto(this.productoSeleccionado))
        {
            this.SumarCantidadAproducto(this.productoSeleccionado);
            return;
        }
        let prod = this.productos.find( p => p.productoID == this.productoSeleccionado.productoID);
        this.productoSeleccionado.NombreProducto = prod.nombreProducto;
        this.productoSeleccionado.productoID = prod.productoID;
        
        this.productosAtrasladar.push(this.productoSeleccionado);
        var trasladar = new Traslados();
        trasladar.Activo = true;
        trasladar.Cantidad = this.productoSeleccionado.Cantidad;
        trasladar.UsuarioID = this.login.Usuario.id;
        trasladar.ZonaIDEnvia = Number(this.traslado.ZonaIDEnvia)
        trasladar.ZonaIDRecibe = Number(this.traslado.ZonaIDRecibe)
        trasladar.ProductoID = this.productoSeleccionado.productoID
        this.trasladoAMandar.push (trasladar);
        
        this.productoSeleccionado = new ProductoTraslado();
    }

    EliminarProductoDeLista(producto){
        var index = this.productosAtrasladar.indexOf(producto);
        this.productosAtrasladar.splice(index,1);
        this.trasladoAMandar.splice(index,1);
    }

    ExisteProducto(producto): boolean {
        var existeProducto = this.productosAtrasladar.find( p=>p.productoID == producto.productoID);
        if (isUndefined(existeProducto)) {
            return false;
        }
        return true;
    }

    SumarCantidadAproducto(producto){
        debugger
        var productoSumar = this.productosAtrasladar.find(p=>p.productoID == producto.productoID);
        var index = this.productosAtrasladar.indexOf(productoSumar);
        this.productosAtrasladar[index].Cantidad += producto.Cantidad;
        this.trasladoAMandar[index].Cantidad += producto.Cantidad;
    }

    GuardarInformacion() {
        debugger
        this.traslado.ProductosTraslado = this.trasladoAMandar;
        this.traslado.ZonaIDEnvia = Number(this.traslado.ZonaIDEnvia)
        this.traslado.ZonaIDRecibe = Number(this.traslado.ZonaIDRecibe)
        this.traslado.UsuarioID = this.login.Usuario.id;
        
        if (this.ValidarDatos()) {
            debugger
            this.trasladoService.IngresarTraslado(this.trasladoAMandar).subscribe(data => {
                Alertas.ok("", "Éxito");
                this.LimpiarControles();
                this.ObtenerZonas();
            }, error => {
                Alertas.error("", error._body);
            });
        }
    }

    ValidarDatos(): Boolean {
        if (this.traslado.ZonaIDEnvia == 0) {
            Alertas.warning("", "La zona que envía es inválida..")
            return false;
        } 
        if (this.traslado.ZonaIDRecibe == 0) {
            Alertas.warning("", "La zona que recibirá es inválida.")
            return false;
        }
        if (this.traslado.ProductosTraslado.length == 0) {
            Alertas.warning("", "Productos inválidos.")
            return false;
        }
        if (this.traslado.Cantidad == 0) {
            Alertas.warning("", "Cantidad del producto es inválida.")
            return false;
        }
        return true;
    }

    LimpiarControles() {
        this.producto = new Producto();
        this.traslado = new Traslados();
        this.productosAtrasladar = [];
        this.trasladoAMandar = [];
    }

    ObtenerZonas() {
        this.trasladoService.ObtenerZonas().subscribe(data => {
            this.zonas = data;
        });
        this.trasladoService.ObtenerZonasUsuario(this.login.Usuario.id).subscribe(data => {
            this.zonasTraslado = data;
            if (this.zonas.length == 0){
                this.zonas = data;
            }
        });
    }
}
