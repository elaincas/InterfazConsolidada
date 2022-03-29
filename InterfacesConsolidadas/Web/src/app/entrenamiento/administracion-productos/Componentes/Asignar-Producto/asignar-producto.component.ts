import { Component, OnInit, ViewChild } from "@angular/core";
import { AsignarProductoService } from "./asignar-producto.service";
import { Producto, ProductoPrestamos } from "../../Clases/Producto";
import { Colaborador } from "../../Clases/Colaborador";
import { Alertas } from "../../helpers/notificaciones/notificacion";
import { LoginService } from "../../../../login/services/login.service";

@Component({
    selector: 'app-asignar-producto',
    templateUrl: './asignar-producto.component.html',
    styleUrls: ['./asignar-producto.component.css'],

})
export class AsignacionProductoComponent implements OnInit {
    esPopupParaAsignar: boolean;
    producto: Producto;
    productos: Producto[];
    productoPrestamo: ProductoPrestamos;
    _mostrarPopup: boolean = false;
    mostrardivEstado: boolean = false;
    colaborador: Colaborador;
    esDataColaboradorDespedidoSeleccionado: boolean
    ngOnInit(): void {
    }



    constructor(private service: AsignarProductoService, private loginService: LoginService) {
        this.producto = new Producto();
        this.productos = new Array<Producto>();
        this.colaborador = new Colaborador();
        this.productoPrestamo = new ProductoPrestamos();
        this.esDataColaboradorDespedidoSeleccionado = false
        this.ObtenerProductos();
        this.ObtenerColaboradores();
    }

    ObtenerProductos() {
        this.service.obtenerProductosConEstado().subscribe(data => {
            this.productos = data as Producto[];
        })
    }

    ObtenerInformacionColaborador() {
        debugger;
        this.service.obtenerInformacionColaborador(this.productoPrestamo.ColaboradorID, this.esDataColaboradorDespedidoSeleccionado).subscribe(data => {
            this.ObtenerColaboradores();
            this.productoPrestamo.NombreColaborador = data.nombreColaborador;
            this.productoPrestamo.Cantidad = data.cantidad;
            this.productoPrestamo.ProductoID = data.productoID;
            this.productoPrestamo.Observacion = data.Observacion;
            if (this.productoPrestamo.ProductoID != 0) {
                this.productoPrestamo.Estado = data.estado;
                this.mostrardivEstado = true;
            }
            else
                this.mostrardivEstado = false;

        }, error => {
            this.LimpiarControles();
        })
    }

    AsignarInformacion(estado) {
        this.productoPrestamo.UsuarioId = this.loginService.Usuario.id;
        this.productoPrestamo.EstadoID = estado;
        if (this.ValidarDatos()) {
            this.service.AsignarInformacion(this.productoPrestamo).subscribe(data => {
                Alertas.ok();
                this.LimpiarControles();

            }, error => {
                Alertas.error("", error._body);
            });
        }
    }

    RecuperarProducto(estado) {
        this.productoPrestamo.UsuarioId = this.loginService.Usuario.id;
        this.productoPrestamo.EstadoID = estado;
        if (this.ValidarDatos()) {
            debugger;
            this.service.RecuperarProducto(this.productoPrestamo, this.esDataColaboradorDespedidoSeleccionado).subscribe(data => {
                Alertas.ok();
                this.LimpiarControles();
            }, error => {
                this.LimpiarControles();
                Alertas.error("", error._body);
            });
        }
    }
    informacionProducto: any={descripcion:"",unidadesNuevas:0,recurperadas:0};
    
    MostarPopup(boton) {
        this.service.Obternerproductounidadesdisponible(this.productoPrestamo.ProductoID.toString(),this.loginService.Usuario.id.toString()).subscribe(d => {
            this.informacionProducto = d;      
            if (boton == 1) {
                this.esPopupParaAsignar = true;
            }
            else {
                this.esPopupParaAsignar = false;
    
            }
            this._mostrarPopup = true;

            });
    }
    ValidarDatos(): Boolean {
        if (this.productoPrestamo.ProductoID == 0) {
            Alertas.warning("", "Ingrese un producto");
            return false;
        }
        if (this.productoPrestamo.Cantidad == 0) {
            Alertas.warning("", "Ingrese un cantidad");
            return false;
        }
        
        return true;
    }
    LimpiarControles() {
        this.productoPrestamo = new ProductoPrestamos();
        this.mostrardivEstado = false;
    }

    ObtenerColaboradores() {
        if (this.esDataColaboradorDespedidoSeleccionado == false || this.esDataColaboradorDespedidoSeleccionado == undefined) {
            this.service.ObtenerColaboradores().subscribe(data => {
                debugger;
                this.colaborador.listaColaboradores = data.listaColaboradores as Colaborador[];

            }, error => {
                this.LimpiarControles();
            })
        }
        else if (this.esDataColaboradorDespedidoSeleccionado == true) {
            this.service.ObtenerColaboradoresDespedidos().subscribe(data => {
                debugger;
                this.colaborador.listaColaboradores = data.listaColaboradores as Colaborador[];

            }, error => {
                this.LimpiarControles();
            })
        }
    }
}  
