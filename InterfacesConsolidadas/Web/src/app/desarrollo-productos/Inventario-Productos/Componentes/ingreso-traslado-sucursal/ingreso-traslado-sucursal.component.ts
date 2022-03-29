import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DxDataGridComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { LoginService } from '../../../../login/services/login.service';
import { InventarioProductosImpulsadoService } from '../../services/inventario-service.service';
import { IngresoInventarioSucursal } from '../../_Clases/ingreso-inventario-sucursal';
import { IngresoInventarioSucursalDetalle } from '../../_Clases/ingreso-inventario-sucursal-detalle';

@Component({
  selector: 'app-ingreso-traslado-sucursal',
  templateUrl: './ingreso-traslado-sucursal.component.html',
  styleUrls: ['./ingreso-traslado-sucursal.component.css']
})
export class IngresoTrasladoSucursalComponent implements OnInit {

  _formGroupIngreso: FormGroup;
  _sucursalSeleccionada: number = 0;
  dataSourceSucursales: DataSource;
  dataSourceProductos: IngresoInventarioSucursalDetalle[];

  dataSourceMoviemientos: DataSource;

  constructor(private _formBuilder: FormBuilder, private serviceInventarioProductoImpulsados: InventarioProductosImpulsadoService, private loginService: LoginService) { }

  ngOnInit() {
    this.crearForm();
  }
  crearForm(): void {
    this._formGroupIngreso = this._formBuilder.group({
      cantidadTotal: new FormControl({ value: 0, disabled: true }, Validators.compose([Validators.required, Validators.min(1)])),
      sucursalId: new FormControl(0, Validators.compose([Validators.required, Validators.min(1)])),
      movimientoProductoID: new FormControl({ value: 0, disabled: true }, Validators.compose([Validators.required, Validators.min(1)])),
      detalles: new FormControl([], Validators.required)
    })
    this.configurarDataSource();
    this.configurarDataSourceMovimiento();

  }
  ingresar(grid: DxDataGridComponent): void {

    let ingreso = this._formGroupIngreso.getRawValue() as IngresoInventarioSucursal
    if (this._formGroupIngreso.invalid) {
      if (ingreso.cantidadTotal == 0) {

        Alertas.error("No hay productos que Ingresar");
        return
      }


      Alertas.error("Información incompleta");
      return

    }
    Alertas.load("Guardando");
    ingreso.detalles = [];
    grid.instance.saveEditData();
    this.dataSourceProductos.forEach(p => {
      if (p.Cantidad > 0) {

        ingreso.detalles.push(p)
      }

    });

    ingreso.UsuarioIdCrea = this.loginService.Usuario.id;
    this.serviceInventarioProductoImpulsados.IngresarTrasladoSucursal(ingreso).subscribe(r => {
      Alertas.close();
      Alertas.ok("Guardado Correctamente")
      this.Limpiar();
    })
  }
  onRowUpdated(e: any): void {
    if (e.data.Cantidad > e.key.CantidadTraslado) {
      Alertas.warning("Advertencia", "La cantidad de ingreso no puede ser mayor a la trasladada.");
      e.key.Cantidad = 1;
    }else if(e.data.Cantidad<0){
      Alertas.warning("Advertencia", "La cantidad de salida no puede ser menor a 0.");
      e.key.Cantidad = 0;
    }

    this.calcular(e.component.getDataSource()._items)
  }
  overrideOnValueChanged(e: any) {
    console.log(e)
  }
  calcular(items: IngresoInventarioSucursalDetalle[]): void {
    let total: number = 0;
    items.forEach(p => {
      total += p.Cantidad;
    })
    this._formGroupIngreso.get("cantidadTotal").setValue(total);
  }
  Limpiar(): void {
    this._formGroupIngreso.reset({ sucursalId: 0, cantidadTotal: 0, detalles: [] })
    this.dataSourceProductos = [];
    this._formGroupIngreso.get("movimientoProductoID").disable();
  }
  onValueCha(e: any): void {
    this._sucursalSeleccionada = e.value;
    this._formGroupIngreso.get("movimientoProductoID").enable();
    this.configurarDataSourceMovimiento();
  }
  onValueChaTraslado(e: any): void {
    if (e.value == null) {
      return;
    }
    Alertas.load("Cargando traslado")

    this.serviceInventarioProductoImpulsados.ObtenerMovimientoProductoParaIngresoSucursal(e.value).subscribe(r => {
      Alertas.close();
      this.dataSourceProductos = r
      var cantidadTotal = 0;
      this.dataSourceProductos.forEach(p => {
        p.CantidadTraslado=p.Cantidad;
        cantidadTotal += p.Cantidad
      })
      this._formGroupIngreso.get("cantidadTotal").setValue(cantidadTotal)
      this._formGroupIngreso.get("detalles").setValue(r)
    })
  }
  configurarDataSource() {
    const customs = new CustomStore({
      load: this.buscarSucursales.bind(this),
      byKey: (key: any) => new Promise<any>((resolve, reject) => {
        resolve(null);
      }),
    });

    this.dataSourceSucursales = new DataSource({
      store: customs
    });

  }


  configurarDataSourceMovimiento() {
    const customsMovimiento = new CustomStore({
      load: this.buscarMovimientoProducto.bind(this),
      byKey: (key: any) => new Promise<any>((resolve, reject) => {
        resolve(null);
      }),
    });
    this.dataSourceMoviemientos = new DataSource({
      store: customsMovimiento
    });

  }
  buscarSucursales(options: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const textoBusqueda = this.dataSourceSucursales.searchValue();



      this.serviceInventarioProductoImpulsados.ObtenerSucursalesFiltradas(this.dataSourceSucursales.pageIndex().toString(), this.dataSourceSucursales.pageSize().toString(), textoBusqueda)
        .then(data => resolve(data));
    });
  }

  buscarMovimientoProducto(options: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const textoBusqueda = this.dataSourceMoviemientos.searchValue();



      this.serviceInventarioProductoImpulsados.ObtenerMovimientoFiltradosPorSucursal(this.dataSourceMoviemientos.pageIndex().toString(),
        this.dataSourceMoviemientos.pageSize().toString(),
        this._sucursalSeleccionada,
        textoBusqueda)
        .then(data => resolve(data));
    });
  }
}
