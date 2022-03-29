import { HttpClient } from "@angular/common/http";
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChange,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import CustomStore from "devextreme/data/custom_store";
import { DxDataGridComponent, DxTreeViewComponent } from "devextreme-angular";
import { isArray } from "util";
import { ProductLookup } from "../models/product-lookup.model";
import { ProductoService } from "../../producto.service";
@Component({
  selector: "product-lookup",
  templateUrl: "./product-lookup.component.html",
  styleUrls: ["./product-lookup.component.css"],
})
export class ProductLookupComponent implements OnInit, OnChanges {
  _productoSeleccionado: string;

  productosSeleccionadoDataSource: any;
  _productos: ProductLookup[];
  @ViewChild("ddlProductos")
  _lookupProductos: any;
  @ViewChildren("dxDataGridProductos")
  _gridProductos: QueryList<DxDataGridComponent>;
  productos: any;

  @Input() product: ProductLookup;
  @Input() productChange: ProductLookup;
  @Input() productosEdit: ProductLookup[];

  @Input() posicionNombreProducto: number;
  @Input() posicionColumnaIdentificador: number;
  @Input() esReadonly: boolean;
  @Input() isRequired: boolean;
  @Input() esPrimeraCargaRequerida: boolean;
  @Input() esProductoValido: boolean;
  @Input() mostrarBotonLimpiar: boolean;
  @Output() onProductoSeleccionado: EventEmitter<any>;
  @Output() onProductoLimpiado: EventEmitter<any>;
  @ViewChild(DxTreeViewComponent) treeView;

  esPrimeraBusqueda: boolean;
  esPrimeraCarga: boolean;

  constructor(
    public _httpClient: HttpClient,
    _productoService: ProductoService
  ) {
    this.posicionNombreProducto = 0;
    this.posicionColumnaIdentificador = 1;

    this.esPrimeraBusqueda = true;
    this.esPrimeraCarga = true;
    this.esReadonly = false;
    this.isRequired = false;

    this.productos = new CustomStore({
      load: (loadOptions: any) => {
        let texto = "";
        if (isArray(loadOptions.filter)) {
          texto = loadOptions.filter[2];
        }

        if (texto.length < 3) {
          let data: any;
          return data;
        }

        return _productoService
          .Buscador(texto)
          .toPromise()
          .then((data: any) => {
            this._productos = data;
            return {
              data: data,
              totalCount: data.length,
            };
          })
          .catch((error) => {
            console.log(error);
          });
      },
      byKey: (e: any) => {
        return _productoService
          .Buscador(e.productoId)
          .toPromise()
          .then((data: any) => {
            this._productos = data;
            return {
              data: data,
              totalCount: data.length,
            };
          })
          .catch((error) => {
            console.log(error);
          });
      },
    });
    this.onProductoSeleccionado = new EventEmitter<any>();
    this.onProductoLimpiado = new EventEmitter<any>();
    this.esProductoValido = true;
    this.mostrarBotonLimpiar = true;
  }

  ngOnInit() {}

  ngOnChanges(changes: {
    product: SimpleChange;
    productosEdit: SimpleChange;
  }): void {
    if (this.product) {
      this.productoSeleccionado = this.product.productoId;
    }

    if (
      this.product &&
      this.product.productoId === "" &&
      this._lookupProductos
    ) {
      this._lookupProductos.value = "";

      if (
        this._gridProductos &&
        this._gridProductos.first &&
        this._gridProductos.first.instance
      )
        this._gridProductos.first.instance.clearFilter();

      const element: any = $(this._lookupProductos.element)[0];

      const clearButtom: any = $(element.nativeElement).find(
        ".dx-clear-button-area"
      )[0];

      if (clearButtom) clearButtom.click();
    }

    if (changes.productosEdit) {
      this.productosSeleccionadoDataSource = null;
    }
  }

  validationErrorProductoSeleccionado() {
    if (this.isRequired) {
      return {
        type: "required",
        message: "El producto es requerido.",
      };
    } else {
      return {};
    }
  }

  set productoSeleccionado(value: string) {
    this._productoSeleccionado = value;
    let _producto: any = {};
    if (this._productos && Object.keys(this._productos).length > 0) {
      _producto = this._productos.find((p) => p.productoId === value);
    }

    if (_producto && Object.keys(_producto).length > 0) {
      this.onProductoSeleccionado.emit(_producto);
    }

    setTimeout(() => {
      const element: any = $(this._lookupProductos.element)[0];

      const clearButtom: any = $(element.nativeElement).find(
        ".dx-clear-button-area"
      )[0];

      $(clearButtom).click(() => {
        this.onProductoLimpiado.emit(true);
      });
    }, 500);
  }

  get productoSeleccionado(): string {
    return this._productoSeleccionado;
  }

  get dataSource(): any {
    return this.productosSeleccionadoDataSource || this.productosEdit;
  }

  filaClickeada(fila) {
    this.productosSeleccionadoDataSource = [fila.data];
    this._productoSeleccionado = fila.data.productoId;
  }

  limpiarFiltros(event) {
  }
}
