import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { DxDataGridComponent } from "devextreme-angular";
import { Alertas } from "../../../../helpers/notificaciones/notificaciones";
import { Producto } from "../../models/producto.model";
import { DescuentosSucursalService } from "../../services/descuentos-sucursal.service";

@Component({
  selector: "app-buscar-productos-popup",
  templateUrl: "./buscar-productos-popup.component.html",
  styleUrls: ["./buscar-productos-popup.component.css"],
})
export class BuscarProductosPopupComponent implements OnInit {
  @Input() visible: boolean;
  @Input() codigoSucursal: number;
  @Output() agregarProductoSeleccionadoDataGrid = new EventEmitter<
    Producto[]
  >();
  @Output() onCerrarModal = new EventEmitter();
  @ViewChild("dataGridProductos") dataGridProductos: DxDataGridComponent;

  public productos: Producto[] = [];
  public busqueda: string;
  public productoEventEmitter: Producto;
  private productosSeleccionados: Producto[] = [];

  constructor(private descuentosSucursalService: DescuentosSucursalService) {}

  ngOnInit() {}

  buscarProductos(): void {
    this.descuentosSucursalService.buscarProductos(this.busqueda, this.codigoSucursal).subscribe(
      (data) => {
        this.productos = data;
      },
      (error) => {
        Alertas.error("Error", "No se pudo obtener el listado de productos.");
      }
    );
  }

  agregarProductosSeleccionados(): void {
    this.productosSeleccionados =
      this.dataGridProductos.instance.getSelectedRowsData();
    this.agregarProductoSeleccionadoDataGrid.emit(this.productosSeleccionados);
    this.onCerrarModal.emit();
    this.productos = [];
    this.busqueda = "";
  }

  OnCerrarModal(e): void {
    this.onCerrarModal.emit();
  }
}
