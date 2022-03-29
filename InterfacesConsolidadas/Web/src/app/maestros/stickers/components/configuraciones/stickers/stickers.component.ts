import { Component, EventEmitter, OnInit, ViewChild } from "@angular/core";
import { DxTabsComponent } from "devextreme-angular";
import { Forms } from "../../../../../helpers/forms";
import {
  Alertas,
  Notificaciones,
} from "../../../../../helpers/notificaciones/notificaciones";
import { RespuestaTipo } from "../../../helpers/respuestav2";
import { helpers } from "../../../../../helpers/utils";
import { LoginService } from "../../../../../login/services/login.service";
import { ProductLookup } from "../../../../../productos/product-lookup/models/product-lookup.model";
import { MensajesGenericosStickers } from "../../../helpers/mensajes";
import { StickerTipos } from "../../../models/srickerTipo.enum";
import { StickerConfiguracion } from "../../../models/stickerConfiguracion.model";
import { StickerTipo } from "../../../models/stickerTipo.model";
import { CatalogosService } from "../../../services/catalogos.service";
import {
  Tab,
  tabsSticker,
  TabStickerService,
  TabStickerTipo,
} from "../../../services/tabSticker.service";
import { StickerConfiguracionImagen } from "../../../models/stickerImagen";
import { StickerConfiguracionProducto } from "../../../models/stickerConfiguracionProducto.model";
import { StickerConfiguracionSucursal } from "../../../models/stickerSucursal.model";
import { StickersService } from "../../../services/stickers.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ProductoService } from "../../../../../productos/producto.service";
import swal from "sweetalert2";
import { SwalPosition } from "../../../../../helpers/notificaciones/SwalPosition";
import { MaestrosServices } from "../../../../../entrenamiento/reembolsos/services/maestros/maestrosServices.service";
import { Lookup } from "../../../../../productos/informacion-productos/models/lookup.model";
import { StickersTiposDeCanje } from "../../../models/stickersTiposDeCanje.enum";

@Component({
  selector: "app-stickers",
  templateUrl: "./stickers.component.html",
  styleUrls: ["./stickers.component.scss"],
})
export class StickersComponent implements OnInit {
  mensajeLoader: string;
  productoSeleccionadoId: string;
  productoIdAnterior: string;

  cargandoVisible: boolean;
  productoValido: boolean;
  mostrarMensajeProductoValido: boolean;
  elProductoEsReadonly: boolean;
  readOnlyAgregar: boolean;

  minDate: Date;

  tabs: Tab<TabStickerTipo>[];
  tabTipo = TabStickerTipo;
  mensaje = MensajesGenericosStickers;
  modo: Forms.Modo = Forms.Modo.Agregar;
  modos = Forms.Modo;
  componente: TabStickerTipo;
  formDataStickerConfiguracion: StickerConfiguracion;
  producto: ProductLookup;
  productoSeleccionado: any;
  stickerTipos: StickerTipo[];
  tiposDeCanjesDeStickers: Lookup[];
  stickerTipo = StickerTipos;
  tipoDeCanje = StickersTiposDeCanje;
  onTabChange: EventEmitter<void>;
  onSucursalesReady: EventEmitter<void>;
  lookupProductosEditTemp: ProductLookup[];
  listadoSucursales: any[];

  indexTab: number;
  indexTabAnterior: number;

  constructor(
    private stickerTabs: TabStickerService,
    private _loginService: LoginService,
    private _catalogosService: CatalogosService,
    private _stickersService: StickersService,
    private route: ActivatedRoute,
    private _productoService: ProductoService,
    private _maestrosServices: MaestrosServices,
    private router: Router
  ) {
    this.cargandoVisible = true;
    this.productoValido = true;
    this.mensajeLoader = helpers.cargando;
    this.readOnlyAgregar = false;
    this.componente = TabStickerTipo.Sticker;
    this.indexTab = TabStickerTipo.Sticker;
    this.indexTabAnterior = helpers.VALOR_POR_DEFECTO_ID;

    this.elProductoEsReadonly = false;
    this.configurarFormulario();
    this.obtenerCatalogos();
    this.onTabChange = new EventEmitter<void>();
    this.onSucursalesReady = new EventEmitter<void>();
    this.lookupProductosEditTemp = <ProductLookup[]>[];

    this.minDate = new Date();
  }

  ngOnInit() {
    this.tabs = this.stickerTabs.obtenerStickerTabs();

    setTimeout(() => {
      this.cargandoVisible = false;
      $("#lookupProductos").hover((x) => {
        this.mostrarMensajeProductoValido = x.type == "mouseenter";
      });
    }, 500);

    this.route.params.subscribe((params) => {
      let stickerId = helpers.convertirAInt(params.stickerId);

      if (stickerId) {
        this.modo = Forms.Modo.Actualizar;
        this.cargarInformacionSticker(stickerId);
      }
    });

    this._maestrosServices.obtenerSucursalesActivas().subscribe(
      (data) => {
        this.listadoSucursales = data as any[];
        setTimeout(() => {
          this.onSucursalesReady.emit();
        }, 500);
      },
      (error) => {}
    );
  }

  cargarInformacionSticker(stickerId: number) {
    this._stickersService
      .obtenerConfiguracionDeStickerPorId(stickerId)
      .subscribe((res) => {
        this.formDataStickerConfiguracion = { ...res.data };
      });
  }

  get productosEdit(): ProductLookup[] {
    if (
      this.formDataStickerConfiguracion.productoId !==
        this.productoIdAnterior &&
      this.formDataStickerConfiguracion.productoId
    ) {
      this.productoIdAnterior = this.formDataStickerConfiguracion.productoId;
      this._productoService
        .Buscador(this.formDataStickerConfiguracion.productoId)
        .toPromise()
        .then((data) => {
          this.producto = data[0];
          this.lookupProductosEditTemp = data.map(
            (x) =>
              <ProductLookup>{
                producto: x.producto,
                productoId: x.productoId,
              }
          );

          return this.lookupProductosEditTemp;
        });
    }
    return this.lookupProductosEditTemp;
  }

  obtenerCatalogos() {
    this._catalogosService.obtenerStickerTipos().subscribe((res) => {
      if (res.ok) {
        this.stickerTipos = res.data;
      } else {
        helpers.mostrarMensajeSegunRespuesta(res.respuestaTipo, res.mensaje);
      }
    });

    this._catalogosService.obtenerTiposDeCanjesDeStickers().subscribe((res) => {
      if (res.ok) {
        this.tiposDeCanjesDeStickers = res.data;
      } else {
        helpers.mostrarMensajeSegunRespuesta(res.respuestaTipo, res.mensaje);
      }
    });
  }

  configurarFormulario() {
    this.formDataStickerConfiguracion = <StickerConfiguracion>{
      activo: true,
      aplicaParaTodasLasSucursales: false,
      descripcion: "",
      esDigital: false,
      fechaAgrega: null,
      montoRequisitoEntrega: null,
      montoSticker: null,
      productoId: null,
      stickerTipoDescripcion: "",
      usuarioAgregaId: helpers.obtenerUsusarioIdInt(
        this._loginService.Usuario.id
      ),
      stickerTipoId: StickerTipos.Producto,
      imagenes: <StickerConfiguracionImagen[]>[],
      productosDisponiblesParaCanje: <StickerConfiguracionProducto[]>[],
      sucursalesAplica: <StickerConfiguracionSucursal[]>[],
    };
  }

  productoVacio(): ProductLookup {
    return { producto: "", productoId: "" };
  }

  validarTabSticker(): boolean {
    let todoBien: boolean = true;

    return todoBien;
  }

  selectTab(tab: DxTabsComponent, e) {
    if (!this.esValidoComponenteActual(e)) {
      this.indexTab = this.indexTabAnterior;
      tab.selectedIndex = this.indexTabAnterior;
      this.componente = this.tabs[tab.selectedIndex].componente;
      return;
    }
    this.componente = this.tabs[tab.selectedIndex].componente;
  }

  selectDirectTab = (tab: DxTabsComponent, e) => {
     this.indexTabAnterior = this.componente;
     const esValido = this.esValidoComponenteActual(e);
     if (this.modo === Forms.Modo.Agregar && !esValido) {
       this.selectTab(tab, e);
       return;
     } else if (
       this.modo === Forms.Modo.Agregar &&
       !(
         this.indexTabAnterior + 1 == tab.selectedIndex ||
         this.indexTabAnterior - 1 == tab.selectedIndex
       )
     ) {
       tab.selectedIndex = this.indexTabAnterior;
       return;
     }

    this.componente = this.tabs[tab.selectedIndex].componente;
  };

  mostrarLoader(): void {
    this.cargandoVisible = true;
  }

  ocultarLoader(): void {
    setTimeout(() => {
      this.cargandoVisible = false;
    }, 1);
  }

  tabAnterior(tab: DxTabsComponent, e) {
    this.indexTabAnterior = this.componente;
    if (e.validationGroup != undefined) {
      const esValido = this.esValidoComponenteActual(e);
      if (!esValido) {
        Notificaciones.error(this.mensaje.datosIncompletos);
        return;
      }
    }

    if (tab.selectedIndex > 0) {
      tab.selectedIndex = tab.selectedIndex - 1;
    } else {
      tab.selectedIndex = 0;
    }

    this.selectTab(tab, e);
  }

  validarRangoFecha = () => {
    if (!this.formDataStickerConfiguracion) {
      return false;
    }

    if (
      !this.formDataStickerConfiguracion.fechaInicio ||
      !this.formDataStickerConfiguracion.fechaFin
    ) {
      return true;
    }

    return (
      this.formDataStickerConfiguracion.fechaInicio <=
      this.formDataStickerConfiguracion.fechaFin
    );
  };

  tabSiguiente(tab: DxTabsComponent, e): void {
    console.log(this.formDataStickerConfiguracion);

    this.indexTabAnterior = this.componente;

    this.onTabChange.emit();
    const esValido = this.esValidoComponenteActual(e);
    if (!esValido) {
      Notificaciones.error(this.mensaje.datosIncompletos);
      return;
    }

    if (tab.selectedIndex < this.tabs.length) {
      tab.selectedIndex = tab.selectedIndex + 1;
    } else {
      tab.selectedIndex = this.tabs.length - 1;
    }

    this.selectTab(tab, e);
  }

  esValidoComponenteActual(e): boolean {
    let esValido: boolean = true;
    switch (this.componente) {
      case TabStickerTipo.Sticker:
        if (e.validationGroup != undefined) {
          esValido = this.verificarTabStickers(e, esValido);
        } else {
          esValido = false;
        }
        break;
      case TabStickerTipo.ProductosStickers:
        esValido = this.verificarTabProductosStickers(esValido);
        break;
      case TabStickerTipo.StickerImagenes:
        esValido = this.verificarTabStickerImagenes(esValido);
        break;
      case TabStickerTipo.SucursalesHabilitadas:
        if (!this.formDataStickerConfiguracion.aplicaParaTodasLasSucursales) {
          esValido = this.verificarTabSucursales(esValido);
        }
        break;
      default:
        esValido = false;
        break;
    }
    return esValido;
  }

  private verificarTabStickers(e: any, esValido: boolean) {
    const res = e.validationGroup.validate();
    const resProductoValido = this.validarProductoSeleccionado();
    if (!res.isValid || !resProductoValido) {
      Notificaciones.error(this.mensaje.datosIncompletos);
      esValido = false;
    }
    return esValido;
  }

  private verificarTabProductosStickers(esValido: boolean) {
    if (
      !this.formDataStickerConfiguracion.productosDisponiblesParaCanje ||
      this.formDataStickerConfiguracion.productosDisponiblesParaCanje.length ===
        0
    ) {
      Notificaciones.error(this.mensaje.productosDisponiblesCanjeIncorrectos);

      esValido = false;
    }
    return esValido;
  }

  private verificarTabStickerImagenes(esValido: boolean) {
    if (
      this.formDataStickerConfiguracion &&
      this.formDataStickerConfiguracion.imagenes
    ) {
      let imagenMobile = this.formDataStickerConfiguracion.imagenes.filter(
        (x) => x.esMovil
      )[0];
      let imagenDesktop = this.formDataStickerConfiguracion.imagenes.filter(
        (x) => !x.esMovil
      )[0];

      if (!imagenMobile || !imagenMobile.activo || !imagenMobile.rutaUrl) {
        esValido = false;
      }
      if (!imagenDesktop || !imagenDesktop.activo || !imagenDesktop.rutaUrl) {
        esValido = false;
      }
    } else {
      esValido = false;
    }
    return esValido;
  }

  private verificarTabSucursales(esValido: boolean) {
    if (
      this.formDataStickerConfiguracion &&
      this.formDataStickerConfiguracion.sucursalesAplica
    ) {
      if (!(this.formDataStickerConfiguracion.sucursalesAplica.length > 0)) {
        esValido = false;
      }

      return esValido;
    }
  }

  private obtenerUsuarioId(): number {
    return helpers.obtenerUsusarioIdInt(this._loginService.Usuario.id);
  }

  guardarSticker() {
    this.readOnlyAgregar = true;

    Alertas.load();

    let dto = <StickerConfiguracion>{
      ...this.formDataStickerConfiguracion,
      usuarioAgregaId: this.obtenerUsuarioId(),
    };

    this._stickersService.guardar(dto).subscribe(
      (res) => {
        if (res.respuestaTipo !== RespuestaTipo.Ok) {
          Alertas.error("Error", res.mensaje);
          return;
        }

        swal({
          type: "success",
          title: this.mensaje.correcto,
          text: this.mensaje.registroGuardado,
          buttonsStyling: false,
          confirmButtonClass: "btn btn-success",
          toast: false,
          position: SwalPosition.center,
        }).then(() => {
          this.irAlListadoDeStickers();
        });
      },
      (error) => {
        helpers.procesarError(error);
      }
    );
    this.readOnlyAgregar = false;
    Alertas.close();
  }

  private irAlListadoDeStickers() {
    this.router.navigate([`/maestros/stickers/listadoDeStickers`]);
  }

  editarSticker() {
    this.readOnlyAgregar = true;

    Alertas.load();

    let dto: StickerConfiguracion = <StickerConfiguracion>{
      ...this.formDataStickerConfiguracion,
      usuarioModificaId: helpers.obtenerUsusarioIdInt(
        this._loginService.Usuario.id
      ),
      sucursalesAplica: this.formDataStickerConfiguracion.sucursalesAplica.map(
        (x) =>
          <StickerConfiguracionSucursal>{
            ...x,
            usuarioModificaId: helpers.obtenerUsusarioIdInt(
              this._loginService.Usuario.id
            ),
          }
      ),
      productosDisponiblesParaCanje:
        this.formDataStickerConfiguracion.productosDisponiblesParaCanje.map(
          (x) =>
            <StickerConfiguracionProducto>{
              ...x,
              usuarioModificaId: helpers.obtenerUsusarioIdInt(
                this._loginService.Usuario.id
              ),
            }
        ),
      imagenes: this.formDataStickerConfiguracion.imagenes.map(
        (x) =>
          <StickerConfiguracionImagen>{
            ...x,
            usuarioModificaId: helpers.obtenerUsusarioIdInt(
              this._loginService.Usuario.id
            ),
          }
      ),
    };

    this._stickersService.editar(dto).subscribe(
      (res) => {
        if (res.respuestaTipo !== RespuestaTipo.Ok) {
          Alertas.error("Error", res.mensaje);
          return;
        }
        swal({
          type: "success",
          title: this.mensaje.correcto,
          text: this.mensaje.datosActualizados,
          buttonsStyling: false,
          confirmButtonClass: "btn btn-success",
          toast: false,
          position: SwalPosition.center,
        }).then(() => {
          this.irAlListadoDeStickers();
        });

        this.readOnlyAgregar = false;
      },
      (error) => {
        helpers.procesarError(error);
      }
    );
    this.readOnlyAgregar = false;
    Alertas.close();
  }

  ordenarPorId(a, b) {
    if (a.id < b.id) {
      return -1;
    }
    if (a.id > b.id) {
      return 1;
    }
    return 0;
  }

  cambioEnCampo(e) {
    let campoActualizado = e.dataField;

    if (campoActualizado === "aplicaParaTodasLasSucursales") {
      if (e.value) {
        this.tabs = this.tabs.filter(
          (x) => x.componente !== TabStickerTipo.SucursalesHabilitadas
        );
      } else {
        if (
          !this.tabs.some(
            (x) => x.componente === TabStickerTipo.SucursalesHabilitadas
          )
        ) {
          this.tabs.push(
            tabsSticker.find(
              (x) => x.componente === TabStickerTipo.SucursalesHabilitadas
            )
          );
        }
      }

      this.tabs = [...this.tabs.sort(this.ordenarPorId)];
    }

    if (campoActualizado === "stickerTipoId") {
      if (e.value !== StickerTipos.Producto) {
        this.tabs = this.tabs.filter(
          (x) => x.componente !== TabStickerTipo.ProductosStickers
        );
      } else {
        if (
          !this.tabs.some(
            (x) => x.componente === TabStickerTipo.ProductosStickers
          )
        ) {
          this.tabs.push(
            tabsSticker.find(
              (x) => x.componente === TabStickerTipo.ProductosStickers
            )
          );
        }
      }
      this.tabs = [...this.tabs.sort(this.ordenarPorId)];
    }
  }

  guardar(e): void {
    const esValido = this.esValidoComponenteActual(e);
    if (!esValido) {
      Notificaciones.error(this.mensaje.datosIncompletos);
      return;
    }

    if (this.modo == Forms.Modo.Agregar) {
      this.guardarSticker();
    } else {
      this.editarSticker();
    }
  }

  obtenerNombreEnum(tabStickerTipo: TabStickerTipo) {
    return TabStickerTipo[tabStickerTipo];
  }

  onProductoSeleccionado(producto: any) {
    this.productoSeleccionado = this.productoVacio();
    this.productoSeleccionadoId = "";
    this.formDataStickerConfiguracion.productoId = "";

    if (producto && producto.productoId) {
      this.productoSeleccionado = producto;
      this.productoSeleccionadoId = producto.productoId;
      this.formDataStickerConfiguracion.productoId =
        this.productoSeleccionadoId;
      this.validarProductoSeleccionado();
    }
  }

  validarProductoSeleccionado() {
    if (!this.formDataStickerConfiguracion) {
      this.productoValido = false;
      return false;
    }

    if (this.formDataStickerConfiguracion.esDigital) {
      return true;
    }

    if (!this.formDataStickerConfiguracion.productoId) {
      this.productoValido = false;
      return false;
    }
    const LENGTH_PRODUCTO = 9;
    if (
      this.formDataStickerConfiguracion.productoId.length !== LENGTH_PRODUCTO
    ) {
      this.productoValido = false;
      return false;
    }

    this.productoValido = true;
    return true;
  }

  verificarMontoDelSticker = (): boolean => {
    if (
      this.formDataStickerConfiguracion.stickerClienteCanjeTipoId ===
      StickersTiposDeCanje.PorValor
    ) {
      if (!this.formDataStickerConfiguracion.montoSticker) {
        return false;
      }

      if (this.formDataStickerConfiguracion.montoSticker <= 0) {
        return false;
      }
    }
    return true;
  };

  verificarMontoRequisitoEntrega = (): boolean => {
    if (
      this.formDataStickerConfiguracion.stickerTipoId === StickerTipos.Precio
    ) {
      if (!this.formDataStickerConfiguracion.montoRequisitoEntrega) {
        return false;
      }

      if (this.formDataStickerConfiguracion.montoRequisitoEntrega <= 0) {
        return false;
      }
    }
    return true;
  };

  onImagenSubida(imagenes: StickerConfiguracionImagen[]) {
    this.formDataStickerConfiguracion.imagenes = imagenes;
  }

  productosStickerChange(valores: StickerConfiguracionProducto[]) {
    this.formDataStickerConfiguracion.productosDisponiblesParaCanje = [
      ...valores,
    ];
  }

  onSucursalesChange(sucursales: StickerConfiguracionSucursal[]) {
    this.formDataStickerConfiguracion.sucursalesAplica = sucursales;
  }
}
