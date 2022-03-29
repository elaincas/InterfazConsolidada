import { CuponDigitalProducto } from './../../models/cuponDigitalProducto.model';
import { CuponDigitalTipo, CuponDigitalTipoEnum } from './../../models/cuponDigitalTipo.model';
import { CuponDigital } from './../../models/cuponDigital.model';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MercadeoService } from './../../services/mercadeo.service';
import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { Alertas } from '../../../helpers/notificaciones/notificaciones';
import { ICustomEventAsync } from '../../../productos/agrupador-productos/agrupador-productos';
import { IProducto } from '../../../productos/agrupador-productos/models/producto.model';
import { DxDateBoxComponent } from 'devextreme-angular';
import { helpers } from '../../../helpers/utils';

@Component({
  selector: 'app-cupon-digital-admin',
  templateUrl: './cupon-digital-admin.component.html',
  styleUrls: ['./cupon-digital-admin.component.css']
})
export class CuponDigitalAdminComponent implements OnInit {
  @ViewChild('dateDesde') private _dateDesde: DxDateBoxComponent;
  addPreviousProducts: EventEmitter<any> = new EventEmitter();
  limpiarControles: EventEmitter<any> = new EventEmitter();
  productosAgregados: any[] = [];
  productosEditados: CuponDigitalProducto[] = [];
  productosNuevos: CuponDigitalProducto[] = [];
  formGroupCupones: FormGroup;
  cuponesDigitales: CuponDigital[];
  cuponDigital: CuponDigital = new CuponDigital();
  cuponesDigitalesTipos: CuponDigitalTipo[];
  _mostrarPopup: boolean;
  productos: Array<any> = [];
  esEdicionDeCupon = false;
  defaultVisible = false;

  cuponDigitalTipoSeleccionado: CuponDigitalTipoEnum = CuponDigitalTipoEnum.Porcentaje;

  constructor(private _mercadeoService: MercadeoService,
    private _formBuilder: FormBuilder) {
    this.cargarFormGroup();
  }

  ngOnInit() {
    this.cargarVariables();
    this.cargarCupones();
  }

  cargarFormGroup(): void {
    this.formGroupCupones = this._formBuilder.group({
      dateDesde: new FormControl(new Date()),
      dateHasta: new FormControl(new Date()),
      selectCuponDigitalTipo: new FormControl(),
      txtObservaciones: new FormControl(),
      checkActivo: new FormControl(true),
      txtDescuento: new FormControl(0),
      txtCodigo: new FormControl(''),
      txtValorDescuento: new FormControl(0),
      checkPorIdentidad: new FormControl(false),
    });
  }

  cargarVariables(): void {
    this.obtenerTiposDeCupon();
  }

  obtenerTiposDeCupon(): void {
    this._mercadeoService.ObtenerTiposDeCupon().subscribe(data => {
      this.cuponesDigitalesTipos = data;
      this.formGroupCupones.get('selectCuponDigitalTipo').setValue(1);
    });
  }

  cargarCupones(): void {
    Alertas.load();
    this._mercadeoService.ObtenerCupones().subscribe(data => {
      Alertas.close();
      this.cuponesDigitales = data;
    }, error => {
      Alertas.showHttpResponse(error);
    });
  }


  cerrarPoup(): void {
    this._mostrarPopup = false;
  }

  agregarCupon(): void {
    Alertas.load();

    this.cuponDigital.activo = this.formGroupCupones.get('checkActivo').value;
    this.cuponDigital.fechaInicio = this.formGroupCupones.get('dateDesde').value;
    this.cuponDigital.fechaFin = this.formGroupCupones.get('dateHasta').value;
    this.cuponDigital.descripcion = this.formGroupCupones.get('txtObservaciones').value;
    this.cuponDigital.porcentajeDescuento = this.formGroupCupones.get('txtDescuento').value / 100.00;
    this.cuponDigital.cuponDigitalTipoId = this.formGroupCupones.get('selectCuponDigitalTipo').value;
    this.cuponDigital.codigo = this.formGroupCupones.get('txtCodigo').value;
    this.cuponDigital.porIdentidad = this.formGroupCupones.get('checkPorIdentidad').value
    this.cuponDigital.valorDescuento = this.formGroupCupones.get('txtValorDescuento').value

    this._mercadeoService.RegistrarCuponDigital(this.cuponDigital).subscribe(data => {
      Alertas.ok('', 'Cupón creado exitosamente.');
      this.limpiar();
      this.cargarCupones();
    }, error => {
      Alertas.showHttpResponse(error);
    });
  }

  onAddProducto(e: any): void {
    if (this.esEdicionDeCupon) {
      e.forEach(producto => {
        const productoCupon = new CuponDigitalProducto();
        productoCupon.activo = true;
        productoCupon.productoId = producto.productoId;
        productoCupon.cuponDigitalId = this.cuponDigital.id;
        this.productosNuevos.push(productoCupon);
      });
    } else {
      e.forEach(producto => {
        const productoCupon = new CuponDigitalProducto();
        productoCupon.activo = true;
        productoCupon.productoId = producto.productoId;

        if (this.cuponDigital.cuponDigitalProductos === undefined) {
          this.cuponDigital.cuponDigitalProductos = [];
        }
        this.cuponDigital.cuponDigitalProductos.push(productoCupon);
      });
    }
  }


  onDeleteProducto(e: any): void {
    let productoCupon = new CuponDigitalProducto();
    if (this.esEdicionDeCupon) {
      productoCupon = this.cuponDigital.cuponDigitalProductos.find(x => x.productoId === e.productoId);
      productoCupon.activo = false;
      this.productosEditados.push(productoCupon);
    } else {
      productoCupon.activo = true;
      productoCupon.productoId = e.productoId;
    }

    this.removerProducto(productoCupon);
  }

  removerProducto(producto: any): void {
    const index = this.cuponDigital.cuponDigitalProductos.indexOf(producto);
    if (index === -1) {
      return;
    }
    this.cuponDigital.cuponDigitalProductos.splice(index, 1);
  }

  limpiar(): void {
    this.cargarFormGroup();
    this.limpiarControles.emit();
    this.cuponDigital = new CuponDigital();
    this.cuponDigital.cuponDigitalProductos = [];
    this.esEdicionDeCupon = false;
  }

  editarCupon(e: any): void {
    helpers.setFocus(this._dateDesde);
    this.esEdicionDeCupon = true;
    this.cuponDigital = e;
    this.formGroupCupones.get('checkActivo').setValue(this.cuponDigital.activo);
    this.formGroupCupones.get('dateDesde').setValue(this.cuponDigital.fechaInicio);
    this.formGroupCupones.get('dateHasta').setValue(this.cuponDigital.fechaFin);
    this.formGroupCupones.get('txtObservaciones').setValue(this.cuponDigital.descripcion);
    this.formGroupCupones.get('txtDescuento').setValue(this.cuponDigital.porcentajeDescuento * 100);
    this.formGroupCupones.get('selectCuponDigitalTipo').setValue(this.cuponDigital.cuponDigitalTipoId);
    this.formGroupCupones.get('txtCodigo').setValue(this.cuponDigital.codigo);
    this.formGroupCupones.get('checkPorIdentidad').setValue(this.cuponDigital.porIdentidad)
    this.formGroupCupones.get('txtValorDescuento').setValue(this.cuponDigital.valorDescuento)

    this.productosNuevos = [];
    this.productosEditados = [];
    let productos = [];
    this.cuponDigital.cuponDigitalProductos.forEach(data => {
      productos.push({ productoId: data.productoId, producto: data.producto.descripcion });
    });

    this.addPreviousProducts.emit(productos);
  }

  actualizarCuponDigital(): void {
    Alertas.load();

    if (this.cuponDigital.cuponDigitalProductos.length === 0) {
      Alertas.info('', 'Los productos en el cupón son requeridos');
      return;
    }

    this.cuponDigital.activo = this.formGroupCupones.get('checkActivo').value;
    this.cuponDigital.fechaInicio = this.formGroupCupones.get('dateDesde').value;
    this.cuponDigital.fechaFin = this.formGroupCupones.get('dateHasta').value;
    this.cuponDigital.descripcion = this.formGroupCupones.get('txtObservaciones').value;
    this.cuponDigital.porcentajeDescuento = this.formGroupCupones.get('txtDescuento').value / 100.00;
    this.cuponDigital.cuponDigitalTipoId = this.formGroupCupones.get('selectCuponDigitalTipo').value;
    this.cuponDigital.codigo = this.formGroupCupones.get('txtCodigo').value;
    this.cuponDigital.porIdentidad = this.formGroupCupones.get('checkPorIdentidad').value
    this.cuponDigital.valorDescuento = this.formGroupCupones.get('txtValorDescuento').value

    this._mercadeoService.ActualizarCuponDigital(this.cuponDigital).subscribe(data => {
      this.actualizarProducto(this.productosEditados);
      this.agregarProductos(this.productosNuevos);
      this.limpiar();
      this.limpiarControles.emit();
      this.cargarCupones();
      Alertas.close();
    }, error => {
      Alertas.showHttpResponse(error);
    });
  }

  actualizarProducto(producto: CuponDigitalProducto[]): void {
    this._mercadeoService.ActulizarProducto(producto).subscribe(data => {
      this.cargarCupones();
    }, error => {
      Alertas.showHttpResponse(error);
    });
  }

  agregarProductos(productos: CuponDigitalProducto[]): void {
    this._mercadeoService.AgregarProductos(productos).subscribe(data => {
      this.cargarCupones();
    }, error => {
      Alertas.showHttpResponse(error);
    });
  }

  toggleDefault() {
    this.defaultVisible = !this.defaultVisible;
}

onValueTipoChanged(e: any){
  this.cuponDigitalTipoSeleccionado = e.value
}

}
