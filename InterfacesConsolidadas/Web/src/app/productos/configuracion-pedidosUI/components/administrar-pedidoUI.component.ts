import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginService } from '../../../login/services/login.service';
import { Alertas } from '../../../helpers/notificaciones/notificaciones';
import CustomStore from 'devextreme/data/custom_store';
import { isArray } from 'util';
import { DxDataGridComponent } from 'devextreme-angular';
import { MaestrosFarmaciaService } from '../../../maestros/maestros-farmacia.service';
import { ConfiguracionPedidoUIService } from '../services/configuracion-pedidosUI.service';
import { ConfiguracionPedidoUI } from '../models/configuracion-pedido.model';
import { ConfiguracionPedidoUIDetalle } from '../models/configuracion-pedido-detalle.model';
import { isNull, isNullEmptyOrWhiteSpace } from '../../administracion-alternativos/services/administracionProductosAlternativos.service';
import { DistribuidoresExternosService } from '../../../ecommerce/distribuidores-externos/distribuidores-externos.service';
import { TrasladarProductosService } from '../../../desarrollo-productos/Inventario-Productos/componentes/trasladar-productos/trasladar-productos.service';

@Component({
    selector: 'app-administrar-pedidoUI',
    templateUrl: './administrar-pedidoUI.component.html',
})

export class AdministrarPedidoUIComponent implements OnInit {
    sucursales: any[];
    configuraciones: any[];
    estaEditando = false;
    bloquearControl = false;
    configuracionesPorSucursal: ConfiguracionPedidoUI[];
    configuracionPorSucursal: ConfiguracionPedidoUI;
    configuracionesDetalleSucursal: any[];
    configuracionDetalleSucursal: ConfiguracionPedidoUIDetalle;
    productosUI = [];
    esParaTodasLasSucursales : boolean
    @ViewChild('gridListado') gridListado: DxDataGridComponent;
    constructor(private _configuracionPedidoUIService: ConfiguracionPedidoUIService, 
                private _maestrosService: MaestrosFarmaciaService,
        private _loginService: LoginService) {
        this.configuracionDetalleSucursal = new ConfiguracionPedidoUIDetalle();
        this.configuracionPorSucursal = new ConfiguracionPedidoUI();
        this.configuraciones = new Array<ConfiguracionPedidoUI>();
        this.configuracionesPorSucursal = new Array<ConfiguracionPedidoUI>();
        this.configuracionesDetalleSucursal = new Array<ConfiguracionPedidoUIDetalle>();
        this.esParaTodasLasSucursales = false;
        
    }

    ngOnInit() {
        this.ObtenerConfiguraciones();
        this.ObtenerSucursales();
        this.ObtenerProductosUI();
    }



    ObtenerConfiguraciones() {
        this._configuracionPedidoUIService.ObtenerConfiguracionesPedidosUI().subscribe(data => {
            this.configuraciones = data as ConfiguracionPedidoUI[];
        }, error => {
            Alertas.error("Advertencia", error._body);
        });
    }
    ObtenerSucursales() {
        this._maestrosService.ObtenerSucursales().subscribe(data => {
            this.sucursales = data as any[];
        }, error => {
            Alertas.error("Advertencia", error._body);
        });
    }
    BloquearControlSucursal(){
        if (this.esParaTodasLasSucursales){
            this.configuracionPorSucursal.SucursalId= 0;
            this.bloquearControl = true;
        }
        else{
            this.bloquearControl = false;
        }
    }
    ObtenerProductosUI() {
        this._configuracionPedidoUIService.ObtenerProductoUI().subscribe(data => {
            this.productosUI = data as any[];
        }, error => {
            Alertas.error("Advertencia", error._body);
        });
    }
    ObtenerConfiguracionPorSucursal() {
        this.configuracionesDetalleSucursal = [];
        let configuracionesDetalles = [];
        let configurations = this.configuraciones.filter(el => el.sucursalId == this.configuracionPorSucursal.SucursalId || el.sucursalId == 0);
        if (isNull(configurations)) {
            this.configuracionesDetalleSucursal = [];
            return;
        }

        for(var index:number = 0; index<configurations.length; index++){
            configuracionesDetalles.push(configurations[index].configuracionPedidoUIDetalle);
        }
        
        configuracionesDetalles.forEach(data=>{
            data.forEach(element => {
                this.configuracionesDetalleSucursal.push(element);
            });
        });

        this.configuracionesDetalleSucursal.forEach(data => {
                let dato = this.productosUI.filter(d => d.codigo == data.productoId);
                data.productoDescripcion = dato[0].descripcion;    
            
        })
    }
    Obtener(){
        this.ObtenerConfiguraciones();
        this.ObtenerConfiguracionPorSucursal();
    }
    Actualizar(data) {
        this.configuracionDetalleSucursal.Id = data.id;
        this.configuracionDetalleSucursal.ConfiguracionPedidoUIId = data.configuracionPedidoUIId
        this.configuracionDetalleSucursal.ProductoId = data.productoId;
        this.configuracionDetalleSucursal.TiempoDuracionProducto = data.tiempoDuracionProducto;
        this.configuracionDetalleSucursal.LimiteMaximoUnidades = data.limiteMaximoUnidades;
        this.configuracionDetalleSucursal.EsPedidoProductoObligatorio = data.esPedidoProductoObligatorio;
        this.configuracionDetalleSucursal.Activo = data.activo;
        this.estaEditando = true;
        this.Texto();

    }
    Desactivar(data) {
        this.configuracionPorSucursal.ConfiguracionPedidoUIDetalle = new Array<ConfiguracionPedidoUIDetalle>();
        this.configuracionDetalleSucursal = new ConfiguracionPedidoUIDetalle();
        this.configuracionDetalleSucursal.Id = data.id;
        this.configuracionDetalleSucursal.ConfiguracionPedidoUIId = data.configuracionPedidoUIId
        this.configuracionDetalleSucursal.Activo = false;
        this.configuracionPorSucursal.ConfiguracionPedidoUIDetalle.push(this.configuracionDetalleSucursal);
        this._configuracionPedidoUIService.DesactivarConfiguracion(this.configuracionPorSucursal).subscribe(data => {
            this.Limpiar();
            Alertas.ok();

        }, error => {
            Alertas.error("Advertencia", error._body);
        });

    }
    GuardarCambios(): void {
        this.configuracionPorSucursal.UsuarioId= this._loginService.Usuario.id;
        
        if (!this.ValidarConfiguración()) {
            return;
        }

        this.configuracionPorSucursal.ConfiguracionPedidoUIDetalle = new Array<ConfiguracionPedidoUIDetalle>();
        this.configuracionPorSucursal.ConfiguracionPedidoUIDetalle.push(this.configuracionDetalleSucursal);
        if (!this.estaEditando) {
            this._configuracionPedidoUIService.IngresarConfiguracion(this.configuracionPorSucursal).subscribe(data => {
                Alertas.ok();
                this.Limpiar();
                this.ObtenerConfiguraciones();
                this.ObtenerConfiguracionPorSucursal();

            }, error => {
                Alertas.error("Advertencia", error._body);
            });
        }
        else {
            this._configuracionPedidoUIService.ModificarConfiguracion(this.configuracionPorSucursal).subscribe(data => {
                Alertas.ok();
                this.Limpiar();
                this.ObtenerConfiguraciones();
                this.ObtenerConfiguracionPorSucursal();

            }, error => {
                Alertas.error("Advertencia", error._body);
            });
        }


    }


    ValidarConfiguración(): boolean {
        if (this.configuracionPorSucursal.SucursalId == 0 && this.esParaTodasLasSucursales == false) {
            Alertas.warning("Advertencia", "Favor elija una sucursal")
            return false;
        }
        if (this.estaEditando && this.configuracionDetalleSucursal.ConfiguracionPedidoUIId == 0) {
            Alertas.warning("Advertencia", "Favor seleccione una configuración")
            return false;

        }

        if (this.configuracionDetalleSucursal.LimiteMaximoUnidades == 0) {
            Alertas.warning("Advertencia", "Favor ingresar el limite maximo de unidades")
            return false;
        }

        if (isNullEmptyOrWhiteSpace(this.configuracionDetalleSucursal.ProductoId)) {
            Alertas.warning("Advertencia", "Favor elija un producto")
            return false;
        }
     
        return true;
    }
    getDisplayExpr(item) {
        if(!item) {
            return "";
        }

        return item.codigo + " " + item.descripcion;
    }
    Texto(): string {
        if (this.estaEditando) {
            return "Modificar";
        }
        else {
            return "Guardar";
        }
    }
    EditarInfo() {
        this.estaEditando = this.estaEditando == true ? false : true;
    }

    Limpiar(): void {
        this.estaEditando = false;
        this.configuraciones = new Array<ConfiguracionPedidoUI>();
        //this.configuracionPorSucursal = new ConfiguracionPedidoUI();
        this.configuracionDetalleSucursal = new ConfiguracionPedidoUIDetalle();
        this.configuracionesDetalleSucursal = [];
        this.configuracionPorSucursal.SucursalId = 0;
        this.esParaTodasLasSucursales = false;
    }
}
