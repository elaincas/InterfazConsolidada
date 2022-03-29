import { HttpClient, HttpParams } from "@angular/common/http";
import { AdministracionProductoPresentacionesService, isNullEmptyOrWhiteSpace } from '../../services/administracionProductoPresentaciones.service';
import { ProductoPresentacion, Producto, ProductoAtributo, ProductoPresentaciones } from '../../models/productoPresentacion';
import { Component, OnInit, AfterContentInit, ViewChild } from '@angular/core';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { LoginService } from '../../../../login/services/login.service';
import { DxDataGridComponent } from 'devextreme-angular';
import CustomStore from "devextreme/data/custom_store";
import { environment } from "../../../../../environments/environment";

@Component({
  selector: 'app-presentaciones',
  templateUrl: './presentaciones.component.html',
  styleUrls: ['./presentaciones.component.css']
})
export class PresentacionesComponent implements OnInit, AfterContentInit {

  listaProductosPresentaciones: ProductoPresentaciones[];

  productosOriginalesDataStore: any;
  esPrimeraBusquedaProductoOriginal: boolean;

  productosPresentacionesDataStore: any;
  esPrimeraBusquedaProductoPresentaciones: boolean;

  productoPresentacionesDto: ProductoPresentaciones;
  popupPresentacionesVisible: boolean;
  formGroupPresentaciones: FormGroup;
  editando: boolean = false;

  productosAtributos: ProductoAtributo[];
  _productoAtributoSeleccionado: string;

  @ViewChild('gridProductosOriginales') productosOriginalDataGrid: DxDataGridComponent;
  _productoOriginalSeleccionado: string;
  _productoOriginalSeleccionadoDescripcion: string;

  @ViewChild('gridProductosPresentacion') productosPresentacionDataGrid: DxDataGridComponent;
  _productoPresentacionSeleccionado: string;
  _productoPresentacionSeleccionadoDescripcion: string;

  productoOriginalSeleccionadoDataSource: any;
  productoPresentacionSeleccionadoDataSource: any;

  constructor(private _administracionProductosPresentacionesService: AdministracionProductoPresentacionesService,
    private _formBuilder: FormBuilder,
    private _loginService: LoginService,
    public _httpClient: HttpClient)
    {
      this.esPrimeraBusquedaProductoOriginal = true;
      this.esPrimeraBusquedaProductoPresentaciones = true;
      const POSICION_COLUMNA_IDENTIFICADOR = 0;
      const POSICION_NOMBRE_PRODUCTO = 1;

      this.productosOriginalesDataStore = new CustomStore({
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
                this.esPrimeraBusquedaProductoOriginal
              ) {
                this.esPrimeraBusquedaProductoOriginal = false;
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

      this.productosPresentacionesDataStore = new CustomStore({
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
                this.esPrimeraBusquedaProductoPresentaciones
              ) {
                this.esPrimeraBusquedaProductoPresentaciones = false;
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
    }

  ngOnInit():void {
    this.productoPresentacionesDto = new ProductoPresentaciones();
  }

  ngAfterContentInit():void{
    this.CargarListaAtributos();
    this.CargarProductosPresentaciones();
  }

  // Agregar Presentaciones
  inicializarFormularioAgregarPresentaciones():void {
    this.formGroupPresentaciones = this._formBuilder.group({
      productoOriginal: new FormControl(),
      productoPresentacion: new FormControl(),
      productoAtributo: new FormControl(),
    });
  }

  abrirAgregarPresentaciones():void
  {
    this.productoPresentacionesDto = new ProductoPresentaciones();
    this.inicializarFormularioAgregarPresentaciones();
    this._productoOriginalSeleccionado = "";
    this._productoOriginalSeleccionadoDescripcion = "";
    this._productoPresentacionSeleccionado = "";
    this._productoPresentacionSeleccionadoDescripcion = "";
    this.editando = false;
    this.popupPresentacionesVisible = true;
    this.limpiar();
  }

  AgregarDetalleProductoPresentacion():void{
    let producto = new ProductoPresentacion();
    if (!this.validateControlers()) {
      Alertas.warning("Advertencia", "Ingrese toda la informacion solicitada anteriormente.");
      return;
    }
    if (this.editando == false && this._productoPresentacionSeleccionado == this._productoOriginalSeleccionado) {
      Alertas.warning("Advertencia", "No puede seleccionar esta presentacion porque es el mismo producto seleccionado");
      return;
    }
    else if (this.editando && this._productoPresentacionSeleccionado == this.productoPresentacionesDto.productoId){
      Alertas.warning("Advertencia", "No puede seleccionar esta presentacion porque es el mismo producto seleccionado");
      return;
    }

    if(!this.editando){
      producto.productoId = this._productoOriginalSeleccionado;
    }
    else{
      producto.productoId = this.productoPresentacionesDto.productoId;
    }
    producto.presentacionProductoId = this._productoPresentacionSeleccionado;
    producto.presentacionProducto = new Producto();
    producto.presentacionProducto.id = producto.presentacionProductoId;
    producto.presentacionProducto.nombre = this._productoPresentacionSeleccionadoDescripcion;

    producto.productoAtributoId = this._productoAtributoSeleccionado;
    producto.productoAtributo = new ProductoAtributo();
    producto.productoAtributo.id = parseInt(this._productoAtributoSeleccionado);
    producto.productoAtributo.descripcion = this.productosAtributos.find(x=> x.id == producto.productoAtributo.id).descripcion;

    producto.usuarioAgregaId = this._loginService.Usuario.id.toString();

    if(this.productoPresentacionesDto.presentaciones
      .findIndex(x=> x.productoId == producto.productoId && x.presentacionProductoId == producto.presentacionProductoId && x.productoAtributoId == producto.productoAtributoId) != -1){
        Alertas.warning("Advertencia", "No puede seleccionar esta presentacion porque ya ha sido agregada/");
      return;
    }
    this.productoPresentacionesDto.presentaciones.push(producto);
  }

  QuitarDetalleProductoPresentacionAgregar(productoPresentacion:ProductoPresentacion):void {

    const presentacionDelete = this.productoPresentacionesDto.presentaciones
                              .findIndex(x=> x.productoId == productoPresentacion.productoId && x.presentacionProductoId == productoPresentacion.presentacionProductoId && x.productoAtributoId == productoPresentacion.productoAtributoId);

    Alertas.question("",`¿Desea eliminar la presentacion de producto?`, "Sí", "No").then(r=>{
      this.productoPresentacionesDto.presentaciones.splice(presentacionDelete,1);
    });
  }

  GuardarPresentacionesProducto():void{

    if(this.editando == false){
      this.productoPresentacionesDto.productoId = this._productoOriginalSeleccionado;
      this.productoPresentacionesDto.producto = new Producto();
      this.productoPresentacionesDto.producto.id = this._productoOriginalSeleccionado;
    }

    Alertas.load();
    if (!this.validarProductoPresentaciones(this.productoPresentacionesDto)) {
      return;
    }

    if(this.editando == false){
      this._administracionProductosPresentacionesService.PostProductoPresentaciones(this.productoPresentacionesDto)
      .subscribe(data => {
        Alertas.ok("","Registro Completado");
        this.CargarProductosPresentaciones();
        this.popupPresentacionesVisible = false;
      }, error => {
        console.log(error);
        Alertas.errorEnServidor();
      });
    }
    else{
      this._administracionProductosPresentacionesService.PutProductoPresentaciones(this.productoPresentacionesDto)
      .subscribe(data => {
        Alertas.ok("","Actualizacion Completada");
        this.CargarProductosPresentaciones();
        this.popupPresentacionesVisible = false;
      }, error => {
        console.log(error);
        Alertas.errorEnServidor();
      });
    }
  }

  AbrirActualizarPresentaciones(productoPresentaciones:ProductoPresentaciones):void {
    this.productoPresentacionesDto = new ProductoPresentaciones();
    this.inicializarFormularioAgregarPresentaciones();
    this.editando = true;

    this.productoPresentacionesDto.productoId = productoPresentaciones.productoId;
    this.productoPresentacionesDto.producto = new Producto();
    this.productoPresentacionesDto.producto.id = productoPresentaciones.productoId;
    this.productoPresentacionesDto.presentaciones = productoPresentaciones.presentaciones.map(lista => Object.assign({}, lista));
    this.popupPresentacionesVisible = true;

    this.limpiar();
  }

  CargarProductosPresentaciones():void{

    this._administracionProductosPresentacionesService.GetProductosPresentacionesAgrupadas()
      .subscribe(data => {
        Alertas.close();
        this.listaProductosPresentaciones = data;
      }, error => {
        console.log(error);
        Alertas.close();
        Alertas.errorEnServidor();
      });
  }

  CargarListaAtributos():void{
    Alertas.load();
    this._administracionProductosPresentacionesService.GetProductosAtributos()
    .subscribe(data => {
      this.productosAtributos = data;
    }, error =>{
      console.log("Error al cargar todos los productos.");
    });
  }

  EliminarPresentacion(productoPresentacion:ProductoPresentacion):void {
    var presentacionesDelProducto: ProductoPresentacion[] = this.listaProductosPresentaciones.find(x => x.productoId == productoPresentacion.productoId).presentaciones;
    const deleteProd = presentacionesDelProducto.findIndex(x=> x.id == productoPresentacion.id);
    Alertas.question("",`¿Desea eliminar la presentacion de producto?`, "Sí", "No").then(r=>{
      this._administracionProductosPresentacionesService.DeleteProductoPresentacion(productoPresentacion.id)
      .subscribe(data=>{
          Alertas.ok("","Presentacion de producto eliminado exitosamente.");
          this.listaProductosPresentaciones.find(x => x.productoId == productoPresentacion.productoId).presentaciones.splice(deleteProd,1);
        }, error => {
          console.log(error);
          Alertas.errorEnServidor();
        });
    });
  }

  filaClickeadaProductosOriginales(fila) {
    this.productoOriginalSeleccionadoDataSource = [fila.data];
    this._productoOriginalSeleccionado = fila.data.identificador;
    this._productoOriginalSeleccionadoDescripcion = fila.data.nombre;
  }

  filaClickeadaProductosPresentaciones(fila) {
    this.productoPresentacionSeleccionadoDataSource = [fila.data];
    this._productoPresentacionSeleccionado = fila.data.identificador;
    this._productoPresentacionSeleccionadoDescripcion = fila.data.nombre;
  }

  limpiar():void{
    this.productoOriginalSeleccionadoDataSource = [];
    this.productoPresentacionSeleccionadoDataSource = [];
    this.productosOriginalDataGrid.instance.deselectAll();
    this.productosPresentacionDataGrid.instance.deselectAll();
  }

  validateControlers():boolean{
    if (this._productoOriginalSeleccionado == undefined && this.productoPresentacionesDto.productoId == undefined) {
      return false;
    }
    if (this._productoPresentacionSeleccionado == undefined) {
      return false;
    }
    if (this._productoAtributoSeleccionado == undefined) {
      return false;
    }
    return true;
  }

  validarProductoPresentaciones(productoPresentaciones: ProductoPresentaciones):boolean{
    if (productoPresentaciones == undefined || productoPresentaciones == null) {
      Alertas.error("Error", "La informacion ingresada no es valida.");
      return false;
    }
    if (productoPresentaciones.productoId == undefined || productoPresentaciones.productoId == "" || productoPresentaciones.productoId == null || productoPresentaciones.productoId == "0") {
      Alertas.error("Error", "No se ha seleccionado un producto valido");
      return false;
    }
    if (productoPresentaciones.presentaciones == undefined || productoPresentaciones.presentaciones == null || productoPresentaciones.presentaciones.length == 0) {
      Alertas.error("Error", "No se han agregado presentaciones. Debe agregar minimo una presentacion.");
      return false;
    }
    return true;
  }

  isNotEmpty(value: any): boolean {
    return value !== undefined && value !== null && value !== "";
  }
}