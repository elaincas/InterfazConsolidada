import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import notify from "devextreme/ui/notify";
import { Alertas } from "../../../../helpers/notificaciones/notificaciones";
import { helpers } from "../../../../helpers/utils";
import { LoginService } from "../../../../login/services/login.service";
import { ProductoInformacion } from "../../models/producto-informacion.model";
import { ProductoInformacionService } from "../../services/producto-informacion.service";

@Component({
  selector: "app-producto-informacion",
  templateUrl: "./producto-informacion.component.html",
  styleUrls: ["./producto-informacion.component.css"],
})
export class ProductoInformacionComponent implements OnInit {
  listadoProductoInformacion: ProductoInformacion[];
  formGroupProductosInformacion: FormGroup;
  validacion: any;

  submit: boolean;
  botonAgregarDeshabilitado: boolean;
  botonEditarDeshabilitado: boolean;
  esEdicion: boolean;

  constructor(
    private _servicio: ProductoInformacionService,
    private _formBuilder: FormBuilder,
    private _loginService: LoginService
  ) {
    this.submit = false;
    this.botonAgregarDeshabilitado = false;
    this.botonAgregarDeshabilitado = false;
    this.esEdicion = false;

    this.validacion = {
      descripcion: {
        error: false,
        mensaje: "",
      },
      descripcionWeb: {
        error: false,
        mensaje: "",
      },
    };
  }

  ngOnInit() {
    this.construirFormulario();
    this.obtenerInformacion();
  }

  construirFormulario() {
    this.formGroupProductosInformacion = this._formBuilder.group({
      id: new FormControl(helpers.VALOR_POR_DEFECTO_ID),
      descripcion: new FormControl(),
      descripcionWeb: new FormControl(),
      activo: new FormControl(true),
    });
  }

  obtenerInformacion() {
    this._servicio.obtener().subscribe(
      (data) => {
        Alertas.close();
        this.listadoProductoInformacion = data;
        console.log(data);
      },
      (error) => {
        console.log(error);
        Alertas.close();
        helpers.procesarError(error);
      }
    );
  }

  actualizarGrid(onComplete?: Function): void {
    Alertas.load();
    this._servicio.obtener().subscribe({
      next: (data) => {
        Alertas.close();
        this.listadoProductoInformacion = data;
      },
      error: (error) => {
        helpers.procesarError(error);
      },
      complete: () => {
        Alertas.close();
        if (onComplete) {
          onComplete();
        }
      },
    });
  }

  activar(id: number) {
    Alertas.load();
    this._servicio.activar(id).subscribe(
      (seInactivo) => {
        if (seInactivo) {
          this.listadoProductoInformacion = this.listadoProductoInformacion.map(
            (registro) => {
              if (registro.id === id) {
                registro.activo = true;
                return registro;
              }
              return registro;
            }
          );
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

  inactivar(id: number) {
    Alertas.question("", "¿Desea inactivar este registro?").then(() => {
      Alertas.load();
      this._servicio.inactivar(id).subscribe(
        (seInactivo) => {
          if (seInactivo) {
            this.listadoProductoInformacion =
              this.listadoProductoInformacion.map((registro) => {
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

  obtenerValoresParaActualizar(data: ProductoInformacion) {
    this.esEdicion = true;
    this.formGroupProductosInformacion.get("activo").setValue(data.activo);
    this.formGroupProductosInformacion
      .get("descripcion")
      .setValue(data.descripcion);
    this.formGroupProductosInformacion
      .get("descripcionWeb")
      .setValue(data.descripcionWeb);

    this.formGroupProductosInformacion.get("id").setValue(data.id);
  }

  limpiar() {
    this.formGroupProductosInformacion.reset();
    this.formGroupProductosInformacion.get("activo").setValue(true);
    this.formGroupProductosInformacion
      .get("id")
      .setValue(helpers.VALOR_POR_DEFECTO_ID);

    this.esEdicion = false;
    this.botonEditarDeshabilitado = false;
    this.botonAgregarDeshabilitado = false;
    this.submit = false;
  }

  async validarFormulario() {
    let todoBien = true;

    const descripcion =
      this.formGroupProductosInformacion.get("descripcion").value;

    if (helpers.isNotEmpty(descripcion)) {
      this.validacion.descripcion.error = false;
    } else {
      this.validacion.descripcion.error = true;
      this.validacion.descripcion.mensaje = "La descripción es inválida.";
      todoBien = false;
    }

    const descripcionWeb =
      this.formGroupProductosInformacion.get("descripcionWeb").value;

    if (helpers.isNotEmpty(descripcionWeb)) {
      this.validacion.descripcionWeb.error = false;
    } else {
      this.validacion.descripcionWeb.error = true;
      this.validacion.descripcionWeb.mensaje =
        "La descripción Web es inválida.";
      todoBien = false;
    }

    if (!todoBien && this.formGroupProductosInformacion.valid) {
      notify(
        "Por favor, revise que todos los campos sean correctos.",
        "error",
        3000
      );
    }

    return todoBien;
  }

  async agregar() {
    this.submit = true;
    this.botonAgregarDeshabilitado = true;

    if (!(await this.validarFormulario())) {
      this.botonAgregarDeshabilitado = false;
      return;
    }
    Alertas.load();

    const dto: ProductoInformacion = <ProductoInformacion>{
      ...this.formGroupProductosInformacion.value,
      usuarioAgregaId: helpers.obtenerUsusarioIdInt(
        this._loginService.Usuario.id
      ),
    };

    this._servicio.guardar(dto).subscribe(
      (res) => {
        console.log(res);

        if (res.respuestaTipo === 1) {
          Alertas.error("Error", res.respuesta);
          return;
        }
        this.actualizarGrid(() => {
          this.limpiar();

          Alertas.ok("¡Correcto!", "Los datos se han agregado correctamente.");
        });
      },
      (error) => {
        helpers.procesarError(error);
      }
    );

    this.submit = false;
    this.botonAgregarDeshabilitado = false;
    Alertas.close();
  }

  async editar() {
    this.submit = true;
    this.botonEditarDeshabilitado = true;

    if (!(await this.validarFormulario())) {
      this.botonEditarDeshabilitado = false;
      return;
    }

    Alertas.load();

    const dto: ProductoInformacion = <ProductoInformacion>{
      ...this.formGroupProductosInformacion.value,
      usuarioModificaId: helpers.obtenerUsusarioIdInt(
        this._loginService.Usuario.id
      ),
    };

    this._servicio.editar(dto).subscribe(
      (res) => {
        this.actualizarGrid(() => {
          this.limpiar();

          Alertas.ok(
            "¡Correcto!",
            "Los datos se han actualizado exitosamente."
          );
        });
      },
      (error) => {
        helpers.procesarError(error);
      }
    );

    this.submit = false;
    this.esEdicion = false;
    Alertas.close();
  }

  onItemReordered(event){
    console.log(event);
  }
}
