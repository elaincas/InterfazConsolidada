import { HttpClient, HttpParams } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { DxDataGridComponent } from "devextreme-angular";
import CustomStore from "devextreme/data/custom_store";
import notify from "devextreme/ui/notify";
import { environment } from "../../../../../../environments/environment";
import { TrasladarProductosService } from "../../../../../desarrollo-productos/Inventario-Productos/componentes/trasladar-productos/trasladar-productos.service";
import { ProductoGrid } from "../../../../../desarrollo-productos/Inventario-Productos/_Clases/GridTrasladoProductos";
import { ConfiguracionProductosRecompraService } from "../../../../../ecommerce/recompra/_services/configuracion-productos.service";
import { Alertas } from "../../../../../helpers/notificaciones/notificaciones";
import { LoginService } from "../../../../../login/services/login.service";
import { ProductoRestringidosListado } from "../../../models/producto-restringido-listado.model";
import { ProductosRestringidosService } from "../../../services/productos-restringidos.service";
import { helpers } from "../../../../../helpers/utils";


@Component({
  selector: "app-productos-restringidos",
  templateUrl: "./productos-restringidos.html",
  styleUrls: ["./productos-restringidos.css"],
})
export class ProductosRestringidosComponent implements OnInit {
  _productoSeleccionado: string;
  _productoSelecionadoDescripcion:string;
  productosSeleccionadoDataSource: any;
  productos: any;
  validacion: any;
  formGroupProductosRestringidos: FormGroup;
  productosRestringidos: ProductoRestringidosListado[];
  productoGrid: ProductoGrid;
  cantidadTotal: number;
  cantidadRestante: number;
  submit: Boolean;
  botonAgregarDeshabilitado: Boolean;
  botonEditarDeshabilitado: Boolean;
  esEdicion: Boolean;
  productoExclusivoId: number;
  estadoOriginal: boolean;
  esPrimeraBusqueda: boolean;
  public archivosExcel: Array<File>;
  excelProductos: File;
  url: string;

  @ViewChild("gridProductos") gridProductos: DxDataGridComponent;

  constructor(
    private _administracionProductosRestringidosService: ProductosRestringidosService,
    private _formBuilder: FormBuilder,
    private _traspadarProductoService: TrasladarProductosService,
    private _loginService: LoginService,
    public _httpClient: HttpClient,
    private configuracionProductosService: ConfiguracionProductosRecompraService
  ) {
    this.submit = false;
    this.botonAgregarDeshabilitado = false;
    this.botonEditarDeshabilitado = false;
    this.esEdicion = false;
    this.productoGrid = new ProductoGrid();
    this.archivosExcel = new Array<File>();

    this.cantidadTotal = 0;
    this.cantidadTotal = 0;
    this.productoExclusivoId = 0;
    this.esPrimeraBusqueda = true;
    
    const POSICION_COLUMNA_IDENTIFICADOR = 0;
    const POSICION_NOMBRE_PRODUCTO = 1;

    this.productos = new CustomStore({
      key: "OrderNumber",
      load: (loadOptions: any) => {
        if (!loadOptions["filter"]) {
          const promesa = new Promise((resolve, reject) => {
            let data = [];
            resolve({
              data,
            });
          });

          return promesa;
        }
        let params: HttpParams = new HttpParams();
        [
          "filter",
          "skip",
          "take",
          "requireTotalCount",
          "requireGroupCount",
          "sort",
          "totalSummary",
          "group",
          "groupSummary",
        ].forEach((i) => {
          if (i in loadOptions && this.isNotEmpty(loadOptions[i])) {
            // Si es la columna nombre de porducto
            if (
              (loadOptions[i].columnIndex === POSICION_NOMBRE_PRODUCTO ||
                loadOptions[i].columnIndex ===
                  POSICION_COLUMNA_IDENTIFICADOR) &&
              this.esPrimeraBusqueda
            ) {
              this.esPrimeraBusqueda = false;
              let loadOptionsTemp = loadOptions[i];
              loadOptionsTemp[1] = "contains";
              params = params.set(i, JSON.stringify(loadOptionsTemp));
              return;
            }
            params = params.set(i, JSON.stringify(loadOptions[i]));
          }
        });

        return _httpClient
          .get(
            `${environment.maestrosFarmaciaApi}/api/productos/ObtenerProductosServerSideRendering`,
            { params: params }
          )
          .toPromise()
          .then((data: any) => {
            return {
              data: data.data,
              totalCount: data.totalCount,
              summary: data.summary,
              groupCount: data.groupCount,
            };
          })
          .catch((error) => {
            throw "Hubo un error";
          });
      },
    });

    this.validacion = {
      productoId: {
        error: false,
        mensaje: "",
      },
      descuento: {
        error: false,
        mensaje: "",
      },
      fechaInicio: {
        error: false,
        mensaje: "",
      },
      fechaFin: {
        error: false,
        mensaje: "",
      },
    };
  }

  isNotEmpty(value: any): boolean {
    return value !== undefined && value !== null && value !== "";
  }

  private procesarError(error) {
    switch (error.status) {
      case 400:
        Alertas.showValidationMessage(error);
        break;
      case 500:
        Alertas.errorEnServidor("Hubo un error en el servidor.", error._body);
        break;
      default:
        Alertas.showHttpResponse(error);
        break;
    }
  }

  ngOnInit() {
    this.construirFormulario();
    this.cargarRestringidos();
  }

  buscarProducto() {
    this._traspadarProductoService
      .ObtenerProductosInventarioId(this.productoGrid.ProductoCod)
      .subscribe(
        (data) => {
          if (data.RespuestaMensaje != "OK") {
            Alertas.warning("Advertencia", data.RespuestaMensaje);
            return;
          }
          this.productoGrid.Precio = data.Precio;
          this.cantidadTotal = data.Cantidad;
          this.cantidadRestante = data.Cantidad;
          this.productoGrid.Costo = data.Costo;
          this.productoGrid.NombreProducto = data.DescripcionProducto;
        },
        (error) => {
          Alertas.warning("Advertencia", "Producto no existe o no está activo");
        }
      );
  }

  construirFormulario() {
    this.formGroupProductosRestringidos = this._formBuilder.group({
      descuento: new FormControl(),
      productoId: new FormControl(),
      fechaInicio: new FormControl(),
      fechaFin: new FormControl(),
    });
  }

  cargarRestringidos() {
    this._administracionProductosRestringidosService
      .obtenerProductosRestringidos()
      .subscribe(
        (data) => {
          Alertas.close();
          this.productosRestringidos = data;
        },
        (error) => {
          console.log(error);

          Alertas.close();

          this.procesarError(error);
        }
      );
  }

  enter(data) {
    if (data.event.keyCode == 13) {
      this.buscarProducto();
    }
  }

  set productoSeleccionado(value: string) {
    this._productoSeleccionado = value;
  }
  get productoSeleccionado(): string {
    return this._productoSeleccionado;
  }

  filaClickeada(fila) {
    this.productosSeleccionadoDataSource = [fila.data];
    this._productoSeleccionado = fila.data.identificador;
    this._productoSelecionadoDescripcion = fila.data.nombre;
  }

  mostrarErrorHttp(error) {
    Alertas.showHttpResponse(
      "",
      "Hubo un error inesperado, por favor inténtelo de nuevo."
    );
  }

  actualizarGrid(onComplete?: Function): void {
    Alertas.load();
    this._administracionProductosRestringidosService
      .obtenerProductosRestringidos()
      .subscribe({
        next: (data) => {
          Alertas.close();
          this.productosRestringidos = data;
        },
        error: (error) => {
          this.procesarError(error);
        },
        complete: () => {
          Alertas.close();
          if (onComplete) {
            onComplete();
          }
        },
      });
  }

  async validarFormulario() {
    let todoBien = true;
  
    let productoId: string = this.formGroupProductosRestringidos.get(
      "productoId"
    ).value;

    if (!productoId && !this.esEdicion) {
      this.validacion.productoId.error = true;
      this.validacion.productoId.mensaje = "El campo Producto es obligatorio.";
      todoBien = false;
    }

    if (!todoBien && this.formGroupProductosRestringidos.valid) {
      notify(
        "Por favor, revise que todos los campos sean correctos.",
        "error",
        3000
      );
    }
    return todoBien;
  }

  limpiar() {
    this.formGroupProductosRestringidos.reset();

    this.productosSeleccionadoDataSource = [];
    this._productoSeleccionado = "";

    this.esEdicion = false;
    this.botonEditarDeshabilitado = false;
    this.botonAgregarDeshabilitado = false;
    this.gridProductos.instance.clearFilter();
    this.submit = false;
  }

  async agregar() {
    this.submit = true;
    this.botonAgregarDeshabilitado = true;

    if (!(await this.validarFormulario())) {
      this.botonAgregarDeshabilitado = false;
      return;
    }
    Alertas.load();
    let agente = JSON.parse(localStorage.getItem('auth'));

    const productoRestringido = {
      descripcion: this._productoSelecionadoDescripcion,
      productoId: this.formGroupProductosRestringidos.get("productoId").value,
      agente : parseInt(agente.id)
    };

    this._administracionProductosRestringidosService
      .guardarProductoRestrigido(productoRestringido)
      .subscribe(
        (res) => {
          if (res.respuestaTipo === 1) {
            Alertas.error("Error", res.respuesta);
            return;
          }
          this.actualizarGrid(() => {
            this.limpiar();

            Alertas.ok(
              "¡Correcto!",
              "El Producto restringido se ha agregado correctamente."
            );
          });
        },
        (error) => {
          this.procesarError(error);
        }
      );

    
    this.submit = false;
    this.botonAgregarDeshabilitado = false;
    Alertas.close();
  }


  inactivar(id) {
    Alertas.question(
      "",
      "¿Desea habilitar este producto restringido?"
    ).then(() => {
      Alertas.load();
      this._administracionProductosRestringidosService
        .inactivarProductoRestringido(id)
        
        .subscribe(
          (seInactivo) => {
            this.actualizarGrid();
            if (seInactivo) {
              Alertas.close();
              Alertas.ok(
                "¡Correcto!",
                "El producto restringido se a habilitado correctamente."
              );
            } else {
              Alertas.error(
                "Error",
                "Hubo un error al habilitar el producto con restringido"
              );
            }
          },
          (error) => {
            this.procesarError(error);
          }
        );
    });
  }
}
