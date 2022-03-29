import { ProductoService } from './../producto.service';
import { Component, OnInit, ViewChild, AfterContentInit, Input, Output, EventEmitter } from '@angular/core';
import { DxDataGridComponent, DxDropDownBoxComponent, DxCheckBoxComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { helpers } from '../../helpers/utils';
import { isArray } from 'util';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent implements OnInit, AfterContentInit {
  @ViewChild('gridProductos') productosDataGrid: DxDataGridComponent;
  @ViewChild('dropdownProducto') private _dropdownProducto: DxDropDownBoxComponent;
  private checkSeleccioanar: any;
  @Input() addPreviousProducts: EventEmitter<any> = new EventEmitter();
  @Output() onAddProducto: EventEmitter<any> = new EventEmitter();
  @Output() onDeleteProducto: EventEmitter<any> = new EventEmitter();
  @Output() productosAgregados: any[] = [];
  @Input() limpiarControles: EventEmitter<any> = new EventEmitter();
  gridBoxValue: string[];
  dataSource: any = {};
  _productosSeleccionados: string[];
  productosAagregar: any[];
  constructor(private _productoService: ProductoService) { }


  ngAfterContentInit(): void {
    this.addPreviousProducts.subscribe(data => {
      if (data.length > 0) {
        data.forEach(producto => {
          this.productosAgregados.push(producto);
        });
      }
    });

    this.limpiarControles.subscribe(data => {
      this.limpiar()
    });
  }

  ngOnInit() {
    this.inicializarDataSource();
  }

  limpiar(): void {
    this.productosAgregados = [];
    this.productosAagregar = [];
    this._productosSeleccionados = [];
    this.limpiarBusqueda();
  }

  set productosSeleccionadosChange(value: any[]) {
    this._productosSeleccionados = value.map(v => v.productoId) || [];
    this.productosAagregar = value || [];
  }

  set productosSeleccionados(value: string[]) {
    this._productosSeleccionados = value || [];
    if (!value)
      this.productosDataGrid.instance.deselectAll();
  }
  get productosSeleccionados(): string[] {
    return this._productosSeleccionados;
  }

  inicializarDataSource(): void {
    const buscadorService = this;
    this.dataSource.store = new CustomStore({
      load: (loadOptions: any) => {
        let texto = '';
        if (isArray(loadOptions.filter)) {
          texto = loadOptions.filter[0][2];
        }

        if (texto.length < 3) {
          let data: any
          return data;
        }

        return buscadorService
          ._productoService.Buscador(texto)
          .toPromise()
          .then(data => {
            return {
              data: data,
              totalCount: data.length
            };
          }).catch(error => {
            console.log(error);
          });
      },
      byKey: function (e: any) {

        return buscadorService
          ._productoService.Buscador(e.productoId)
          .toPromise()
          .then(data => {
            return {
              data: data,
              totalCount: data.length
            };
          });
      }
    });
  }

  onInitialized(e: any): void {
    e.component.registerKeyHandler('enter', function (event) {
      e.component.open();
    });

    e.component.registerKeyHandler('space', function (event) {
      e.component.open();
    });
  }

  onEditorPreparing(e): void {
    if (e.parentType === 'searchPanel') {
      e.editorOptions.onKeyDown = function (arg) {
        if (arg.event.key == 'Enter' || arg.event.keyCode == 40 || arg.event.keyCode == 38) {
          e.component.focus();
        }
      }
    }

    if (e.parentType === 'dataRow') {
      this.productosDataGrid.instance.clearSelection();
      if (e.row == undefined) {
        return;
      }

      if (e.row.data == undefined) {
        return;
      }
    }
  }

  onToolbarPreparing(e) {
    var toolbarItems = e.toolbarOptions.items;
    var toolbarSearch = toolbarItems[0];
    toolbarSearch.location = 'before';
    toolbarSearch.options = {
      width: 136
    }

    e.toolbarOptions.items.unshift({
      location: 'after',
      widget: 'dxCheckBox',
      options: {
        width: 136,
        text: 'Seleccionar Todo',
        onValueChanged: this.seleccionarProductos.bind(this)
      }
    }, {
      location: 'after',
      widget: 'dxButton',
      options: {
        text: 'Agregar',
        onClick: this.agregarProductosGrid.bind(this)
      }
    });
  }

  seleccionarProductos(e: any): void {
    this.checkSeleccioanar = e;

    if (e.value === true) {
      this.productosDataGrid.instance.selectAll();
    } else {
      this.productosDataGrid.instance.clearSelection();
    }
  }

  agregarProductosGrid(e: any): void {
    this.productosAagregar.forEach(producto => {
      const esProductoExistente = this.productosAgregados.some(x => x.productoId === producto.productoId);

      if (!esProductoExistente) {
        this.productosAgregados.push(producto);
      }
    });

    this.onAddProducto.emit(this.productosAagregar);
    this.limpiarBusqueda();
  }

  limpiarBusqueda(): void {
    try {
      this.productosDataGrid.instance.clearFilter();
      this.productosDataGrid.instance.clearSelection();
      this._dropdownProducto.instance.close();
      this.checkSeleccioanar.component.option('value', false);
      this.checkSeleccioanar.value = false;
    } catch (error) {
    }
  }

  emitEliminarProducto(producto: any) {
    this.removerProducto(producto);
    this.onDeleteProducto.emit(producto);
  }

  removerProducto(producto: any): void {
    const index = this.productosAgregados.indexOf(producto);
    if (index === -1) {
      return;
    }
    this.productosAgregados.splice(index, 1);
  }
}
