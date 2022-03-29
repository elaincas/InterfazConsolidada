import { Proveedor } from './../../models/proveedor.model';
import { DxLookupComponent, DxCheckBoxComponent } from 'devextreme-angular';
import { Distribuidor } from './../../models/distribuidor.model';
import { FormGroup, FormBuilder, FormControlName, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { AdministracionPreciosService } from '../../administracionPrecios.service';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { Linea } from '../../models/linea.model';
import { helpers } from '../../../../helpers/utils';
import { Producto } from '../../models/producto.model';
import { SwalPosition } from '../../../../helpers/notificaciones/SwalPosition';

@Component({
  selector: 'app-administracion-productos',
  templateUrl: './administracion-productos.component.html',
  styleUrls: ['./administracion-productos.component.css']
})
export class AdministracionProductosComponent implements OnInit, AfterContentInit {


  formGroupProductos: FormGroup;
  distribuidores: Distribuidor[];
  proveedores: Proveedor[];
  lineas: Linea[];
  productos: Producto[];
  @ViewChild('lookupProveedor') private _lookupProveedor: DxLookupComponent;
  @ViewChild('lookupLinea') private _lookupLinea: DxLookupComponent;
  @ViewChild('chkSeleccionarTodos') private _chkSeleccionarTodos: DxCheckBoxComponent;


  constructor(private _formBuilder: FormBuilder,
    private _administracionDePreciosService: AdministracionPreciosService) {

  }
  ngOnInit() {
  }
  ngAfterContentInit(): void {
    this.cargarControles();
  }

  cargarControles(): void {
    Alertas.load();
    this.formGroupProductos = this._formBuilder.group({
      lookupProveedor: new FormControl(),
      lookupLinea: new FormControl(),
      txtDescripcionProduco: new FormControl()
    });

    this.cargarProveedores();
    this.cargarLineas();
    Alertas.close();
  }

  cargarDistribuidores(): void {
    this._administracionDePreciosService.ObtenerDistribuidores().subscribe(data => {
      this.distribuidores = data;

    });
  }

  onValueChangedSeleccionarTodos(e: any): void {

    if (this.productos === null || this.productos === undefined) {
      this._chkSeleccionarTodos.value = false;
      return;
    }

    if (this.productos.length === 0) {
      this._chkSeleccionarTodos.value = false;
      return;
    }

    if (e.value === false) {
      return;
    }

    Alertas.question('', `¿Desea actualizar el total de ${this.productos.length} productos?`).then(x => {
      this.productos.forEach(producto => {
        producto.actualizarPrecioDeMargen = e.value;
      });

      Alertas.load();
      this._administracionDePreciosService.RegistrarListadDeProductoParaActualizarPrecio(this.productos).subscribe(data => {
        Alertas.close();
        Alertas.ok('', 'Productos actualizados exitosamente');
      }, error => {
        Alertas.showHttpResponse(error);
      });

    }).catch(data => {
      this._chkSeleccionarTodos.value = false;
    });
  }

  cargarProveedores(): void {
    this._administracionDePreciosService.ObtenerProveedores().subscribe(data => {
      this.proveedores = data;
      this._lookupProveedor.value = '0';
    }, error => {
      Alertas.showHttpResponse(error);
    });
  }

  cargarLineas(): void {
    this._administracionDePreciosService.ObtenerLineas().subscribe(data => {
      this.lineas = data;
      this._lookupLinea.value = '0';
    });
  }

  sonFiltrosValidos(): boolean {

    if (helpers.isNullEmptyOrWhiteSpace(this._lookupProveedor.value)) {
      this._lookupProveedor.isValid = false;
      return false;
    }

    this._lookupProveedor.isValid = true;

    if (helpers.isNullEmptyOrWhiteSpace(this._lookupLinea.value)) {
      this._lookupLinea.isValid = false;
      return false;
    }

    var descripcion = this.formGroupProductos.get('txtDescripcionProduco').value;
    if (helpers.isNullEmptyOrWhiteSpace(descripcion)) {
      this.formGroupProductos.get('txtDescripcionProduco').setValue(null);
    }


    return true;
  }

  cargarProductos(): void {
    Alertas.load();

    if (!this.sonFiltrosValidos()) {
      Alertas.close();
      return;
    }

    this._administracionDePreciosService.ObtenerProductos(this._lookupProveedor.value,
      this._lookupLinea.value,
      this.formGroupProductos.get('txtDescripcionProduco').value).subscribe(data => {
        Alertas.close();
        console.log(data);

        this.productos = data;
        this._chkSeleccionarTodos.value = false;
      }, error => {
        Alertas.close();
        Alertas.showHttpResponse(error);
      });
  }

  onRowUpdated(e: any): void {
    const producto = this.productos.find(x => x.id === e.key);
    this.registrarProductoParaActualizarPrecio(producto);
  }

  registrarProductoParaActualizarPrecio(producto: Producto): void {
    Alertas.load();
    this._administracionDePreciosService.RegistrarProductoParaActualizarPrecio(producto).subscribe(data => {
      Alertas.close();
      Alertas.ok('', `Producto Actualizado ${producto.descripcion}`, true, SwalPosition.topright);
    }, error => {
      Alertas.showHttpResponse(error);
    });
  }


}
