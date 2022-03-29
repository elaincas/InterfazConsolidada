import { Component, OnInit } from '@angular/core';
import { TipoProductosEnlace } from '../models/tipoproductoenlace.model';
import { ProductoEnlace } from '../models/productoenlace.model';
import { EnlaceProductosService } from '../enlace-productos-service.service';
import { Producto } from '../../../ecommerce/productos-de-carrusel/models/Producto';
import { LoginService } from '../../../login/services/login.service';
import { Alertas } from '../../../helpers/notificaciones/notificaciones';

@Component({
  selector: 'app-bandeos',
  templateUrl: './bandeos.component.html',
  styleUrls: ['./bandeos.component.css']
})
export class BandeosComponent implements OnInit {
  productos: Producto[];
  tipoProductosEnlace: TipoProductosEnlace[];
  productosEnlazados: ProductoEnlace[];
  productoEnlace: ProductoEnlace;
  productoEnlazado: ProductoEnlace;
  constructor(private _enlaceProductoService: EnlaceProductosService, private _loginService: LoginService) {
    this.productoEnlace = new ProductoEnlace();
    this.productos = new Array<Producto>();
    this.tipoProductosEnlace = new Array<TipoProductosEnlace>();
    this.productosEnlazados = new Array<ProductoEnlace>();
    this.productoEnlazado = new ProductoEnlace();
  }

  ngOnInit() {
    this.ObtenerProductos();
    this.ObtenerTipoProductosEnlaces();
  }
  ObtenerProductos() {
    debugger;
    this._enlaceProductoService.ObtenerProductos().subscribe(data => {
      debugger;
      this.productos = data as any[];
    })
  }
  ObtenerProductoEnlazados() {
    let productoID = this.productoEnlace.productoIdCompra;
    this._enlaceProductoService.obtenerProductoEnlazadosPorProductoId(productoID).subscribe(data => {
      this.productosEnlazados = data as any[];
    })
  }
  ObtenerTipoProductosEnlaces() {
    this._enlaceProductoService.ObtenerTipoEnlaceProductos().subscribe(data => {
      this.tipoProductosEnlace = data as any[];
    });
  }

  BandearProducto() {
    this.productoEnlace.usuarioId = this._loginService.Usuario.id
    this._enlaceProductoService.enlazarProducto(this.productoEnlace).subscribe(data => {
      Alertas.ok("Exito");
      this.Limpiar();
    },error=>{
      console.log(error);
      Alertas.error();
    })
  }

  EliminarProductoEnlazado(data){
    debugger;
    this.productoEnlazado = data;
    this.productoEnlazado.usuarioId = this._loginService.Usuario.id;
    this._enlaceProductoService.ELiminarEnlaceProducto(this.productoEnlazado).subscribe(data=>{
      Alertas.ok();
      this.Limpiar();
    })
  }
  Limpiar() {
    this.productoEnlace = new ProductoEnlace();
    this.productosEnlazados = new Array<ProductoEnlace>();
    this.productoEnlazado = new ProductoEnlace();
  }
}
