import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TablaAgregarProductosService } from './tabla-agregar-productos.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Productos } from '../../_Clases/Productos';
import { InventarioProductosUbicacion } from '../../_Clases/InventarioProductosUbicacion';
import { isUndefined } from "util";
import { Observable } from "rxjs/Observable";
import { empty } from 'rxjs/observable/empty';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import customStorage from 'devextreme/data/custom_store';
import dataSource from 'devextreme/data/data_source';
import { InventarioProductosImpulsadoService } from '../../services/inventario-service.service';
@Component({
  selector: 'app-tabla-agregar-productos',
  templateUrl: './tabla-agregar-productos.component.html',
  providers: [TablaAgregarProductosService],
  styleUrls: ['./tabla-agregar-producto.component.css']
})

export class TablaAgregarProductosComponent {
  @Input() nombre: string;
  @Output() onIngresar = new EventEmitter<boolean>();
  dataSourceProductos: dataSource;


  constructor(private formBuilder: FormBuilder ,private serviceInventarioProductoImpulsados: InventarioProductosImpulsadoService,
    private service: TablaAgregarProductosService) {

    this.listaProductos = [];
    this.producto = [''];
    this.fechaActual = new Date();
    this.SucursalDesarrolloProductosId = 1001;
    this.producto = new Productos();
    this.configurarDataSource();
  }

  // **** Variables ****
  // Formularios
  formInventarioProductos=this.formBuilder.group({
    CodigoProducto: new FormControl(''),
    Cantidad: new FormControl(0),
    Precio: new FormControl(0.00),
    Costo: new FormControl(0.00),
    Descripcion: new FormControl(''),
    FechaVence: new FormControl(new Date())
  });

  // Control
  mensajeRespuesta;
  mensajeValidacion;
  listaDeProductosVacia = true;
  fechaActual: Date;
  SucursalDesarrolloProductosId: number;

  // Listas
  listaProductos: any[];
  listaProductosIngresar: InventarioProductosUbicacion[];
  producto: any;
  productoImpulsado: Observable<Productos>;
  ingresar(ingreso: boolean) {

    this.onIngresar.emit(ingreso);
  }

  obtenerProductoDeImpulsadosPorIdLookup(data) {
    this.producto = [''];
    this.mensajeValidacion = '';
    if (data.value=="")
    {return}
    this.BuscarProductoId(data.value);
  }



  BuscarProductoId(valor){
    this.productoImpulsado = this.service.ObtenerProductoImpulsadoPorId(valor);
    this.productoImpulsado.subscribe(x => {
      if (x == null) {
        Alertas.warning("Advertencia", 'El producto no existe o no está Activo');
        this.limpiarFormularioProductos();
        return;
      }
      this.formInventarioProductos.controls['CodigoProducto'].setValue(x.ProductoId);
      this.formInventarioProductos.controls['Descripcion'].setValue(x.NombreProducto);
      this.formInventarioProductos.controls['Costo'].setValue(x.UltimoCosto);
      this.formInventarioProductos.controls['Precio'].setValue(x.UltimoPrecio);
      this.producto = this.producto.map(
        producto => Object.assign({
          ProductoId: x.ProductoId,
          NombreProducto: x.NombreProducto
        }, producto));
        this.producto.NombreProducto = x.NombreProducto;
    });
  }


  agregarProducto() {
    if (this.validarControlesDeFormularioProducto() === false) {
      return;
    }
    this.mensajeValidacion = '';
    this.listaProductos.push(this.producto[0]);

    this.listaProductos = this.listaProductos.map(
      lista => Object.assign({
        InventarioInicial: this.formInventarioProductos.get('Cantidad').value,
        Precio: this.formInventarioProductos.get('Precio').value,
        Costo: this.formInventarioProductos.get('Costo').value,
        FechaVence: this.formInventarioProductos.get('FechaVence').value,
      }, lista)
    );
    this.listaProductosIngresar = this.listaProductos.map(
      lista => Object.assign({
        Precio: this.formInventarioProductos.get('Precio').value,
        Costo: this.formInventarioProductos.get('Costo').value,
        InventarioInicial: this.formInventarioProductos.get('Cantidad').value,
        Vence: this.formInventarioProductos.get('FechaVence').value,
        InventarioActual: this.formInventarioProductos.get('Cantidad').value,
        SucursalId: this.SucursalDesarrolloProductosId,
        TipoTransaccion: 1
      }, lista)
    );

    this.listaDeProductosVacia = false;
    console.log(this.listaProductosIngresar)
    this.limpiarFormularioProductos();
  }

  validarControlesDeFormularioProducto(): boolean {

    let precio = this.formInventarioProductos.controls['Precio'].value;
    let costo = this.formInventarioProductos.controls['Costo'].value;

    if (this.formInventarioProductos.controls['CodigoProducto'].value === '') {
      Alertas.warning("Advertencia", 'Ingrese un Producto');
      return false;
    }
    if (this.formInventarioProductos.controls['Cantidad'].value === 0) {
      Alertas.warning("Advertencia", 'Ingrese la Cantidad de Productos');
      return false;
    }
    if (precio === 0) {
      Alertas.warning("Advertencia", 'El Precio del producto no puede ser 0');
      return false;
    }
    if (costo === 0) {
      Alertas.warning("Advertencia", "El Costo del producto no puede ser 0");
      return false;
    }
    if (costo > precio) {
      Alertas.warning("Advertencia", "El costo del producto no puede ser mayor al precio del producto");
      return false;
    }
    if (this.formInventarioProductos.controls['FechaVence'].value === '') {
      Alertas.warning("Advertencia", 'Ingrese la Fecha de Vencimiento del Producto');
      return false;
    }
    return true;
  }
  limpiarFormularioProductos() {
    this.formInventarioProductos = this.formBuilder.group({
      CodigoProducto: new FormControl(''),
      Cantidad: new FormControl(0),
      Precio: new FormControl(0.00),
      Costo: new FormControl(0.00),
      Descripcion: new FormControl(''),
      FechaVence: new FormControl(new Date())
    });
    this.producto = [''];
  }

  eliminarProductoDeLaLista(producto: any) {
    const indiceProducto = this.listaProductos.indexOf(producto);
    this.listaProductos.splice(indiceProducto, 1);
    if (this.listaProductos.length <= 0) {
      this.listaDeProductosVacia = true;
    }
  }

  configurarDataSource() {

    const customp = new customStorage({
      load: this.buscarProductos.bind(this),
      byKey: (key: any) => new Promise<any>((resolve, reject) => {
        resolve();
      }),
    });

    this.dataSourceProductos = new dataSource({
      store: customp
    });
  }
  buscarProductos(options: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const textoBusqueda = this.dataSourceProductos.searchValue();



      this.serviceInventarioProductoImpulsados.ObtenerProductos( this.dataSourceProductos.pageIndex().toString(), this.dataSourceProductos.pageSize().toString(),textoBusqueda)
        .then(data => resolve(data));
    });
  }
  ObtenerProductoId(data){

  }
}
