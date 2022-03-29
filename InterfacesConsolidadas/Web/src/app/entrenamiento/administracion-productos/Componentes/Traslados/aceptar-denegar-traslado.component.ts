import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../login/services/login.service';
import { Producto, ProductoPrestamos } from '../../Clases/Producto';
import { Zonas, ZonaEncargado } from '../../Clases/Zonas';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { _appIdRandomProviderFactory } from '../../../../../../node_modules/@angular/core/src/application_tokens';
import { Productos } from '../../../../desarrollo-productos/Inventario-Productos/_Clases/Productos';
import { TrasladoService } from './traslados.service';
import { Traslados, TrasladosDetalle } from '../../Clases/Traslados';
import { AceptarDenegarTrasladoService } from './aceptar-denegar-traslado.service';
import { isUndefined } from 'util';
import { Notificaciones } from '../../../../desarrollo-productos/Planimetrias/helpers/notificaciones/notificacion';

declare var $: any;
@Component({
    selector: 'app-ingreso-producto',
    templateUrl: './aceptar-denegar-traslado.component.html',

})
export class AceptarDenegarTrasladoComponent implements OnInit {

    zonas: Array<Zonas>
    producto: Producto
    productos: Array<Productos>
    colaboradorID: number;
    traslado: Traslados;
    traslados : Array<Traslados>;
    trasladoDetalle: TrasladosDetalle;
    constructor(private login: LoginService, private trasladoService: AceptarDenegarTrasladoService) {
        this.zonas = new Array<Zonas>();
        this.productos = new Array<Productos>();
        this.producto = new Producto();
        this.traslado = new Traslados();
        this.trasladoDetalle = new TrasladosDetalle();
        this.traslados = new Array<Traslados>();
        this.traslado.UsuarioID = this.login.Usuario.id;
        this.ObtenerTrasladosPorUsuario();
        this.ObtenerZonas();
        this.ObtenerProductos();
    }

    ngOnInit() {

    }

    ObtenerTrasladosPorUsuario(){
        this.trasladoService.ObtenerTrasladosPorUsuario(this.login.Usuario.id).subscribe(data => {
            this.traslados = data;
        }, error => {
            
            this.LimpiarControles();
        })
    }
    Aprobar(data){
        Alertas.question("","¿Está seguro que desea Aprobar el Traslado No. " + data.trasladoId + "?")
            .then( r => {
                if (this.EsValidoTrasladoSeleccionado(data) == false) {
                    return;
                }
                data.EstadoID = 8;//Aceptado
                this.trasladoService.AceptarDenegarReembolso(data).subscribe(data=>{
                        this.ObtenerTrasladosPorUsuario();
                        Alertas.ok("","Éxito");
                },error=>{
                    Alertas.error("", error._body);
                })
            });
    }

    Denegar(data){
        Alertas.question("","¿Está seguro que desea Denegar el Traslado No. " + data.trasladoId + "?")
            .then( r => {
                if (this.EsValidoTrasladoSeleccionado(data) == false)  {
                    return;
                }
                data.EstadoID = 9;//Denegado
                this.trasladoService.AceptarDenegarReembolso(data).subscribe(data=>{
                    this.ObtenerTrasladosPorUsuario();
                    Alertas.ok("","Éxito");
                },error=>{
                    Alertas.error("", error._body);
                })
            });
    }

    EsValidoTrasladoSeleccionado(trasladoSeleccionado):boolean {
        if (this.traslados.length <= 0) {
            Notificaciones.error("No existen traslados a aprobar");
            return false;
        }
        if (isUndefined(trasladoSeleccionado)) {
            Notificaciones.error("Seleccione un Traslado");
            return false;
        }
        return true;
    }

    LimpiarControles() {
        this.producto = new Producto();
        this.traslado = new Traslados();
    }
    ObtenerZonas() {
        this.trasladoService.ObtenerZonas(this.login.Usuario.id).subscribe(data => {
            this.zonas = data;
        });
    }
    ObtenerProductos() {
        this.trasladoService.obtenerTodosLosProductos().subscribe(data => {
          this.productos = data;
        })
      }
}
