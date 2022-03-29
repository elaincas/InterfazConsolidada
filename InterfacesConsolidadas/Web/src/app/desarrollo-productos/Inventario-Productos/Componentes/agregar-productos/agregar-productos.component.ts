import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';
import { notificacionBoostrap } from '../../_Alertas/_notifyBoostrap/notifybootstrap';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { AgregarProductosService, isNullEmptyOrWhiteSpace } from './agregar-productos.service';
import { Observable } from 'rxjs/Rx';
import { Productos } from '../../_Clases/Productos';
import { Output, EventEmitter } from '@angular/core';
import dataSource from 'devextreme/data/data_source';
import customStorage from 'devextreme/data/custom_store';
import { LoginService } from '../../../../login/services/login.service';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { InventarioProductosImpulsadoService } from '../../services/inventario-service.service';
import { DxFileUploaderComponent, DxLookupComponent, DxSelectBoxComponent } from 'devextreme-angular';


declare var $: any;
declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}
@Component({
  selector: 'app-agregar-productos',
  templateUrl: './agregar-productos.component.html',
  styleUrls: ['./agregar-productos.component.css'],
  providers: [AgregarProductosService]
})

export class AgregarProductosComponent implements OnInit {
 @ViewChild('distribuidorEdit') private distribuidorEdit: DxLookupComponent;
 @ViewChild('proveedorEdit') private proveedorEdit: DxLookupComponent;
 @ViewChild('ImagenAgregar') private imagenAgregar: DxFileUploaderComponent;
 @ViewChild('ImagenEditar') private imagenEditar: DxFileUploaderComponent;

 fileDataUri='';
 fileName:string="";

 fileDataUriEdit='';
 fileNameEdit:string="";
  @Output() pageChange: EventEmitter<number> = new EventEmitter();
  constructor(private formbuilder: FormBuilder,
    private service: AgregarProductosService,private loginService: LoginService, private serviceInventarioProductoImpulsados: InventarioProductosImpulsadoService) {
    this.producto = new Productos();
    this.formProductos = this.formbuilder.group({
      ProdIdPOS: new FormControl(''),
      ProductoId: new FormControl('', Validators.compose([Validators.required])),
      NombreProducto: new FormControl(''),
      UltimoCosto: new FormControl(''),
      UltimoPrecio: new FormControl(''),
      ProveedorId: new FormControl(''),
      DistribuidorId: new FormControl(''),
      ImagenUrl : new FormControl(''),
      ImagenBase64 : new FormControl(''),

      ImagenName : new FormControl(''),



      Descontinuado: new FormControl(''),
      UsuarioIdCrea: new  FormControl(''),
      EsActivo: true,
    });
    this.formProductos.valueChanges.subscribe(
      data => {
        this.onValueChanged(data);
      });
    this.is_edit = false;
  }

  // **** Variables ****
  // Formulario
  formProductos: FormGroup;

  // Listas
  producto: Productos;
  productos;
  // Control
  mensajeRespuesta;
  deshabiliarBotonAgregar = true;
  _mostrarPopup: boolean = false;
  // Editar
  public dataTable: DataTable;
  is_edit: boolean;

  // Paginacion
  offsete = 0;
  limite = 5;
  total = 1;
  rango = 5;
  paginaActual: number;
  totalPaginas: number;
  paginas: any[] = [];
  totalProductos = 1;

  formErrors = {
    'NombreProducto': ''
  };

  validationMessage = {

    'NombreProducto': {
      'required': 'Debe ingresar una descripción',
      'maxlength': 'No debe ingresar más de 60 carácteres'
    }
  };

  // Métodos/Funciones
  ngOnInit() {
    this.onValueChanged();
    this.obtenerProductos();
    this.obtenerDistribuidores();
    this.configurarDataSource();

  }

  obtenerProductos() {
    this.service.obtenerProductos()
      .subscribe(
      res => {
        this.totalProductos = res.length;
        this.obtenerPaginas(this.offsete, this.limite, this.totalProductos);
        this.productos = res;
      }
      );
  }

  obtenerProductoMaestroPorId(e:any) {
    if(e.value==null){return;}
    if(e.value==e.previousValue){return;}
      if (this.formProductos.get('ProdIdPOS').value.toString().length < 9) { return; }
    this.service.obtenerProductoMaestroPorId(this.formProductos.get('ProdIdPOS').value.toString())
      .subscribe(
      res => {
        if (res == null) { return; }

        this.formProductos.controls['NombreProducto'].setValue(res.NombreProducto);
      });
  }

  crearProducto() {
    Alertas.load("Guardando");

    if (this.Validaciones()) {
    this.formProductos.controls['UsuarioIdCrea'].setValue(this.loginService.Usuario.id);
    let base64File ='';
    if (this.fileDataUri!=null){
    if (this.fileDataUri.length > 0) {
      base64File= this.fileDataUri.split(',')[1];
      this.formProductos.get("ImagenBase64").setValue(base64File)
      this.formProductos.get("ImagenName").setValue(this.fileName)

    }}
      this.service.agregarProducto(this.formProductos.value)
        .subscribe(res => {
       Alertas.close();

          if (res != "OK")
            Alertas.warning("", res);
          else
            Alertas.ok("", "Éxito")
          this.obtenerProductos();
          this.limpiarControlesDeFormulario();
        }, err=>{Alertas.close(); Alertas.errorEnServidor()});
    }
  }

  Validaciones(): Boolean {
    if (isNullEmptyOrWhiteSpace(this.formProductos.get('NombreProducto').value))
    {
      Alertas.warning("Advertencia", "Ingrese el nombre del producto");
      return false;
    }
    return true;
  }

  limpiarControlesDeFormulario() {
    this.formProductos.reset();
    this.deshabiliarBotonAgregar = true;
   this.imagenAgregar.instance.reset();
  }

  obtenerTotalDePaginas(totalProductos: number, limite: number): number {
    return Math.ceil(Math.max(totalProductos, 1) / Math.max(limite, 1));
  }

  obtenerPaginaActual(offset: number, limite: number): number {
    return Math.floor(offset / limite) + 1;
  }


  obtenerPaginas(offset: number, limites: number, totalproductos: number) {
    this.paginas = [''];
    this.paginaActual = this.obtenerPaginaActual(offset, limites);
    this.totalPaginas = this.obtenerTotalDePaginas(totalproductos, limites);
    for (let i = 0; i < this.totalPaginas; i++) {
      this.paginas.push(i + 1);
    }
  }
  onEditarProducto(dataProducto: Productos) {
    this._mostrarPopup = true

    this.producto.NombreProducto = dataProducto.NombreProducto;
    this.producto.ProdIdPOS = dataProducto.ProdIdPOS;
    this.producto.UltimoPrecio = dataProducto.UltimoPrecio;
    this.producto.UltimoCosto = dataProducto.UltimoCosto;
    this.producto.ProductoId = dataProducto.ProductoId;
    this.producto.ImagenUrl = dataProducto.ImagenUrl;
    this.fileDataUriEdit= dataProducto.ImagenUrl;
    this.dataSourceDistribuidoresEdit.searchValue(dataProducto.DistribuidorId);
    this.dataSourceProveedorEdit.searchValue(dataProducto.ProveedorId);

    this.producto.ProveedorId = dataProducto.ProveedorId;
    this.producto.DistribuidorId = dataProducto.DistribuidorId;
    this.dataSourceDistribuidoresEdit.load().then(d=>{
      this.distribuidorEdit.value= dataProducto.DistribuidorId;
    });
    this.dataSourceProveedorEdit.load().then(r=>{
      this.proveedorEdit.value= dataProducto.ProveedorId;
    });

    this.is_edit = true;
    this.deshabiliarBotonAgregar = false;

  }
  seleccionarPagina(pagina: number) {
    this.pageChange.emit((pagina - 1) * this.limite);
  }

  descontinuarProducto(producto: Productos) {
    // if (this.formProductos.get('ProductoId').value.toString().length < 9) {return; }
    this.service.DescontinuarProducto(producto).subscribe(
      res => {
        Alertas.ok("","Exito");
        this.obtenerProductos();
      }
    );
  }

  onValueChanged(data?: any) {

    if (!this.formProductos) {
      return;

    }

    const form = this.formProductos;

    for (const field in this.formErrors) {

      this.formProductos[field] = '';
      this.formErrors[field] = '';

      const control = form.get(field);

      if (control && control.dirty && !control.valid) {

        const messages = this.validationMessage[field];

        for (const key in control.errors) {

          this.formErrors[field] += messages[key] + ' ';

        }

      }

    }
  }

  mensaje(from, align) {
    let type = ['', 'info', 'success', 'warning', 'danger', 'rose', 'primary'];

    let color = Math.floor((Math.random() * 6) + 1);


    $.notify({
      icon: 'notifications',
      message: 'Welcome to <b>Material Dashboard</b> - a beautiful dashboard for every web developer.'

    }, {
        type: type[color],
        timer: 3000,
        placement: {
          from: from,
          align: align
        }
      });

  }

  CerrarPopup(){
    this.imagenEditar.instance.reset();
    this._mostrarPopup = false;
  }

  Editar(){
    Alertas.load("Guardando");
    this.producto.DistribuidorId=this.distribuidorEdit.value;
    this.producto.ProveedorId=this.proveedorEdit.value;
    let base64FileEdit ='';
    if(this.fileDataUriEdit!=null){
      if (this.fileDataUriEdit.length > 0) {
        base64FileEdit= this.fileDataUriEdit.split(',')[1];
        this.producto.ImagenBase64=base64FileEdit
        this.producto.ImagenName= this.fileNameEdit;
      }

    }

    this.service.ActualizarProducto(this.producto).subscribe(data=>{
    Alertas.close();
  this.imagenEditar.instance.reset();
      Alertas.ok("","Exito");
      this.obtenerProductos();
    },error=>{
      Alertas.close();
    let mensaje = JSON.parse(error._body)
    Alertas.error("Advertencia",mensaje.Message);
    })
  }

  distribuidores:any[];
  obtenerDistribuidores() {
    this.service.ObtenerDistribuidores()
      .subscribe(r => {
        this.distribuidores = r;
      });
  }


  configurarDataSource() {
    const custom = new customStorage({
      load: this.buscarDistribuidores.bind(this),
      byKey: (key: any) => new Promise<any>((resolve, reject) => {
        resolve(null);
      }),
    });

    this.dataSourceDistribuidores = new dataSource({
      store: custom,
      totalCount:custom.totalCount
    });

    const customp = new customStorage({
      load: this.buscarProveedores.bind(this),
      byKey: (key: any) => new Promise<any>((resolve, reject) => {
        resolve(null);
      }),
    });

    this.dataSourceProveedor = new dataSource({
      store: customp
    });


    const customEdit = new customStorage({
      load: this.buscarDistribuidoresEdit.bind(this),
      byKey: (key: any) => new Promise<any>((resolve, reject) => {
        resolve(null);
      }),
    });

    this.dataSourceDistribuidoresEdit = new dataSource({
      store: customEdit,
      totalCount:custom.totalCount
    });

    const custompEdit = new customStorage({
      load: this.buscarProveedoresEdit.bind(this),
      byKey: (key: any) => new Promise<any>((resolve, reject) => {
        resolve(null);
      }),
    });

    this.dataSourceProveedorEdit = new dataSource({
      store: custompEdit
    });
  }

  dataSourceDistribuidores: dataSource;
  dataSourceProveedor: dataSource;
  dataSourceDistribuidoresEdit: dataSource;
  dataSourceProveedorEdit: dataSource;
  buscarDistribuidores(options: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const textoBusqueda = this.dataSourceDistribuidores.searchValue();
      console.log(this.dataSourceDistribuidores.totalCount());


      this.serviceInventarioProductoImpulsados.ObtenerDistribuidoresFiltrado( this.dataSourceDistribuidores.pageIndex().toString(), this.dataSourceDistribuidores.pageSize().toString(),textoBusqueda)
        .then(data => resolve(data));
    });
  }
  buscarProveedores(options: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {

      const textoBusqueda = this.dataSourceProveedor.searchValue();
      this.serviceInventarioProductoImpulsados.ObtenerProveedor(this.dataSourceProveedor.pageIndex().toString(),this.dataSourceProveedor.pageSize().toString(), textoBusqueda)
        .then(data => resolve(data));
    });
  }


  buscarDistribuidoresEdit(options: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const textoBusqueda = this.dataSourceDistribuidoresEdit.searchValue();


      this.serviceInventarioProductoImpulsados.ObtenerDistribuidoresFiltrado( this.dataSourceDistribuidoresEdit.pageIndex().toString(), this.dataSourceDistribuidoresEdit.pageSize().toString(),textoBusqueda)
        .then(data => resolve(data));
    });
  }
  buscarProveedoresEdit(options: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {

      const textoBusqueda = this.dataSourceProveedorEdit.searchValue();
      this.serviceInventarioProductoImpulsados.ObtenerProveedor(this.dataSourceProveedorEdit.pageIndex().toString(),this.dataSourceProveedorEdit.pageSize().toString(), textoBusqueda)
        .then(data => resolve(data));
    });
  }

  QuitarImagen(event,edit:boolean=false) {
    if (event.value.length == 0) {





    if(edit){
    this.fileDataUriEdit = "";
    this.fileNameEdit="";
    }else{
this.fileName=""
      this.fileDataUri = "";
    }
  }
  }

  Actualizar(): boolean {
    return true;
  }

  ObtenerImagenSeleccionadoDxFileUploader(event: any,edit:boolean=false) {

    if (event.value[0]) {
      const reader = new FileReader();
      if(edit){
        reader.onload = (event: any) => {
          this.fileDataUriEdit = event.target.result;
        };
        this.fileNameEdit=event.value[0].name;
        reader.readAsDataURL(event.value[0]);
      }else{
        console.log("mm")
        reader.onload = (event: any) => {
          this.fileDataUri = event.target.result;
        };
        this.fileName=event.value[0].name;
        reader.readAsDataURL(event.value[0]);
      }

    }
  }


}
