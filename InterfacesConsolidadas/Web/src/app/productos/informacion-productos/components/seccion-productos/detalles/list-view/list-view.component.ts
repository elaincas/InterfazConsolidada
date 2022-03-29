import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { DxTextBoxComponent } from "devextreme-angular";
import notify from "devextreme/ui/notify";
import { Alertas } from "../../../../../../helpers/notificaciones/notificaciones";
import { helpers } from "../../../../../../helpers/utils";
import { LoginService } from "../../../../../../login/services/login.service";
import { InformacionSeccionProductoDetalle } from "../../../../models/seccion-producto-detalle.model";
import { SeccionProductosService } from "../../../../services/seccion-productos.service";

@Component({
  selector: "list-view",
  templateUrl: "./list-view.component.html",
})
export class ListViewComponent implements OnInit {
  formControlDetalle: FormGroup;
  @ViewChild("textBoxValor") textBoxValor: DxTextBoxComponent;
  @Input() seccionProductoId: number;
  onGuardarDetalle: EventEmitter<boolean> = new EventEmitter();
  @Output() onChangeDto: EventEmitter<InformacionSeccionProductoDetalle[]> =
    new EventEmitter();

  submit: boolean;
  botonAgregarDeshabilitado: boolean;
  botonEditarDeshabilitado: boolean;
  esEdicion: boolean;
  validacion: any;
  @Input() detalles: InformacionSeccionProductoDetalle[];
  idTemp: number;
  constructor(
    private _formBuilder: FormBuilder,
    private _loginService: LoginService,
    private _seccionProductosService: SeccionProductosService
  ) {
    this.idTemp = helpers.VALOR_POR_DEFECTO_ID;
    this.seccionProductoId = helpers.VALOR_POR_DEFECTO_ID;

    this.validacion = {
      valor: {
        error: false,
        mensaje: "",
      },
    };

    this.detalles = <InformacionSeccionProductoDetalle[]>[];
  }

  ngOnInit() {
    this.construirFormulario();

    this.detalles = this.detalles.map(
      (x) => <InformacionSeccionProductoDetalle>{ ...x, idTemp: ++this.idTemp }
    );
  }

  construirFormulario() {
    this.formControlDetalle = this._formBuilder.group({
      id: new FormControl(helpers.VALOR_POR_DEFECTO_ID),
      informacionSeccionProductoId: new FormControl(
        helpers.VALOR_POR_DEFECTO_ID
      ),
      activo: new FormControl(true),
      valor: new FormControl(""),
      idTemp: new FormControl(""),
      visibleWeb: new FormControl(false),
    });
  }

  inactivarDetalle(id: number) {
    Alertas.question("", "¿Desea inactivar este registro?").then(() => {
      Alertas.load();
      this._seccionProductosService.inactivarDetalle(id).subscribe(
        (seInactivo) => {
          if (seInactivo) {
            this.detalles = this.detalles.map((registro) => {
              if (registro.id === id) {
                registro.activo = false;
                return registro;
              }
              return registro;
            });
            Alertas.close();
            Alertas.ok(
              "¡Correcto!",
              "El registro se ha inactivado correctamente."
            );
          } else {
            Alertas.error("Error", "Hubo un error al inactivar el registro.");
          }
        },
        (error) => {
          helpers.procesarError(error);
        }
      );
    });
  }

  activarDetalle(id: number) {
    Alertas.load();
    this._seccionProductosService.activarDetalle(id).subscribe(
      (seInactivo) => {
        if (seInactivo) {
          this.detalles = this.detalles.map((registro) => {
            if (registro.id === id) {
              registro.activo = true;
              return registro;
            }
            return registro;
          });
          Alertas.close();
          Alertas.ok("¡Correcto!", "El registro se ha activado correctamente.");
        } else {
          Alertas.error("Error", "Hubo un error al activar el registro.");
        }
      },
      (error) => {
        helpers.procesarError(error);
      }
    );
  }

  obtenerValoresParaActualizarDetalle(data: InformacionSeccionProductoDetalle) {
    this.limpiarDetalle();

    this.esEdicion = true;

    this.formControlDetalle.get("id").setValue(data.id);
    this.formControlDetalle.get("activo").setValue(data.activo);
    this.formControlDetalle
      .get("informacionSeccionProductoId")
      .setValue(data.informacionSeccionProductoId);
    this.formControlDetalle.get("valor").setValue(data.valor);
    this.formControlDetalle.get("idTemp").setValue(data.idTemp);
    this.formControlDetalle.get("visibleWeb").setValue(data.visibleWeb);

    this.seccionProductoId = data.informacionSeccionProductoId;
  }

  validarFormulario(): boolean {
    let todoBien = true;

    const valor: number = this.formControlDetalle.get("valor").value;

    if (!valor) {
      this.validacion.valor.error = true;
      this.validacion.valor.mensaje = "El valor es requerido.";
      todoBien = false;
    } else {
      this.validacion.valor.error = false;
    }

    if (!todoBien && this.formControlDetalle.valid) {
      notify(
        "Por favor, revise que todos los campos sean correctos.",
        "error",
        3000
      );
    }

    return todoBien;
  }

  async agregarDetalle() {
    this.submit = true;
    this.botonAgregarDeshabilitado = true;

    if (!(await this.validarFormulario())) {
      this.botonAgregarDeshabilitado = false;
      return;
    }

    const dto: InformacionSeccionProductoDetalle = <
      InformacionSeccionProductoDetalle
    >{
      ...this.formControlDetalle.value,
      informacionSeccionProductoId: this.seccionProductoId,
      usuarioAgregaId: helpers.obtenerUsusarioIdInt(
        this._loginService.Usuario.id
      ),
    };

    if (this.seccionProductoId) {
      Alertas.load();

      this._seccionProductosService.guardarDetalle(dto).subscribe(
        (res) => {
          if (res.respuestaTipo === 1) {
            Alertas.error("Error", res.respuesta);
            return;
          }

          if (this.seccionProductoId) {
            this.onGuardarDetalle.emit(true);
            Alertas.ok(
              "¡Correcto!",
              "Los datos se han agregado correctamente."
            );
            res.idTemp = ++this.idTemp;
            this.detalles.push(res);
            this.limpiarDetalle();
          }
        },
        (error) => {
          helpers.procesarError(error);
        }
      );
    } else {
      dto.idTemp = ++this.idTemp;
      this.detalles.push(dto);
      this.onChangeDto.emit(this.detalles);
      this.limpiarDetalle();
    }

    this.submit = false;
    this.botonAgregarDeshabilitado = false;
    Alertas.close();
  }

  async editarDetalle() {
    this.submit = true;
    this.botonEditarDeshabilitado = true;
    if (!(await this.validarFormulario())) {
      this.botonEditarDeshabilitado = false;
      return;
    }

    const dto: InformacionSeccionProductoDetalle = <
      InformacionSeccionProductoDetalle
    >{
      ...this.formControlDetalle.value,
      informacionSeccionProductoId: this.seccionProductoId,
      usuarioModificaId: helpers.obtenerUsusarioIdInt(
        this._loginService.Usuario.id
      ),
      fueEditado: true,
    };

    if (this.seccionProductoId) {
      Alertas.load();
      this._seccionProductosService.editarDetalle(dto).subscribe(
        (res) => {
          if (this.seccionProductoId) {
            this.onGuardarDetalle.emit(true);
            Alertas.ok(
              "¡Correcto!",
              "Los datos se han actualizado correctamente."
            );
            this.detalles = this.detalles.map((registro) => {
              if (registro.id === dto.id) {
                registro.valor = dto.valor;
                registro.usuarioModificaId = dto.usuarioModificaId;
                registro.activo = dto.activo;
                registro.fueEditado = true;

                return registro;
              }
              return registro;
            });

            this.limpiarDetalle();
          }
        },
        (error) => {
          helpers.procesarError(error);
        }
      );
    } else {
      this.detalles = this.detalles.map((registro) => {
        if (registro.idTemp === dto.idTemp) {
          registro.valor = dto.valor;
          registro.usuarioModificaId = dto.usuarioModificaId;
          registro.activo = dto.activo;

          return registro;
        }
        return registro;
      });

      this.limpiarDetalle();
    }

    this.submit = false;
    this.esEdicion = false;
    Alertas.close();
  }

  limpiarDetalle() {
    this.formControlDetalle.reset();
    this.formControlDetalle.get("id").setValue(helpers.VALOR_POR_DEFECTO_ID);
    this.formControlDetalle.get("valor").setValue("");
    this.formControlDetalle.get("activo").setValue(true);

    this.esEdicion = false;
    this.botonEditarDeshabilitado = false;
    this.botonAgregarDeshabilitado = false;
    this.submit = false;

    this.textBoxValor.instance.focus();
  }
}
