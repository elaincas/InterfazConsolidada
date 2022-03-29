import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent } from "devextreme-angular";
import { Alertas } from "../../../../helpers/notificaciones/notificaciones";
import { LoginService } from "../../../../login/services/login.service";
import { ProductoDescuentoSucursal } from "../../models/producto-descuento-sucursal.model";
import { Producto } from "../../models/producto.model";
import { Sucursal } from "../../models/sucursal.model";
import { DescuentosSucursalService } from "../../services/descuentos-sucursal.service";

@Component({
  selector: "app-agregar-descuentos-adicionales",
  templateUrl: "./agregar-descuentos-adicionales.component.html",
  styleUrls: ["./agregar-descuentos-adicionales.component.css"],
})
export class AgregarDescuentosAdicionalesComponent implements OnInit {
  @ViewChild("dgDescuentosAdicionales")
  dgDescuentosAdicionales: DxDataGridComponent;

  public sucursales: Sucursal[] = [];
  public productosDescuentosSucursal: ProductoDescuentoSucursal[] = [];
  public esPopupBuscarProductosVisible: boolean = false;
  public codigoSucursal: number;
  public descuentoAdicionalProductos: number = 0.01;
  public fechaDesdeProductos: Date;
  public fechaHastaProductos: Date;
  public observacionProductos: string;

  constructor(
    private descuentosSucursalService: DescuentosSucursalService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.obtenerSucursales();
  }

  obtenerSucursales(): void {
    this.descuentosSucursalService.obtenerSucursales().subscribe(
      (data) => {
        this.sucursales = data;
      },
      (error) => {}
    );
  }

  mostrarPopupBuscarProductos(): void {
    if (this.codigoSucursal == null) {
      Alertas.warning(
        "Advertencia",
        "Debe seleccionar una sucursal antes de buscar los productos."
      );
      return;
    }
    this.esPopupBuscarProductosVisible = !this.esPopupBuscarProductosVisible;
  }

  agregarProductosSeleccionados(productos: Producto[]): void {
    for (let i = 0; i < productos.length; i++) {
      const productoSeleccionado = productos[i];

      if (
        this.dgDescuentosAdicionales.instance.getRowIndexByKey(
          productoSeleccionado.prod_id
        ) == -1
      ) {
        const producto: ProductoDescuentoSucursal = {
          productoId: productoSeleccionado.prod_id,
          productoDescripcion: productoSeleccionado.prod_Desc,
          descuentoAdicional: 0.01,
          desde: new Date(),
          hasta: new Date(),
          observaciones: "",
          usuarioAgrega: this.loginService.Usuario.id,
          activo: true,
        };
        this.productosDescuentosSucursal.push(producto);
      }
    }
  }

  alSeleccionarSucursal(codigoSucursal: number): void {
    this.codigoSucursal = codigoSucursal;
  }

  agregarProductosDescuentosSucursal(): void {
    if (this.esFormularioValido()) {
      Alertas.load();
      let productosDescuentosSucursalAgregar: ProductoDescuentoSucursal[] = [];
      const filas = this.dgDescuentosAdicionales.instance.getVisibleRows();

      filas.forEach((fila) => {
        const { data } = fila;
        productosDescuentosSucursalAgregar.push(data);
      });

      this.descuentosSucursalService
        .agregarProductosDescuentosSucursal(
          productosDescuentosSucursalAgregar,
          this.codigoSucursal
        )
        .subscribe(
          (data) => {
            Alertas.ok(
              "Datos Guardados",
              "Los datos se han guardado satisfactoriamente."
            );
            this.limpiarControles();
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  onCerrarModal(): void {
    this.esPopupBuscarProductosVisible = false;
  }

  esFormularioValido(): boolean {
    if (this.codigoSucursal == null) {
      Alertas.warning("Advertencia", "Debe seleccionar una sucursal");
      return false;
    }

    if (this.productosDescuentosSucursal.length == 0) {
      Alertas.warning(
        "Advertencia",
        "Debe agregar al menos un producto a la lista."
      );
      return false;
    }

    return true;
  }

  removerDescuento(rowIndex: number): void {
    this.dgDescuentosAdicionales.instance.deleteRow(rowIndex);
  }

  aplicarValoresProductos(): void {
    if (this.esFormularioValido() && this.esFormularioAplicarTodosValido()) {
      this.productosDescuentosSucursal.forEach((productoDescuentoSucursal) => {
        productoDescuentoSucursal.descuentoAdicional =
          this.descuentoAdicionalProductos;
        productoDescuentoSucursal.desde = this.fechaDesdeProductos;
        productoDescuentoSucursal.hasta = this.fechaHastaProductos;
        productoDescuentoSucursal.observaciones = this.observacionProductos;
      });
    }
  }

  esFormularioAplicarTodosValido(): boolean {
    if (this.fechaDesdeProductos == null || this.fechaHastaProductos == null) {
      Alertas.warning(
        "Advertencia",
        "Debe seleccionar ambas fechas para aplicarlas a todos los descuentos."
      );
      return false;
    }

    if (this.fechaDesdeProductos > this.fechaHastaProductos) {
      Alertas.warning(
        "Advertencia",
        "La fecha inicial no debe ser mayor a la fecha final."
      );
      return false;
    }
    return true;
  }

  limpiarControles(): void {
    this.productosDescuentosSucursal = [];
    this.descuentoAdicionalProductos = 0.01;
    this.observacionProductos = "";
    this.fechaDesdeProductos = null;
    this.fechaHastaProductos = null;
  }
}
