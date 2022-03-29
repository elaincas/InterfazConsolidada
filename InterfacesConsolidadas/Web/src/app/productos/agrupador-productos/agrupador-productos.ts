import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ProductosGraphServiceService } from './services/productos-graph-service.service';
import dataSource from 'devextreme/data/data_source';
import customStorage from 'devextreme/data/custom_store';
import customStorareOptions from 'devextreme/data/custom_store';
import { helpers } from '../../helpers/utils';
import { Notificaciones } from '../../helpers/notificaciones/notificaciones';
import { IProducto } from './models/producto.model';
import { AgrupadorProductosModalComponent } from './agrupador-productos-modal/agrupador-productos-modal.component';

declare var $: any;
@Component({
  selector: 'app-agrupador-productos',
  templateUrl: './agrupador-productos.html',
  styles: [`
    .lookup-productos-container{
      width: calc(100% - 90px);
    }
    #label_productos{
      display: block;
    }

    #btn_buscarProductos {
      margin-top: 0px;
      margin-bottom: 0px;
      padding-top: 10px;
      padding-bottom: 10px;
    }
  `]
})
export class AgrupadorProductosComponent implements OnInit {
  @Input() productos = [];
  @Input() buscadorModo: string = "combobox";
  @Output() alEliminarUnProducto = new EventEmitter<ICustomEventAsync<IProducto>>();
  @Output() alAgregarUnProducto = new EventEmitter<IProducto>();
  @Output() antesDeAgregarUnProducto = new EventEmitter<ICustomEventAsync<IProducto>>();
  @Output() alSeleccionarUnProducto = new EventEmitter<any>();

  @ViewChild("agrupadorProductosModal")
  public agrupadorProductosModal: AgrupadorProductosModalComponent

  dataSource: dataSource;
  comboProductos = { value: null };
  modalBuscarProductos = {
    visible: false
  };

  constructor(private productosGraphService: ProductosGraphServiceService) {
    this.configurarDataSource();
  }


  configurarDataSource() {
    let custom = new customStorage({
      load: this.buscarProductos.bind(this),
      byKey: (key: any) => new Promise<any>((resolve, reject) => {
        resolve();
      }),
    });

    this.dataSource = new dataSource({
      store: custom
    });
  }


  buscarProductos(options: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const textoBusqueda = this.dataSource.searchValue();
      this.productosGraphService.buscarProductos(textoBusqueda)
        .then(data => resolve(data));
    });
  }

  ngOnInit() {
    if (this.productos === undefined) {
      this.productos = [];
    }
  }

  emmitAlSeleccionarUnProducto(evento: any) {
    this.alSeleccionarUnProducto.emit(evento);
  }

  agregarProductosDesdeModal(productosModal: IProducto[]): void {
    productosModal.forEach(producto => {
      let existeProducto = this.productos.find(prod => prod.id == producto.id) != null;
      if (!existeProducto) {
        this.productos.push(producto);
      }
    });

    this.modalBuscarProductos.visible = false;
  }

  public limpiar() {
    this.limpiarProductos();
    this.comboProductos.value = null;
  }

  public limpiarProductos() {
    this.productos.length = 0;
  }

  onValueChanged(evento: any) {
    console.log(evento);
  }

  grupoProductosRemoverElemento(producto: IProducto): void {
    const index = this.productos.indexOf(producto);
    if (index === -1) {
      return;
    }
    this.productos.splice(index, 1);
  }

  grupoProductosAgregarElemento(producto: IProducto): void {

    if (producto === null) {
      return;
    }

    if (this.esProductoAgregado(producto.id)) {
      return;
    }

    this.productos.push(producto);
    this.alAgregarUnProducto.emit(producto);
    Notificaciones.success("Producto agregado");
  }

  esProductoAgregado(productoId: string) {
    const index = this.productos.findIndex(prod => prod.id === productoId);
    return index != -1;
  }

  emitAgregarProducto(producto: IProducto) {
    if (producto == null) {
      return;
    }

    if (this.esProductoAgregado(producto.id)) {
      Notificaciones.error("El producto ya se encuentra agregado");
      return;
    }

    let event = new CustomEventAsync(producto);
    this.antesDeAgregarUnProducto.emit(event);

    if (helpers.isNull(event.promise)) {
      this.grupoProductosAgregarElemento(producto);
      return;
    }

    event.promise.then(x => {
      this.grupoProductosAgregarElemento(producto);
    });
  }

  emitEliminarProducto(producto: IProducto) {

    let event = new CustomEventAsync(producto);
    this.alEliminarUnProducto.emit(event);

    if (helpers.isNull(event.promise)) {
      this.grupoProductosRemoverElemento(producto);
      return;
    }

    event.promise.then(x => {
      this.grupoProductosRemoverElemento(producto);
    });
  }
}

export interface ICustomEventAsync<T> {
  promise: Promise<T>;
  value: T;
}

export class CustomEventAsync<T> implements ICustomEventAsync<T> {
  promise: Promise<T>;
  value: T;

  constructor(value: T) {
    this.value = value;
  }
}
