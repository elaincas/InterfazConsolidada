import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../login/services/login.service';
import { ProductoEntrenamientoService } from './ingresar-producto.service';
import { Producto } from '../../Clases/Producto';
import { Zonas } from '../../Clases/Zonas';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { Productos } from '../../../../desarrollo-productos/Inventario-Productos/_Clases/Productos';
import { _appIdRandomProviderFactory } from '../../../../../../node_modules/@angular/core/src/application_tokens';

declare var $: any;
@Component({
  selector: 'app-ingreso-producto',
  templateUrl: './ingresar-producto.component.html',
  styleUrls: ['./ingresar-producto.component.css'],

})
export class ProductoEntrenamientoComponent implements OnInit {

  producto: Producto;
  productosData: Array<any>;
  productos: Array<String>;
  zonas: Array<Zonas>
  estadoInventario: boolean = false;
  constructor(private login: LoginService, private productoService: ProductoEntrenamientoService) {
    this.producto = new Producto();
    this.productosData = new Array<Producto>();
    this.zonas = new Array<Zonas>();
    this.productos = new Array<string>();
    this.ObtenerProductos();
    this.ObtenerZonas();
  }

  ngOnInit() {

  }
  ObtenerProductos() {
    this.productoService.obtenerTodosLosProductos().subscribe(data => {
      this.productosData = data;
      this.productosData.forEach(element => {
        this.productos.push(element.nombreProducto);
      });
      ;
    })
  }
  GuardarInformacion() {
    if (this.ValidarDatos()) {
      this.producto.UsuarioId = this.login.Usuario.id;
      if (this.estadoInventario == true) {
        this.producto.EstadoID = 1;
      }
      else {
        this.producto.EstadoID = 2;
      }
      this.productoService.agregarProducto(this.producto).subscribe(data => {
        Alertas.ok("", "Éxito");
        this.LimpiarControles();
        this.ObtenerProductos();
      }, error => {
        Alertas.error("", error._body);
      });
    }
  }
  ValidarDatos(): Boolean {
    if (this.producto.NombreProducto == "") {
      Alertas.warning("", "Nombre producto inválido.")
      return false;
    } if (this.producto.Cantidad <= 0) {
      Alertas.warning("", "La cantidad es inválida.")
      return false;
    }
    if (this.producto.Precio <= 0) {
      Alertas.warning("", "El precio es inválido.")
      return false;
    }
    return true;
  }
  LimpiarControles() {
    this.producto = new Producto();
    this.productos = new Array<String>();
  }
  ObtenerZonas() {
    this.productoService.ObtenerZonas(this.login.Usuario.id).subscribe(data => {
      this.zonas = data;
    });
  }
}
