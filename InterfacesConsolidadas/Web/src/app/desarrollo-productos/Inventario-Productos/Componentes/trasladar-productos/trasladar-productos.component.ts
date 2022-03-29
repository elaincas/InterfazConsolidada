import { Component, OnInit } from '@angular/core';
import { TrasladarProductosService } from './trasladar-productos.service';
import { MovimientoDeProducto, MovimientoProductoDetalle } from '../../_Clases/MovimientoDeProducto'
import { InventarioProductosUbicacion, TipoTransaccion } from '../../_Clases/InventarioProductosUbicacion'
import { Finalidades } from '../../_Clases/Finalidades';
import { ProductoGrid, ProductosGridTraslados } from '../../_Clases/GridTrasladoProductos';
import { debugOutputAstAsTypeScript } from '@angular/compiler';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { LoginService } from '../../../../login/services/login.service';
import customStorage from 'devextreme/data/custom_store';
import dataSource from 'devextreme/data/data_source';
import { InventarioProductosImpulsadoService } from '../../services/inventario-service.service';
@Component({
  selector: 'app-trasladar-productos',
  templateUrl: './trasladar-productos.component.html',
  providers: [TrasladarProductosService]
})

export class TrasladarProductosComponent implements OnInit {

  movimientoTraladoDetalleLista: MovimientoProductoDetalle[];
  movimientoTraslado: MovimientoDeProducto;
  movimientosTrasladosEnviar: MovimientoDeProducto[];
  movimientoTrasladoDetalle: MovimientoProductoDetalle;
  tipoSalida: any[];
  productosGridAgregados: ProductosGridTraslados[];
  productoparaAgregarAGrid: ProductosGridTraslados;
  productoGrid: ProductoGrid;
  mensaje: string = "";
  sucursales: any[];
  cantidadTotal: number = 0;
  cantidadRestante: number = 0;
  sePuedeEnviar: boolean = true;
  dataSourceProductos: dataSource;
  dataSourceSucursales: dataSource;

  constructor(private service: TrasladarProductosService,private loginService: LoginService ,private serviceInventarioProductoImpulsados: InventarioProductosImpulsadoService) {
    this.productosGridAgregados = new Array<ProductosGridTraslados>();
    this.productoparaAgregarAGrid = new ProductosGridTraslados();
    this.productoGrid = new ProductoGrid();
    this.sucursales = new Array<any>();
    this.tipoSalida = new Array<any>();
    this.movimientoTraslado = new MovimientoDeProducto();
    this.movimientoTrasladoDetalle = new MovimientoProductoDetalle();
    this.movimientoTraladoDetalleLista = new Array<MovimientoProductoDetalle>();
    this.movimientosTrasladosEnviar = new Array<MovimientoDeProducto>();

  }

  ngOnInit() {
    this.service.ObtenerTransacciones().subscribe(data => {
      this.tipoSalida = data as any[];
    })

    this.service.ObtenerSucursales().subscribe(data => {
      this.sucursales = data as any[];
    })

    this.configurarDataSource();
  };

  Agregar() {
    var conteoEncontrado: number = 0;
    if (this.ValidacionGeneral()) {

      if (this.productosGridAgregados.length > 0) {

        this.productosGridAgregados.forEach(data => {

          if (data.SucursalCodigo == this.productoGrid.SucursalCod && data.ProductoCodigo == this.productoGrid.ProductoCod && data.TipoSalidaCodigo == this.productoGrid.IdTipoSalida) {
            Alertas.warning("Advertencia", "No se puede agregar este producto porque ya se encuentra agregado a la lista de productos a enviar con las mismas características descritas.")
            conteoEncontrado++;
          }
          if (data.SucursalCodigo != this.productoGrid.SucursalCod) {
            this.sucursales.forEach(datos => {
              if (datos.SucursalId == data.SucursalCodigo) {
                this.productoGrid.NombreSucursal = datos.Nombre;
                Alertas.warning("Advertencia", "No se puede agregar este producto a otra sucursal. Favor seguir con la misma sucursal de " + this.productoGrid.NombreSucursal + " o volver a iniciar el proceso")
                conteoEncontrado++;
              }
            });
          }
        });
        if (conteoEncontrado == 0)
          this.LLenarArregloProductosGridAgregados();
      }
      else {
        this.LLenarArregloProductosGridAgregados();
      }
      this.sePuedeEnviar = false;
    }
    else
      this.sePuedeEnviar = true;


  };

  RestarCantidad() {
    this.cantidadRestante = this.cantidadRestante - this.productoGrid.Cantidad;
  }

  LLenarArregloProductosGridAgregados() {

    this.productoparaAgregarAGrid.Cantidad = this.productoGrid.Cantidad
    this.productoparaAgregarAGrid.Costo = this.productoGrid.Costo;
    this.productoparaAgregarAGrid.NombreProducto = this.productoGrid.NombreProducto;
    this.productoparaAgregarAGrid.Precio = this.productoGrid.Precio
    this.productoparaAgregarAGrid.ProductoCodigo = this.productoGrid.ProductoCod
    this.productoparaAgregarAGrid.SucursalCodigo = this.productoGrid.SucursalCod;
    this.productoparaAgregarAGrid.TipoSalidaCodigo = this.productoGrid.IdTipoSalida
    //Llenar Entidad para enviar BackEnd
    //<-----------------
    this.movimientoTrasladoDetalle.Cantidad = this.productoparaAgregarAGrid.Cantidad
    this.movimientoTrasladoDetalle.ProductoId = this.productoparaAgregarAGrid.ProductoCodigo;
    this.movimientoTraslado.SucursalId = this.productoparaAgregarAGrid.SucursalCodigo;
    this.movimientoTrasladoDetalle.TipoSalida = this.productoparaAgregarAGrid.TipoSalidaCodigo;

    this.movimientoTraladoDetalleLista.push(this.movimientoTrasladoDetalle);

    this.movimientoTraslado.MovimientoSProductoDetalle = this.movimientoTraladoDetalleLista;

    this.movimientosTrasladosEnviar.push(this.movimientoTraslado);
    //------------------------>

    this.tipoSalida.forEach(datos => {
      if (datos.FinalidadInventarioId == this.productoGrid.IdTipoSalida) {
        {
          this.productoparaAgregarAGrid.TipoSalida = datos.FinalidadInventarioDescripcion;
        }
      }
    });

    this.sucursales.forEach(datos => {
      if (datos.SucursalId == this.productoGrid.SucursalCod) {
        this.productoparaAgregarAGrid.NombreSucursal = datos.Nombre;
      }
    });

    this.productosGridAgregados.push(this.productoparaAgregarAGrid)

    this.LimpiarVariables();

  }

  LimpiarVariables(alEnviar: boolean = false) {
    if (alEnviar) {
      this.movimientoTrasladoDetalle = new MovimientoProductoDetalle();
      this.productoparaAgregarAGrid = new ProductosGridTraslados();
      this.movimientoTraladoDetalleLista = new Array<MovimientoProductoDetalle>();
      this.movimientoTraslado = new MovimientoDeProducto();
      this.productosGridAgregados = new Array<ProductosGridTraslados>();
      this.movimientosTrasladosEnviar = new Array<MovimientoDeProducto>();
      this.productoGrid = new ProductoGrid();
      this.cantidadRestante = 0;
      this.cantidadTotal = 0;
    }
    else {
      this.movimientoTrasladoDetalle = new MovimientoProductoDetalle();
      this.productoparaAgregarAGrid = new ProductosGridTraslados();

      this.productoGrid = new ProductoGrid();
      this.cantidadRestante = 0;
      this.cantidadTotal = 0;
    }
  }


  BuscarProducto() {
    console.log(this.productoGrid.ProductoCod);
    this.service.ObtenerProductosInventarioId(this.productoGrid.ProductoCod).subscribe(data => {
      if (data.RespuestaMensaje != "OK") {
        Alertas.warning("Advertencia", data.RespuestaMensaje);
        return;
      }
      this.productoGrid.Precio = data.Precio
      this.cantidadTotal = data.Cantidad;
      this.cantidadRestante = data.Cantidad;
      this.productoGrid.Costo = data.Costo;
      this.productoGrid.NombreProducto = data.DescripcionProducto;
    },
      error => {
        Alertas.warning("Advertencia", "Producto no existe o no está activo")
      });
  }

  EliminarRegistroGrid(data) {
    this.productosGridAgregados.splice(data.rowIndex, 1);
    this.movimientoTraladoDetalleLista.splice(data.rowIndex, 1);
  }

  EnviarInformacion() {

    this.movimientoTraslado.UsuarioIdCrea = this.loginService.Usuario.id;
    this.movimientoTraslado.UsuarioEnvia = this.loginService.Usuario.id;
    this.service.AgregarTraslados(this.movimientoTraslado).subscribe(data => {
      Alertas.ok("Éxito");
      this.LimpiarVariables(true);
    },
      error => {
        Alertas.warning("Advertencia", error);
      }
    )
  };
  ValidacionGeneral(): boolean {
    if (this.productoGrid.ProductoCod == 0 || this.productoGrid.IdTipoSalida == undefined) {
      Alertas.warning("Advertencia", "Ingrese un producto.");
      return false;
    }
    if (this.productoGrid.Cantidad <= 0 || this.productoGrid.Cantidad == null) {
      Alertas.warning("Advertencia", "Ingrese una cantidad válida");
      return false;
    }
    if (this.cantidadRestante < 0) {
      Alertas.warning("Advertencia", "Excede el límite de la cantidad en inventario");
      this.cantidadRestante = this.cantidadTotal;
      this.movimientoTraladoDetalleLista.forEach(data => {
        this.cantidadRestante = this.cantidadRestante - data.Cantidad;
      })
      return false;
    }
    if (this.productoGrid.IdTipoSalida == 0 || this.productoGrid.IdTipoSalida == undefined) {
      Alertas.warning("Advertencia", "Ingrese un tipo de salida");
      return false;
    }
    if (this.productoGrid.SucursalCod == 0 || this.productoGrid.SucursalCod == undefined) {
      Alertas.warning("Advertencia", "Seleccione una sucursal");
      return false;
    }

    return true;
  }
  Enter(data) {
    if (data.event.keyCode == 13) {
      this.BuscarProducto();
    }
  }

  configurarDataSource() {

    const customp = new customStorage({
      load: this.buscarProductos.bind(this),
      byKey: (key: any) => new Promise<any>((resolve, reject) => {
        resolve(null);
      }),
    });

    this.dataSourceProductos = new dataSource({
      store: customp
    });

    const customs = new customStorage({
      load: this.buscarSucursales.bind(this),
      byKey: (key: any) => new Promise<any>((resolve, reject) => {
        resolve(null);
      }),
    });

    this.dataSourceSucursales = new dataSource({
      store: customs
    });
  }
  buscarProductos(options: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const textoBusqueda = this.dataSourceProductos.searchValue();



      this.serviceInventarioProductoImpulsados.ObtenerProductosConInventario( this.dataSourceProductos.pageIndex().toString(), this.dataSourceProductos.pageSize().toString(),textoBusqueda)
        .then(data => resolve(data));
    });
  }

  buscarSucursales(options: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const textoBusqueda = this.dataSourceSucursales.searchValue();



      this.serviceInventarioProductoImpulsados.ObtenerSucursalesFiltradas( this.dataSourceSucursales.pageIndex().toString(), this.dataSourceSucursales.pageSize().toString(),textoBusqueda)
        .then(data => resolve(data));
    });
  }
}
