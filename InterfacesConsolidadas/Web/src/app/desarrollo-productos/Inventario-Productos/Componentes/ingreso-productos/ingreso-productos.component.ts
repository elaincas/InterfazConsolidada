import { AfterViewInit, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { IngresarProductosService } from './ingreso-productos.service';
import { promise } from 'selenium-webdriver';
import { TablaAgregarProductosComponent } from '../tabla-agregar-productos/tabla-agregar-productos.component';
import { IngresoProductos } from '../../_Clases/IngresoProductos';
import { InventarioProductosUbicacion } from '../../_Clases/InventarioProductosUbicacion';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { LoginService } from '../../../../login/services/login.service';
import customStorage from 'devextreme/data/custom_store';
import dataSource from 'devextreme/data/data_source';
import { InventarioProductosImpulsadoService } from '../../services/inventario-service.service';
import { DxFileUploaderComponent } from 'devextreme-angular';


@Component({
  selector: 'app-ingreso-productos',
  templateUrl: './ingreso-productos.component.html',
  styleUrls: ['./ingreso-productos.component.css']
})
export class IngresoProductosComponent implements OnInit, AfterViewInit {
  @ViewChild("TablaAgregar") private tablaAgregarComponent: TablaAgregarProductosComponent;
  @ViewChild('ImagenAgregar') private imagenAgregar: DxFileUploaderComponent;

  dataSourceDistribuidores: dataSource;

  constructor(
    private formbuilder: FormBuilder,
    private service: IngresarProductosService,private serviceInventarioProductoImpulsados: InventarioProductosImpulsadoService, private loginService: LoginService) {
    this.formIngresos = this.formbuilder.group({
      NoDocumento: new FormControl(),
      Observaciones: new FormControl(''),
      DistribuidorId: new FormControl(''),
      FinalidadId: new FormControl(''),
      ImagenUrl : new FormControl(''),
      ImagenBase64 : new FormControl(''),
      ImagenName : new FormControl(''),
    });
    this.formInventario = this.formbuilder.group({
      ProductoId: new FormControl(''),
      NombreProducto: new FormControl(''),
      Precio: new FormControl(''),
      Costo: new FormControl(''),
      FechaVence: new FormControl('')
    }
    );
    this.formIngresos.valueChanges.subscribe(
      data => {
        this.onValueChanged(data);
      }
    );
    this.ingresoEncabezado = new IngresoProductos;
    this.distribuidores = new Array;
    this.finalidades = new Array;
  }

  // Formularios
  formIngresos: FormGroup;
  formInventario: FormGroup;

  // Arreglos
  finalidades: any[];
  distribuidores: any[];
  // Clases
  ingresoEncabezado: IngresoProductos;
  listaProductosIngresar: InventarioProductosUbicacion[];

  // Variables
  prueba: string;
  selectedDistribuidor: number;
  selectedFinalidad: number;
  sucursalDesarrolloDeProductosID = 1000;
  ngOnInit() {
    this.obtenerFinalidades();
    this.configurarDataSource();
  }

  ngAfterViewInit(): void { }

  onValueChanged(data?: any) {
    if (!this.formIngresos) {
      return;
    }
  }
  ingresarProductos() {
    if (this.validarControlesDeFormulario() === false) {
      return;
    }
    else {
      // Set Valores de Encabezado
      this.ingresoEncabezado.UsuarioIdCrea = this.loginService.Usuario.id;
      this.ingresoEncabezado.SucursalId = this.sucursalDesarrolloDeProductosID;
      this.ingresoEncabezado.Observaciones = this.formIngresos.get('Observaciones').value;
      this.ingresoEncabezado.NoDocumentoDistribuidor = this.formIngresos.get('NoDocumento').value;

      let base64File ='';
      if (this.fileDataUri!=null){
      if (this.fileDataUri.length > 0) {
        base64File= this.fileDataUri.split(',')[1];
        this.ingresoEncabezado.ImagenBase64  =base64File;
        this.ingresoEncabezado.ImagenName=this.imagenAgregar.value[0].name;

      }}
      this.listaProductosIngresar = this.tablaAgregarComponent.listaProductosIngresar;
      this.ingresoEncabezado.InventarioProductosUbicacion = this.listaProductosIngresar;

      this.service.IngresarProductos(this.ingresoEncabezado)
        .subscribe(res => {
          if (res === "OK") {
            Alertas.ok("", "Éxito")
            this.tablaAgregarComponent.listaProductosIngresar = new Array<InventarioProductosUbicacion>();
            this.limpiarControlesDeFormulario(true)
          }
          else{
          Alertas.info("", res);
          }
        }
        );
      this.limpiarControlesDeFormulario(false);
    }
  }

  limpiarControlesDeFormulario(esTransaccionExitosa: boolean) {
    if (!esTransaccionExitosa) {
      this.formIngresos.reset();
      this.formInventario.reset();
    }
    else{
      this.imagenAgregar.instance.reset();

      this.formIngresos.reset();
      this.formInventario.reset();
      this.tablaAgregarComponent.listaProductos = new Array();
      this.listaProductosIngresar = new Array<InventarioProductosUbicacion>();
      this.ingresoEncabezado = new IngresoProductos();
    }
  }

  validarControlesDeFormulario(): boolean {
    if (this.formIngresos.get('NoDocumento').value === '') {
      Alertas.warning("Advertencia", 'Número de Documento inválido');
      return false;
    }
    if (this.selectedDistribuidor === 0) {
      Alertas.warning("Advertencia", 'Distribuidor inválido');
      return false;
    }
    if (this.selectedFinalidad === 0) {
      Alertas.warning("Advertencia", 'Seleccione la Finalidad del Ingreso');
      return false;
    }
    return true;
  }
  obtenerFinalidades() {
    this.service.ObtenerFinalidades()
      .subscribe(r => {
        this.finalidades = r;
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


  }
  buscarDistribuidores(options: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const textoBusqueda = this.dataSourceDistribuidores.searchValue();
      console.log(this.dataSourceDistribuidores.totalCount());


      this.serviceInventarioProductoImpulsados.ObtenerDistribuidoresFiltrado( this.dataSourceDistribuidores.pageIndex().toString(), this.dataSourceDistribuidores.pageSize().toString(),textoBusqueda)
        .then(data => resolve(data));
    });
  }


  fileDataUri='';


  onIngresar(ingresar: boolean) {
    this.ingresarProductos();
  }

  ObtenerImagenSeleccionadoDxFileUploader(event: any) {

    if (event.value[0]) {
      const reader = new FileReader();



      this.ingresoEncabezado.ImagenName=event.value[0].name;
      reader.onload = (event: any) => {
        this.fileDataUri = event.target.result;

      };
        reader.readAsDataURL(event.value[0]);


    }
  }
  QuitarImagen(event) {

    this.ingresoEncabezado.ImagenName=""
      this.fileDataUri = "";

  }
}


