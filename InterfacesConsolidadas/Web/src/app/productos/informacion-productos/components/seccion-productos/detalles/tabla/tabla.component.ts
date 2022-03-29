import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { DxDataGridComponent, DxTextBoxComponent } from "devextreme-angular";
import dxDataGrid from "devextreme/ui/data_grid";
import notify from "devextreme/ui/notify";
import { Observable, Subscription } from "rxjs";
import { Alertas } from "../../../../../../helpers/notificaciones/notificaciones";
import { helpers } from "../../../../../../helpers/utils";
import { LoginService } from "../../../../../../login/services/login.service";
import { ColumnaInformacionBasica } from "../../../../models/columna-informacion-basica.model";
import { Columna } from "../../../../models/columna.model";
import { FilaDto } from "../../../../models/fila.model";
import { TablaDto } from "../../../../models/tabla-dto.model";
import { TipoEvento } from "../../../../models/tipos-eventos";
import { SeccionProductosService } from "../../../../services/seccion-productos.service";

@Component({
  selector: "tabla",
  templateUrl: "./tabla.component.html",
  styleUrls: ["./tabla.component.css"],
})
export class TablaComponent implements OnInit, OnDestroy {
  //#region Propiedades
  @ViewChild("dataGrid") dataGrid: DxDataGridComponent;
  @ViewChild("descripcionColumna") dxTextDescripcionColumna: DxTextBoxComponent;

  @Input() events: Observable<TipoEvento>;
  @Input() seccionProductoId: number;
  @Output() limpiarDetalle: EventEmitter<boolean> = new EventEmitter();

  private eventsSubscription: Subscription;
  private dataGridInstance: dxDataGrid;
  formGroupColumna: FormGroup;

  dataSource: any[];
  columnas: any[];
  validacion: any;
  columnaEditTemp: any;

  esEdicion: boolean;
  esEliminacionDeFila: boolean;
  submit: boolean;
  botonAgregarColumnaDeshabilitado: boolean;
  botonEditarColumnaDeshabilitado: boolean;
  _mostrarPopupAdministrarColumna: boolean;
  //#endregion

  constructor(
    private _formBuilder: FormBuilder,
    private _seccionProductosService: SeccionProductosService,
    private _loginService: LoginService
  ) {
    this.resetDataSource();
    this.mostrarPopupAdministrarColumna = false;
    this.seccionProductoId = helpers.VALOR_POR_DEFECTO_ID;
    this.submit = false;
    this.validacion = {
      descripcionColumna: {
        error: false,
        mensaje: "",
      },
    };

    this.limpiarDetalle.emit(true);
    this.botonAgregarColumnaDeshabilitado = false;
    this.botonEditarColumnaDeshabilitado = false;
    this.esEdicion = false;
    this.columnas = [];
    this.esEliminacionDeFila = false;
  }

  //#region Implementaciones

  ngOnInit() {
    this.eventsSubscription = this.events.subscribe((tipoEvento) => {
      switch (tipoEvento) {
        case TipoEvento.LimpiarTabla:
          const dataGridInstance: dxDataGrid = this.dataGrid.instance;
          dataGridInstance.state({});
          dataGridInstance.option("columns", []);
          this.resetDataSource();
          break;
        case TipoEvento.RecargarTabla:
          this.obtenerTabla();
          break;
        default:
          break;
      }
    });

    this.construirFormularios();
    this.eliminarState();
    this.obtenerTabla();
    this.limpiarDetalle.emit(true);
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
    this.eliminarState();

    this.limpiarDetalle.emit(true);
  }

  //#endregion

  //#region Tabla

  crearColumnasParaTabla(columnas: ColumnaInformacionBasica[]): void {
    this.columnas = [];
    columnas.forEach((columna) => {
      this.columnas.push({
        dataField: columna.descripcion,
        caption: columna.descripcion,
        allowFiltering: false,
        allowSorting: false,
      });
    });
  }

  obtenerTabla(): void {
    Alertas.load();
    this._seccionProductosService
      .obtenerTabla(this.seccionProductoId)
      .subscribe(
        (data: TablaDto) => {
          Alertas.close();
          if (data) {
            if (data.columnas) {
              this.crearColumnasParaTabla(data.columnas);
            }

            if (data.pivot) {
              const dataSource = JSON.parse(data.pivot);
              this.dataSource = dataSource;
            }
          }
        },
        (error) => helpers.procesarError(error)
      );
  }
  //#endregion

  //#region Guardar State - Orden de columnas
  eliminarState() {
    localStorage.removeItem("stateStorageDxDataGridTable");
  }

  guardarOrdenDeColumnas(columnas: any[]) {
    if (columnas && columnas.length > 0) {
      const dtos: Columna[] = columnas.map((columna) => {
        const dataField = columna.added
          ? columna.added.dataField
          : columna.dataField;

        const caption = this.dataGridInstance
          .getVisibleColumns()
          .find((x) => x.dataField === columna.dataField).caption;

        return <Columna>{
          descripcionInicial: dataField,
          descripcionColumna: caption,
          orden: columna.visibleIndex,
          usuarioModificaId: helpers.obtenerUsusarioIdInt(
            this._loginService.Usuario.id
          ),
        };
      });

      this._seccionProductosService.actualizarOrdenColumnas(dtos).subscribe();
    }
  }

  customSaveStateStoring = (state) => {
    this.guardarOrdenDeColumnas(state.columns);
    localStorage.setItem("stateStorageDxDataGridTable", JSON.stringify(state));
  };

  customLoadStateStoring() {
    if (!localStorage.stateStorageDxDataGridTable)
      return localStorage.stateStorageDxDataGridTable;
    else return JSON.parse(localStorage.stateStorageDxDataGridTable);
  }

  //#endregion

  //#region Getters y Setters
  get mostrarPopupAdministrarColumna(): boolean {
    return this._mostrarPopupAdministrarColumna;
  }

  set mostrarPopupAdministrarColumna(mostrar: boolean) {
    this._mostrarPopupAdministrarColumna = mostrar;
  }

  get agregarFilaDisabled(): boolean {
    if (this.dataGridInstance) {
      const columnasVisibles = this.dataGridInstance.getVisibleColumns();
      const filas = this.dataGridInstance.getVisibleRows();

      if (columnasVisibles && columnasVisibles.length === 0) {
        return true;
      }

      if (filas) {
        if (filas.length === 0) {
          return false;
        }

        // Si hay alguna celda que el valor no sea undefined, o nulo, que habiilite el botón, caso contrario que se deshabilite
        return filas.some((fila) => {
          return !fila.values.some((valor) => (valor ? true : false));
        });
      }
    }
    return true;
  }

  get stateStoring(): any {
    return {
      enabled: true,
      type: "custom",
      customSave: this.customSaveStateStoring,
    };
  }
  //#endregion

  //#region Métodos reutilizables
  renderizarColumna(descripcion: string) {
    this.dataGridInstance.addColumn({
      dataField: descripcion,
      caption: descripcion,
      allowFiltering: false,
      allowReordering: false,
      allowSorting: false,
    });
  }

  setFocus() {
    if (this.dxTextDescripcionColumna) {
      setTimeout(() => {
        this.dxTextDescripcionColumna.instance.focus();
      }, 0);
    }
  }

  onToolbarPreparing(event) {
    event.toolbarOptions.items.unshift(
      {
        location: "after",
        template: "newRow",
      },
      {
        location: "after",
        template: "newColumn",
      }
    );
  }

  crearInstanciaDxDataGrid() {
    this.dataGridInstance = this.dataGrid.instance;
  }

  construirFormularios() {
    this.formGroupColumna = this._formBuilder.group({
      id: new FormControl(helpers.VALOR_POR_DEFECTO_ID),
      descripcionColumna: new FormControl(""),
      activo: new FormControl(true),
      orden: new FormControl(2),
    });
  }

  resetDataSource() {
    this.dataSource = <any[]>[];
  }

  onCerrarModal() {
    this.mostrarPopupAdministrarColumna = false;
    this.limpiarColumna();
  }
  //#endregion

  //#region Columnas
  validarColumna(): boolean {
    let todoBien = true;

    const columna: string =
      this.formGroupColumna.get("descripcionColumna").value;

    if (helpers.isNotEmpty(columna)) {
      this.validacion.descripcionColumna.error = false;
    } else {
      this.validacion.descripcionColumna.error = true;
      this.validacion.descripcionColumna.mensaje = "La columna es requerida.";
      todoBien = false;
    }

    const hayAlgunaColumnaIgual = this.dataGridInstance
      .getVisibleColumns()
      .some((col) => {
        if (col.dataField)
          return col.caption.toLowerCase() === columna.toLowerCase();
        else return false;
      });

    if (hayAlgunaColumnaIgual) {
      notify("Ya hay una columna con el mismo nombre.", "error", 3000);
      todoBien = false;

      return todoBien;
    }

    if (this.seccionProductoId === helpers.VALOR_POR_DEFECTO_ID) {
      this.limpiarDetalle.emit(false);

      notify(
        "Por favor, guardar los cambios antes de crear la primera columna.",
        "error",
        3000
      );

      todoBien = false;

      return todoBien;
    }

    if (!todoBien && this.formGroupColumna.valid) {
      notify(
        "Por favor, revise que todos los campos sean correctos.",
        "error",
        3000
      );
    }

    return todoBien;
  }

  limpiarColumna() {
    this.formGroupColumna.reset();

    this.formGroupColumna.get("id").setValue(helpers.VALOR_POR_DEFECTO_ID);
    this.formGroupColumna.get("activo").setValue(true);
    this.formGroupColumna.get("descripcionColumna").setValue("");

    this.esEdicion = false;

    this.botonEditarColumnaDeshabilitado = false;
    this.botonAgregarColumnaDeshabilitado = false;
    this.columnaEditTemp = null;
    this.submit = false;
  }

  pupupAgregarColumna() {
    this.mostrarPopupAdministrarColumna = true;
  }

  agregarColumna() {
    this.submit = true;
    this.botonAgregarColumnaDeshabilitado = true;

    if (!this.validarColumna()) {
      this.botonAgregarColumnaDeshabilitado = false;
      return;
    }

    const dto: Columna = <Columna>{
      ...this.formGroupColumna.value,
      informacionSeccionProductoId: this.seccionProductoId,
      usuarioAgregaId: helpers.obtenerUsusarioIdInt(
        this._loginService.Usuario.id
      ),
    };

    Alertas.load();

    this.renderizarColumna(dto.descripcionColumna);

    this.mostrarPopupAdministrarColumna = false;
    this.limpiarColumna();
    this.agregarFila();
    const hayFilas = this.dataGridInstance.getDataSource().items().length;
    if (!hayFilas) this.agregarFila();

    var columnaAgregada = this.dataGridInstance
      .getVisibleColumns()
      .filter((columna) => columna.caption === dto.descripcionColumna)[0];
    dto.orden = columnaAgregada.visibleIndex;

    this._seccionProductosService.agregarColumna(dto).subscribe(
      (res) => {
        if (res.respuestaTipo === 1) {
          Alertas.error("Error", res.respuesta);
          return;
        }

        notify("La columna se ha agregado con éxito.", "success", 3000);

        this.limpiarColumna();
        this.mostrarPopupAdministrarColumna = false;
      },
      (error) => {
        helpers.procesarError(error);
      }
    );

    this.submit = false;
    this.botonAgregarColumnaDeshabilitado = false;
    Alertas.close();
  }

  editarColumna() {
    this.submit = true;
    this.botonEditarColumnaDeshabilitado = true;

    if (!this.validarColumna()) {
      this.botonEditarColumnaDeshabilitado = false;
      return;
    }

    const nombreColumna: string =
      this.formGroupColumna.get("descripcionColumna").value;

    this.dataGridInstance.columnOption(
      this.columnaEditTemp.dataField,
      "caption",
      nombreColumna
    );

    const nombreColumnaId: string = "id";

    const columnaId = this.dataGridInstance
      .getVisibleColumns()
      .find((columna) => columna.dataField === nombreColumnaId);

    if (columnaId) {
      this.dataGridInstance.columnOption(nombreColumnaId, "visible", false);
    }

    const dto: Columna = <Columna>{
      ...this.formGroupColumna.value,
      informacionSeccionProductoId: this.seccionProductoId,
      usuarioModificaId: helpers.obtenerUsusarioIdInt(
        this._loginService.Usuario.id
      ),
      descripcionInicial: this.columnaEditTemp.dataField,
      orden: this.columnaEditTemp.visibleIndex,
    };

    Alertas.load();

    this._seccionProductosService.editarColumna(dto).subscribe(
      (res) => {
        Alertas.close();
        if (res.respuestaTipo === 1) {
          Alertas.error("Error", res.respuesta);
          return;
        }

        notify("La columna se ha editado con éxito.", "success", 3000);

        this.limpiarColumna();
        this.mostrarPopupAdministrarColumna = false;
      },
      (error) => {
        helpers.procesarError(error);
      }
    );

    this.mostrarPopupAdministrarColumna = false;
    this.limpiarColumna();
  }

  agregarOEditarColumna() {
    if (this.esEdicion) this.editarColumna();
    else this.agregarColumna();
  }

  eliminarColumna() {
    var columna = this.dataGridInstance
      .getVisibleColumns()
      .find((columna) => columna.dataField === this.columnaEditTemp.dataField);

    Alertas.question("", "¿Desea inactivar esta columna?").then(() => {
      Alertas.load();

      this._seccionProductosService.inactivarColumna(columna.caption).subscribe(
        (seInactivo) => {
          if (seInactivo) {
            Alertas.close();
            this.dataGridInstance.deleteColumn(this.columnaEditTemp.dataField);

            this.dataGridInstance.columnOption(
              this.columnaEditTemp.dataField,
              "visible",
              false
            );

            this.mostrarPopupAdministrarColumna = false;

            notify("La columna se ha eliminado con éxito.", "success", 3000);
          } else {
            Alertas.error("Error", "Hubo un error al inactivar la columna.");
          }
        },
        (error) => {
          helpers.procesarError(error);
        }
      );
    });
  }

  onCellClick(event) {
    const ROW_TYPE_HEADER: string = "header";

    if (event.column && event.rowType == ROW_TYPE_HEADER) {
      this.esEdicion = true;
      this.formGroupColumna
        .get("descripcionColumna")
        .setValue(event.column.caption);

      this.columnaEditTemp = { ...event.column };
      this.mostrarPopupAdministrarColumna = true;
    }
  }

  //#endregion

  //#region Filas
  agregarFila() {
    this.dataGridInstance.addRow();
  }

  onRowInserted() {
    setTimeout(() => {
      const visibleRows: any = [...this.dataGridInstance.getVisibleRows()];
      const filaInsertada = visibleRows[visibleRows.length - 1];
      var filasDto: FilaDto[] = filaInsertada.cells.slice(0, -1).map(
        (celda) =>
          <FilaDto>{
            columna: celda.column.caption,
            celda: celda.value,
            informacionSeccionProductoDetalleTablaId: this.seccionProductoId,
            numeroFila: celda.rowIndex,
            usuarioAgregaId: helpers.obtenerUsusarioIdInt(
              this._loginService.Usuario.id
            ),
          }
      );
      this._seccionProductosService.agregarCeldas(filasDto, this.seccionProductoId).subscribe(
        (res) => {
          if (res.respuestaTipo === 1) {
            Alertas.error("Error", res.respuesta);
            return;
          }
          notify("La fila se ha agregado con éxito.", "success", 3000);
        },
        (error) => {
          helpers.procesarError(error);
        }
      );
    }, 500);
  }

  onRowUpdated(event) {
    const fila: any = this.dataGridInstance
      .getVisibleRows()
      .find((x) => x.key === event.key);

    const celdasEditadasDto: FilaDto[] = <FilaDto[]>[];

    // Obtener las celdas a editar
    for (const key in event.data) {
      if (Object.prototype.hasOwnProperty.call(event.data, key)) {
        const celda = event.data[key];

        const caption = fila.cells.find((x) => x.column.dataField === key)
          .column.caption;

        const celdaEditadaDto = <FilaDto>{
          columna: caption,
          celda,
          informacionSeccionProductoDetalleTablaId: this.seccionProductoId,
          usuarioModificaId: helpers.obtenerUsusarioIdInt(
            this._loginService.Usuario.id
          ),
          numeroFila: fila.rowIndex,
        };

        celdasEditadasDto.push(celdaEditadaDto);
      }
    }

    if (celdasEditadasDto.length > 0) {
      this._seccionProductosService.editarCeldas(celdasEditadasDto).subscribe(
        (res) => {
          if (res.respuestaTipo === 1) {
            Alertas.error("Error", res.respuesta);
            return;
          }
          notify("La fila se ha editado con éxito.", "success", 3000);
        },
        (error) => {
          helpers.procesarError(error);
        }
      );
    }
  }

  onRowRemoved(event) {
    this.esEliminacionDeFila = true;

    const filaEliminada: number = event.key;

    this._seccionProductosService.inactivarFila(filaEliminada).subscribe(
      (res) => {
        if (res.respuestaTipo === 1) {
          Alertas.error("Error", res.respuesta);
          return;
        }

        notify("La fila se ha eliminado con éxito.", "success", 3000);

        setTimeout(() => {
          this.esEliminacionDeFila = false;
        }, 10000);
      },
      (error) => {
        this.esEliminacionDeFila = false;
        helpers.procesarError(error);
      }
    );
  }
  //#endregion
}
