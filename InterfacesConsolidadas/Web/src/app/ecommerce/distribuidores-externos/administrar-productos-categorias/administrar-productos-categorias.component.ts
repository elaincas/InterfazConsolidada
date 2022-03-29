

import { Component, OnInit, ViewChild } from '@angular/core';
import { DistribuidorExterno } from '../models/distribuidor-externo';
import { DistribuidorExternoCategorias } from '../models/distribuidor-externo-categoria';
import { DistribuidoresExternosService } from '../distribuidores-externos.service';
import { Alertas } from '../../../helpers/notificaciones/notificaciones';
import { LoginService } from '../../../login/services/login.service';
import { DistribuidorExternoCategoriaProductos } from '../models/distribuidor-externo-categorias-productos';
import { Producto } from '../../productos-de-carrusel/models/Producto';
import { DistribuidorExternoProductos } from '../models/distribuidor-externo-producto';
import { DxFileUploaderComponent } from 'devextreme-angular';

import { Http } from '@angular/http';

@Component({
  selector: 'app-administrar-productos-categorias',
  templateUrl: './administrar-productos-categorias.component.html',
  styleUrls: ['./administrar-productos-categorias.component.css']
})
export class AdministrarProductosCategoriasComponent implements OnInit {
  distribuidores: DistribuidorExterno[];
  distribuidoresCategorias: DistribuidorExternoCategorias[];
  productosCategoria: DistribuidorExternoCategorias[];
  distribuidorCategoriaProducto: DistribuidorExternoCategoriaProductos;
  productos: DistribuidorExternoProductos[];

  @ViewChild("fileUploaderDocs") fileUploader: DxFileUploaderComponent
  fileDataUri = '';
  _mostrarPopup: boolean = false;
  _mostrarPopupExcel: boolean = false;
  esAgregarDistribuidor: boolean;
  _gridBoxValue: number[] = [];
  _gridBoxValueAplicacion: DistribuidorExternoCategorias[];
  nombreCategoriaSeleccionada: string = ""
  constructor(private _distribuidorExternoService: DistribuidoresExternosService,
    private _loginService: LoginService, private http: Http) {
    this.distribuidores = new Array<DistribuidorExterno>();
    this.distribuidoresCategorias = new Array<DistribuidorExternoCategorias>();
    this.productosCategoria = new Array<DistribuidorExternoCategorias>();
    this.productos = new Array<DistribuidorExternoProductos>();
    this.distribuidorCategoriaProducto = new DistribuidorExternoCategoriaProductos();
  }

  ngOnInit() {
    this.ObtenerCategorias();
    this.ObtenerDistribuidores();
    this.ObtenerProductos();
  }
  ObtenerDistribuidores() {
    this._distribuidorExternoService.ObtenerDistribuidores().subscribe(data => {
      this.distribuidores = data as DistribuidorExterno[];
    }, error => {
      Alertas.error("Advertencia", error.error.message);
    });
  }
  ObtenerCategorias() {
    this._distribuidorExternoService.ObtenerCategorias().subscribe(data => {
      this.distribuidoresCategorias = data as DistribuidorExternoCategorias[];
    }, error => {
      Alertas.error("Advertencia", error.error.message);
    });
  }
  ObtenerProductos() {
    this._distribuidorExternoService.ObtenerProductos().subscribe(data => {
      this.productos = data as DistribuidorExternoProductos[];
    }, error => {
      Alertas.error("Advertencia", error.error.message);
    });
  }

  Guardar(dataGrid) {

    this.ObtenerInformacionGrid(dataGrid);
    this.distribuidorCategoriaProducto.distribuidorExternoCategoriaId = this.gridBoxValue[0];
    this.distribuidorCategoriaProducto.usuarioId = this._loginService.Usuario.id;

    this._distribuidorExternoService.AgregarProductoCategoria(this.distribuidorCategoriaProducto).subscribe(data => {
      Alertas.ok("Información guardada con éxito!");
      this.distribuidorCategoriaProducto = new DistribuidorExternoCategoriaProductos();
      this.ObtenerProductosCategoria();
      this._distribuidorExternoService.ActulizarProductosHugo().subscribe(d => {
        Alertas.ok("Productos guardados en Hugo correctamente!");
        this.ObtenerProductosCategoria();
      }, error => {
        Alertas.error("Ocurrió un error al guardar en Hugo!");
      }
        );
    },
      error => {
        Alertas.error(error._body)
      })
  }
  ObtenerInformacionGrid(dataGrid) {
    this.distribuidorCategoriaProducto.productos = (dataGrid.instance.getSelectedRowsData());
  }
  ObtenerProductosCategoria() {
    this._distribuidorExternoService.ObtenerProductoCategoria(this._gridBoxValue[0]).subscribe(data => {
      this.productosCategoria = data as any[];
    })
  }
  AgregarProducto() {
    if (this.gridBoxValue == undefined || this.gridBoxValue.length == 0) {
      Alertas.warning("Selecione una categoría");
      return;
    }
    this.nombreCategoriaSeleccionada = this.distribuidoresCategorias.find(x => x.id == this.gridBoxValue[0]).nombre
    this.MostrarPopup();
  }
  DesactivarCategoria(dataSeleccionada) {
    dataSeleccionada.activo = false;
    dataSeleccionada.usuarioId = this._loginService.Usuario.id;
    this._distribuidorExternoService.ActualizarProductoCategoria(dataSeleccionada).subscribe(data => {
      Alertas.ok("Eliminada correctamente!");
      this.ObtenerProductosCategoria();
    }, error => {
      Alertas.error("Ocurrió un error!");
    });
  }
  MostrarPopup(cerrarPopup: boolean = false) {
    if (cerrarPopup) {
      this._mostrarPopup = false;
      return;
    }
    this._mostrarPopup = true;
  }

  get gridBoxValue(): number[] {
    return this._gridBoxValue;
  }
  set gridBoxValue(value: number[]) {
    this._gridBoxValue = value || [];
  }
  set gridBoxValueSelect(value: DistribuidorExternoCategorias[]) {
    this._gridBoxValue = [];

    if (value != null) {
      value.forEach(data => {
        this._gridBoxValue.push(data.id);
      })
    }
  }
  loadingVisible = false;
  ObtenerImagenSeleccionadoDxFileUploader(files: any) {
    if (files.length === 0) {
      return;
    }
    if (this.fileDataUri == '') {
      return;
    }
    this.loadingVisible = true;
  
    let filesToUpload: File[] = files.value;
    const formData = new FormData();
    formData.append('file', filesToUpload[0], filesToUpload[0].name);

    this._distribuidorExternoService.SubirproductosExcel(formData, this._loginService.Usuario.id.toString()).subscribe(d => {
      Alertas.ok("Archivo subido correctamente!");
      this.fileDataUri = '';
      this.loadingVisible = false;
      this._mostrarPopupExcel = false;
    }, error => {
      this.loadingVisible = false;
      this._mostrarPopupExcel = false;
      this.fileDataUri = '';
      Alertas.error("Ocurrió un error!");

    });


  }
}
