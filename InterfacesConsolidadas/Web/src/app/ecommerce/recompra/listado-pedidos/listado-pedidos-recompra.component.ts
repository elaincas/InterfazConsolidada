import { LoginService } from './../../../login/services/login.service';
import CustomStore from "devextreme/data/custom_store";
import {
  FormReportePedidos,
  listaPedidoReorderEstados,
  PedidoReorderEstadoEnum,
} from "./../_models/FormReportePedidos";
import { ProductoInventario } from "./../_models/ProductoInventario";
import {
  CambiarTipoPagoPedidoReorder,
  tiposDePago,
  PagoTipoEnum,
} from "./../_models/CambiarTipoPagoPedidoReorder";
import { forEach } from "@angular/router/src/utils/collection";
import { Component, OnInit, ViewChild, AfterContentInit } from "@angular/core";
import { Alertas } from "../../../helpers/notificaciones/notificaciones";
import { PedidosRecompraService } from "../_services/pedidos-recompra.service";
import { GenerarPedidosRecompra } from "../_models/GenerarPedidosRecompra";
import { CancelarPedidosRecompra } from "../_models/CancelarPedidosRecompra";
import { PosponerPedidosRecompra } from "../_models/PosponerPedidosRecompra";
import { MaestrosFarmaciaService } from "../../../maestros/maestros-farmacia.service";
import { CambiarLugarPedidosRecompra } from "../_models/CambiarLugarPedidosRecompra";
import { DxRadioGroupComponent, DxDataGridComponent } from "devextreme-angular";
import DataSource from "devextreme/data/data_source";
import { HttpParams } from "@angular/common/http";
import { PedidoProductoDetalle } from "../_models/PedidoProductoDetalle";
import { Empresas } from "../../../shared/Empresas/enum-empresas";
import { listadoEmpresas } from "../../../shared/Empresas/listado-empresas";
import { ExcelImportExportService } from "../../../productos/administracion-precios/excel-import-export.service";
import { helpers } from "../../../helpers/utils";

@Component({
  selector: "recompra-listado-pedido",
  templateUrl: "./listado-pedidos-recompra.component.html",
  styleUrls: ["./listado-pedidos-recompra.component.css"],
  providers: [PedidosRecompraService, MaestrosFarmaciaService],
})
export class ListadoPedidosRecompraComponent
  implements OnInit, AfterContentInit {
  @ViewChild("radioGroup") eventRadioGroup: DxRadioGroupComponent;
  @ViewChild("dataGridPedidos") dataGrid: DxDataGridComponent;

  // Variables de control
  filtros: string[];
  filtro: string;
  now: Date = new Date();
  pedidosFecha: any[];
  pedidos: any[];
  pagoTipoOptions = tiposDePago;
  pedidoReorderEstadoOptions = listaPedidoReorderEstados;
  listadoEmpresas: any;
  _mostrarPopup: boolean = false;
  elegirSucursal: boolean;
  elegirDireccionUsuario: boolean;
  verInventario: boolean;
  sucursales: any[];
  direccionesUsuario: any[];
  pedidoSucursalConfiguracion: any = {
    usuarioId: 0,
    productos: [],
    sucursalId: 0,
  };
  pedidoDomicilioConfiguracion: any = {
    usuarioId: 0,
    productos: [],
    direccionId: 0,
  };
  usuariosDataSource: DataSource;

  // Variables persistentes
  tipoEnvioSeleccionado: number;
  tipoDestinatarioSeleccionado: number;
  notificacionDestinatarioTema: string;
  notificacionTitulo: string;
  notificacionContenido: string;
  formReportePedidos: FormReportePedidos;
  esEnvioDePrueba: boolean = true;

  fechaPosponerPedido: Date = this.now;
  observaciones: string;
  fechaMinima: Date = this.now;
  datePopupVisible: boolean = false;
  detallePopupVisible = false;
  tipoPagoPopupVisible = false;
  agregarProductoPopupVisible = false;
  clientePedidoPosponer: number;
  productosPosponer: any[];
  cambiarTipoPagoReorder: CambiarTipoPagoPedidoReorder;
  productosPedidoInventario: ProductoInventario[];
  tituloPopupInventario: string;
  productoDetalle: PedidoProductoDetalle;
  clienteSeleccionadoParaAgregarProducto: any;

  pedidoReorderEstadoSeleccionado: PedidoReorderEstadoEnum = null;

  constructor(
    private pedidosRecompraService: PedidosRecompraService,
    private maestrosFarmaciaRecompraService: MaestrosFarmaciaService,
    private _excelservice: ExcelImportExportService,
    private _loginService: LoginService
  ) {
    this.listadoEmpresas = listadoEmpresas;
  }

  ngAfterContentInit(): void { }

  ngOnInit() {
    this.Limpiar();
    this.cargarOpcionesDeFiltros();
    this.maestrosFarmaciaRecompraService.ObtenerSucursales().subscribe(
      (r) => {
        this.sucursales = r;
      },
      (error) => {
        Alertas.close();
        Alertas.showHttpResponse(error, "¡Error!", false);
      }
    );
    this.usuariosDataSource = this.ObtenerDataSourceDeUsuarios();
  }

  onValueChangedRadioGroup(e: any) {
    this.filtro = e.value;
    this.preprarPedido();
  }

  cargarOpcionesDeFiltros(): void {
    this.filtros = ["TODOS", "A DOMICILIO", "RECOGER EN SUCURSAL"];
    this.filtro = this.filtros[0];
  }

  validarDatosDePedido(): boolean {

    if (helpers.isNullEmptyOrWhiteSpace(this.observaciones)) {
      Alertas.warning('', 'Las observaciones son requeridas');
      return false;
    }

    return true;
  }

  GuardarPosponerPedidos() {

    if (!this.validarDatosDePedido()) {
      return;
    }

    if (this.clientePedidoPosponer == 0) {
      Alertas.question("", `¿Desea posponer todos los clientes?`, "Sí", "No").then(() => {
        Alertas.load();
        let observacionesConUsuario = this.observaciones + ' Usuario Pospone Pedido ID: ' + this._loginService.Usuario.id
        const pedidosDto = this.pedidosFecha.map(pe => {
          let productos = [];

          pe.pedidos.forEach(p => {
            p.productos.forEach(pro => {
              productos.push(pro.productoId);
            });
          });

          return new PosponerPedidosRecompra(
            pe.id,
            productos,
            this.fechaPosponerPedido,
            observacionesConUsuario
          );
        })

        this.pedidosRecompraService.PosponerPedidosClientes(pedidosDto).subscribe(
          (r) => {
            setTimeout(() => {
              Alertas.close();
              this.CargarPedidos();
            }, 5000);
            Alertas.ok("¡Éxito!", r.mensaje);
          },
          (error) => {
            Alertas.close();
            Alertas.showHttpResponse(error, "¡Error!", false);
          }
        );
      });
    } else {
      Alertas.question("", `¿Desea posponer el pedido?`, "Sí", "No").then(() => {
        Alertas.load();
        let observacionesConUsuario = this.observaciones + ' Usuario Pospone Pedido ID: ' + this._loginService.Usuario.id
        var pedidosDto = new PosponerPedidosRecompra(
          this.clientePedidoPosponer,
          this.productosPosponer,
          this.fechaPosponerPedido,
          observacionesConUsuario
        );
        this.pedidosRecompraService.PosponerPedidos(pedidosDto).subscribe(
          (r) => {
            setTimeout(() => {
              Alertas.close();
              this.CargarPedidos();
            }, 5000);
            Alertas.ok("¡Éxito!", r.mensaje);
          },
          (error) => {
            Alertas.close();
            Alertas.showHttpResponse(error, "¡Error!", false);
          }
        );
      });
    }

  }

  GuardarCambioTipoDePagoPedido() {
    Alertas.question("", `¿Desea cambiar el tipo de pago?`, "Sí", "No").then(
      () => {
        Alertas.load();

        this.pedidosRecompraService
          .CambiarTipoDePagoPedido(this.cambiarTipoPagoReorder)
          .subscribe(
            (response) => {
              setTimeout(() => {
                Alertas.close();
                this.CargarPedidos();
              }, 4000);
              Alertas.ok("¡Éxito!", response.mensaje);
            },
            (error) => {
              Alertas.close();
              Alertas.showHttpResponse(error, "¡Error!", false);
            }
          );
      }
    );
  }

  PosponerPedidoTodos(cliente: number, productos: any[]) {
    this.fechaMinima = this.formReportePedidos.fechaPedido;
    this.observaciones = "";
    this.fechaPosponerPedido = this.formReportePedidos.fechaPedido;
    this.clientePedidoPosponer = cliente;
    this.productosPosponer = productos.map((p) => p.productoId);
    this.datePopupVisible = true;
  }

  PosponerClientes() {
    this.fechaMinima = this.formReportePedidos.fechaPedido;
    this.observaciones = "";
    this.clientePedidoPosponer = 0;
    this.fechaPosponerPedido = this.formReportePedidos.fechaPedido;
    this.datePopupVisible = true;
  }

  preprarPedido(): void {
    Alertas.load();
    this.pedidosFecha = [];
    if (this.filtro.includes("TODOS")) {
      this.pedidosFecha = this.pedidos;
    } else if (this.filtro.includes("RECOGER")) {
      this.pedidosFecha = this.prepararFiltros(1);
    } else if (this.filtro.includes("DOMICILIO")) {
      this.pedidosFecha = this.prepararFiltros(2);
    }
    Alertas.close();
  }

  mensajeDescripcionEtiqueta(tipo: string) {
    let mensaje = '';
    if (tipo == 'acepto-terminos') {
      mensaje = 'El cliente aceptó los términos de los cobros automáticos y configuró el pago en línea';
    }
    else if (tipo == 'no-acepto-terminos') {
      mensaje = 'El cliente no aceptó los términos de los cobros automáticos/pago en línea';
    }
    else if (tipo == 'no-acepto-terminos-parcial') {
      mensaje = 'El cliente no aceptó los términos de los cobros automáticos/pago en línea en algunos productos';
    }
    else if (tipo == 'hay-algun-documento') {
      mensaje = 'Uno o más productos tienen receta';
    }
    else if (tipo == 'hay-documento-producto') {
      mensaje = 'Este producto tiene receta';
    }
    Alertas.info("Información", mensaje);
  }

  prepararFiltros(tipo: number): any[] {
    let _pedidosFecha = [];
    this.pedidos.forEach((pedido) => {
      const tempPedidoDetlle = pedido.pedidos.filter(
        (x) => x.tipoPedido === tipo
      );
      const tempPedido = { ...pedido };
      tempPedido.pedidos = tempPedidoDetlle;

      if (tempPedidoDetlle.length > 0) {
        _pedidosFecha.push(tempPedido);
      }
    });

    return _pedidosFecha;
  }

  CancelarPedidoTodos(cliente: number, productos: any[]) {
    Alertas.question("", `¿Desea cancelar el pedido?`, "Sí", "No").then(() => {
      Alertas.close();
      Alertas.inputModal("Observaciones", "").then((data) => {
        Alertas.load();
        var pedidosDto = new CancelarPedidosRecompra(
          cliente,
          productos.map((p) => p.productoId),
          data
        );
        this.pedidosRecompraService.CancelarPedidos(pedidosDto).subscribe(
          (r) => {
            setTimeout(() => {
              Alertas.close();
              this.CargarPedidos();
            }, 5000);
            Alertas.ok("¡Éxito!", r.mensaje);
          },
          (error) => {
            Alertas.close();
            Alertas.showHttpResponse(error, "¡Error!", false);
          }
        );
      });

      return;
    });
  }

  PosponerPedido(cliente: number, producto: any) {
    this.PosponerPedidoTodos(cliente, [producto]);
  }
  CancelarPedido(cliente: number, producto: any) {
    this.CancelarPedidoTodos(cliente, [producto]);
  }

  test() {
    console.log(this.formReportePedidos);
  }

  CargarPedidos() {
    Alertas.load();
    this.pedidosRecompraService
      .ObtenerPedidos(this.formReportePedidos)
      .subscribe(
        (pedidos: any) => {
          this.pedidos = pedidos;
          this.eventRadioGroup.instance.option("value", this.filtros[0]);
          this.pedidoReorderEstadoSeleccionado = this.formReportePedidos.pedidoReorderEstado;
          this.preprarPedido();
          Alertas.close();
        },
        (error) => {
          Alertas.close();
          Alertas.showHttpResponse(error, "¡Error!", false);
        }
      );
  }
  ExportarPedidos(): void {
    var arrayExcel: any[] = [];
    var nombreExcel = `${this.formReportePedidos.fechaPedido.getFullYear()}_${this.formReportePedidos.fechaPedido.getMonth() + 1}_${this.formReportePedidos.fechaPedido.getDate()}.xlsx`
    arrayExcel.push(['Código', 'No. Identificacion', 'Nombre  ', 'Teléfono', 'Total'])
    this.pedidos.forEach(p => {
      arrayExcel.push([p.identificador, p.clienteIdentificacion, p.clienteNombre, p.clienteTelefono, p.total])

    })
    this._excelservice.ExportDataToExcel(arrayExcel, nombreExcel)

  }
  RegistrarPedido(cliente: number, productos: any[]) {
    if (!this.ValidarDatos()) {
      return;
    }

    Alertas.question("", `¿Desea generar los pedidos?`).then(() => {
      Alertas.load();
      var generarPedidosDto = new GenerarPedidosRecompra(cliente, productos);

      this.pedidosRecompraService.GenerarPedidos(generarPedidosDto).subscribe(
        (r) => {
          var response = r;
          console.log(r);
          this.pedidosRecompraService
            .ObtenerMensajeDePedidosDeRecompra(
              generarPedidosDto.PedidosRecompra
            )
            .subscribe(
              (data) => {
                Alertas.okAsinc(
                  "¡Éxito!",
                  response.data.mensaje + " . " + data.mensaje
                )
                  .then((d) => {
                    this.recargarPedidos();
                  })
                  .catch((r) => this.recargarPedidos());
              },
              (error) => {
                Alertas.okAsinc("¡Éxito!", response.data.mensaje)
                  .then((d) => this.recargarPedidos)
                  .catch((d) => this.recargarPedidos());
              }
            );
        },
        (error) => {
          Alertas.close();
          Alertas.showHttpResponse(error, "¡Error!", false);
        }
      );
    });
  }

  MostrarPopupCambiarTipoDePago(productos: any[]) {
    this.tipoPagoPopupVisible = true;
    this.cambiarTipoPagoReorder.ProductosReorderId = productos.map(
      (producto) => producto.productoReorderId
    );
    this.cambiarTipoPagoReorder.NuevoPagoTipo =
      productos[0].tipoDePago === undefined
        ? PagoTipoEnum.Efectivo
        : productos[0].tipoDePago;
  }

  MostrarPopupDetallePedido(producto: any) {
    this.detallePopupVisible = true;
    this.productoDetalle = { ...producto };
    const tipoPago = this.pagoTipoOptions.find(
      (x) => <number>x.id === producto.tipoDePago
    );
    this.productoDetalle.tipoDePago = tipoPago
      ? tipoPago.pago
      : "No seleccionado";
  }

  MostrarPopupAgregarProductoAlPedido(clienteId: number, pedido: any) {
    this.agregarProductoPopupVisible = true;
    this.clienteSeleccionadoParaAgregarProducto = { clienteId, pedido };
  }

  ObtenerTipoDePagoDeLosProductos(productos: any[]): string[] {
    const tiposPago = productos.map((producto) => producto.tipoDePago);
    const tiposPagoUnique = Array.from(new Set(tiposPago));

    return tiposPagoUnique.map((tipoPago) => {
      let tipoPagoNombre = "";

      switch (tipoPago) {
        case PagoTipoEnum.Efectivo:
          tipoPagoNombre = "Efectivo";
          break;
        case PagoTipoEnum.EfectivoTarjeta:
          tipoPagoNombre = "Efectivo y tarjeta de credito";
          break;
        case PagoTipoEnum.PagoConTarjetaEnLinea:
          tipoPagoNombre = "En Linea";
          break;
        case PagoTipoEnum.TarjetaCredito:
          tipoPagoNombre = "Tarjeta de credito";
          break;
        default:
          tipoPagoNombre = "No seleccionado";
          break;
      }

      return tipoPagoNombre;
    });
  }

  recargarPedidos(): void {
    setTimeout(() => {
      Alertas.close();
      this.CargarPedidos();
    }, 1000);
  }

  MostrarPopup(esElegirSucursal: boolean = true) {
    this.elegirSucursal = esElegirSucursal;
    this.elegirDireccionUsuario = !esElegirSucursal;
    this._mostrarPopup = true;
  }

  CerrarPopup() {
    this._mostrarPopup = false;
  }

  ActualizarLugarPedido() {
    if (!this.ValidarDatos()) {
      return;
    }
    this._mostrarPopup = false;

    // Alertas.question('', `¿Desea actualizar el lugar de pedido?`).then(() => {

    let usuarioId = this.elegirSucursal
      ? this.pedidoSucursalConfiguracion.usuarioId
      : this.pedidoDomicilioConfiguracion.usuarioId;
    let productos = this.elegirSucursal
      ? this.pedidoSucursalConfiguracion.productos
      : this.pedidoDomicilioConfiguracion.productos;
    let lugarEntregaId = this.elegirSucursal
      ? this.pedidoSucursalConfiguracion.sucursalId
      : this.pedidoDomicilioConfiguracion.direccionId;
    let tipoPedido = this.elegirSucursal ? 1 : 2;
    productos = productos.map((p) => p.productoId);

    Alertas.load();
    var pedidosDto = new CambiarLugarPedidosRecompra(
      usuarioId,
      productos,
      tipoPedido,
      lugarEntregaId
    );
    this.pedidosRecompraService.CambiarLugarPedidos(pedidosDto).subscribe(
      (r) => {
        setTimeout(() => {
          Alertas.close();
          this.CargarPedidos();
        }, 5000);
        Alertas.ok("¡Éxito!", r.mensaje);
      },
      (error) => {
        Alertas.close();
        Alertas.showHttpResponse(error, "¡Error!", false);
      }
    );
    // });
  }

  ElegirDireccionPedido(cliente: number, productos: any[]) {
    Alertas.load();
    this.maestrosFarmaciaRecompraService
      .ObtenerDireccionesDeUsuarioEcommerce(cliente)
      .subscribe(
        (r) => {
          Alertas.close();
          this.direccionesUsuario = r;
          this.pedidoDomicilioConfiguracion.usuarioId = cliente;
          this.pedidoDomicilioConfiguracion.productos = productos;
        },
        (error) => {
          Alertas.close();
          Alertas.showHttpResponse(error, "¡Error!", false);
        }
      );
    this.MostrarPopup(false);
  }

  ElegirSucursalPedido(cliente: number, productos: any[]) {
    this.pedidoSucursalConfiguracion.usuarioId = cliente;
    this.pedidoSucursalConfiguracion.productos = productos;
    this.MostrarPopup(true);
  }

  VerDocumentos(enlaces) {
    if (!enlaces || enlaces.length < 1) {
      Alertas.warning("Aviso", "No hay documentos para mostrar");
      return;
    }

    let enlace = `https://webmail.farmaciasiman.com/Farmacia-Ecommerce-General-Api/media${enlaces[0]}`;

    window.open(enlace, "visorDocumento", "config='toolbar=no, menubar=no,scrollbars=no,resizable=no,location=no,directories=no,status=no'");
  }

  MostrarInventarioEnPopup(pedido): void {
    const productosId = pedido.productos.map((p) => p.productoId);

    Alertas.load();

    let observable;
    if (pedido.tipoPedido === 1) {
      observable = this.pedidosRecompraService.ObtenerInventarioDeProductosPorSucursal(
        pedido.lugarEntregaId,
        productosId
      );
    } else {
      observable = this.pedidosRecompraService.ObtenerInventarioDeProductosPorColonia(
        pedido.lugarEntregaId,
        productosId
      );
    }

    observable.subscribe(
      (r) => {
        Alertas.close();
        this.productosPedidoInventario = r;
        this.tituloPopupInventario = this.sucursales.find(
          (x) => x.codigo === r[0].sucursalId
        ).nombrePublico;
        this.verInventario = true;
      },
      (error) => {
        Alertas.close();
        Alertas.showHttpResponse(error, "¡Error!", false);
      }
    );
  }

  ValidarDatos(): boolean {
    return true;
  }

  ObtenerDataSourceDeUsuarios(): DataSource {
    const isNotEmpty = (value: any): boolean =>
      value !== undefined && value !== null && value !== "";

    return new DataSource({
      store: new CustomStore({
        key: "usuarioId",
        load: (loadOptions) => {
          let params = new HttpParams();
          ["searchValue"].forEach((i) => {
            if (i in loadOptions && isNotEmpty(loadOptions[i])) {
              params = params.set(i, loadOptions[i]);
            }
          });
          return this.pedidosRecompraService
            .BuscarClientes(params)
            .toPromise()
            .then((r) => r.slice(0, 10));
        },
      }),
    });
  }

  onRowPrepared(e: any) {
    let llamadaRealizada = false;
    let llamadaPerdida = false;

    if (!e.data || !e.data.hasOwnProperty("pedidos")) {
      return;
    }

    for (const pedido of e.data.pedidos) {
      for (const producto of pedido.productos) {
        if (!producto.observaciones) {
          continue;
        }
        llamadaRealizada = producto.observaciones.includes(
          "~Llamada contestada~"
        );
        llamadaPerdida = producto.observaciones.includes("~Llamada perdida~");
        if (llamadaRealizada || llamadaPerdida) {
          break;
        }
      }
      if (llamadaRealizada || llamadaPerdida) {
        break;
      }
    }

    // if (e.rowType === "data") {
    //   if (llamadaRealizada) {
    //     e.rowElement.style.backgroundColor = "#C7DFC9";
    //     e.rowElement.className = e.rowElement.className.replace(
    //       "dx-row-alt",
    //       ""
    //     );
    //   }
    //   if (llamadaPerdida) {
    //     e.rowElement.style.backgroundColor = "#DFCCC7";
    //     e.rowElement.className = e.rowElement.className.replace(
    //       "dx-row-alt",
    //       ""
    //     );
    //   }
    // }
  }

  cambiarEstadoLlamada(llamadaContestada: boolean, cliente: any) {
    for (const pedido of cliente.pedidos) {
      for (const producto of pedido.productos) {
        if (producto.observaciones) {
          if (
            llamadaContestada &&
            producto.observaciones.includes("~Llamada perdida~")
          ) {
            producto.observaciones = producto.observaciones.replace(
              "~Llamada perdida~",
              "~Llamada contestada~"
            );
          } else if (
            !llamadaContestada &&
            producto.observaciones.includes("~Llamada contestada~")
          ) {
            producto.observaciones = producto.observaciones.replace(
              "~Llamada contestada~",
              "~Llamada perdida~"
            );
          } else if (!producto.observaciones.includes("~Llamada")) {
            producto.observaciones =
              (llamadaContestada
                ? "~Llamada contestada~"
                : "~Llamada perdida~") + producto.observaciones;
          }
        } else {
          producto.observaciones = llamadaContestada
            ? "~Llamada contestada~"
            : "~Llamada perdida~";
        }
        this.pedidosRecompraService
          .EditarObservacionesDePedido(producto)
          .subscribe();
      }
    }

    this.dataGrid.instance.refresh();
  }

  Limpiar() {
    this.now = new Date();

    this.esEnvioDePrueba = true;
    this.tipoDestinatarioSeleccionado = 0;
    this.tipoEnvioSeleccionado = 0;
    this.notificacionDestinatarioTema = null;
    this.notificacionTitulo = "";
    this.notificacionContenido = "";

    this.fechaPosponerPedido = this.now;
    this.datePopupVisible = false;
    this.clientePedidoPosponer = 0;
    this.productosPosponer = [];
    this.productosPedidoInventario = [];
    this.cambiarTipoPagoReorder = new CambiarTipoPagoPedidoReorder(
      [],
      PagoTipoEnum.Efectivo
    );
    this.formReportePedidos = new FormReportePedidos(
      null,
      this.now,
      PedidoReorderEstadoEnum.SinConfirmar,
      Empresas.Farmacia
    );
  }
}

enum TipoEtiqueta {
  LlamadaContestada,
  LlamadaPerdida,
  ClienteAceptaTerminos,
  TieneRecetaTerceraEdad,
  TieneDocumentos
}
