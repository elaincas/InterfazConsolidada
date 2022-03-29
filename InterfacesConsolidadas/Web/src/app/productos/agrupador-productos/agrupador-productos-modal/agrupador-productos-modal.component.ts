import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { IProducto } from '../models/producto.model';
import { ProductosGraphServiceService } from '../services/productos-graph-service.service';
import { DxTextBoxComponent } from 'devextreme-angular';

@Component({
  selector: 'app-agrupador-productos-modal',
  templateUrl: './agrupador-productos-modal.component.html',
  styleUrls: ['./agrupador-productos-modal.component.css']
})
export class AgrupadorProductosModalComponent implements OnInit {
  @Input() visible: boolean;
  @Output() onAgregar = new EventEmitter<IProducto[]>();
  @Output() onCancelar = new EventEmitter();
  @Output() alSeleccionarUnProducto = new EventEmitter<any>();

  @ViewChild('txtDescripcion')
  txtDescripcion: DxTextBoxComponent;
  loadingVisible = false;
  dataSource = [];
  seleccionarTodos = false;
  constructor(private productosGraphService: ProductosGraphServiceService) { }
  ngOnInit() {
  }

  onTxtDescripcionKeyPress(evento: any) {
    console.log(evento);
  }

  buscar(descripcion: string) {
    console.log(descripcion);
    this.loadingVisible = true;
    this.dataSource = [];
    this.productosGraphService.buscarProductos(descripcion, 1000, false).then((data) => {
      this.dataSource = data;
      this.seleccionarTodos = true;
      this.seleccionarTodosLosProductos();
      this.loadingVisible = false;
    });
  }

  public limpiar() {
    this.dataSource = [];
    this.loadingVisible = false;
    this.txtDescripcion.value = '';
  }


  onValueChanged(producto: IProducto) {
    if (!producto.esSeleccionado) {
      return;
    }
    this.alSeleccionarUnProducto.emit({
      producto: producto,
      productos: this.dataSource
    });
  }

  agregar(productos: IProducto[]) {
    let productosSeleccionados = productos.filter(p => p.esSeleccionado);
    console.log(productosSeleccionados);
    this.onAgregar.emit(productosSeleccionados);
    this.limpiar();
  }

  cancelar() {
    this.limpiar();
    this.onCancelar.emit();
  }

  showLoadPanel() {
    this.dataSource = [];
    this.loadingVisible = true;
  }

  seleccionarTodosLosProductos() {
    this.dataSource.forEach( p => {
      p.esSeleccionado = this.seleccionarTodos;
    });
  }

}
