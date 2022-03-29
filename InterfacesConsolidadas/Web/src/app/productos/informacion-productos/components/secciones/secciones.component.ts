import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import {
  DxDropDownBoxComponent,
  DxLookupComponent,
  DxSelectBoxComponent,
} from "devextreme-angular";
import notify from "devextreme/ui/notify";
import { Alertas } from "../../../../helpers/notificaciones/notificaciones";
import { helpers } from "../../../../helpers/utils";
import { LoginService } from "../../../../login/services/login.service";
import { Lookup } from "../../models/lookup.model";
import { ProductoInformacionSeccion } from "../../models/seccion.model";
import { ProductoInformacionService } from "../../services/producto-informacion.service";
import { SeccionService } from "../../services/seccion.service";

@Component({
  selector: "app-seccion",
  templateUrl: "./secciones.component.html",
  styleUrls: ["./secciones.component.css"],
})
export class SeccionesComponent implements OnInit {
  @ViewChild("lokupProductoInformacion")
  _lookupProductoInformacion: DxLookupComponent;

  @ViewChild("lookupSeccionTipo")
  _lookupSeccionesTipos: DxLookupComponent;

  secciones: ProductoInformacionSeccion[];
  formGroupSecciones: FormGroup;
  productoInformacionLookup: Lookup[];
  seccionesTipoLookup: Lookup[];
  validacion: any;

  productoInformacionId: number;
  seccionTipoId: number;

  submit: boolean;
  botonAgregarDeshabilitado: boolean;
  botonEditarDeshabilitado: boolean;
  esEdicion: boolean;

  constructor(
    private _seccionServicio: SeccionService,
    private _servicioProductoInformacion: ProductoInformacionService,
    private _formBuilder: FormBuilder,
    private _loginService: LoginService
  ) {
    this.submit = false;
    this.botonAgregarDeshabilitado = false;
    this.botonAgregarDeshabilitado = false;
    this.esEdicion = false;
    this.productoInformacionId = helpers.VALOR_POR_DEFECTO_ID;
    this.seccionTipoId = helpers.VALOR_POR_DEFECTO_ID;

    this.validacion = {
      descripcion: {
        error: false,
        mensaje: "",
      },
      titulo: {
        error: false,
        mensaje: "",
      },
      productoInformacionId: {
        error: false,
        mensaje: "",
      },
      productoInformacionSeccionTipoId: {
        error: false,
        mensaje: "",
      },
    };
  }

  ngOnInit() {
    this.construirFormulario();
    this.obtener();
  }

  construirFormulario() {
    this.formGroupSecciones = this._formBuilder.group({
      id: new FormControl(helpers.VALOR_POR_DEFECTO_ID),
      descripcion: new FormControl(),
      titulo: new FormControl(),
      activo: new FormControl(true),
    });
  }

  procesarError() {
    return (error) => {
      console.log(error);
      Alertas.close();
      helpers.procesarError(error);
    };
  }

  obtener(): void {
    this._seccionServicio.obtener().subscribe((data) => {
      Alertas.close();
      this.secciones = data;
    }, this.procesarError());

    this._servicioProductoInformacion.obtenerLookup().subscribe((data) => {
      Alertas.close();
      this.productoInformacionLookup = data;
    }, this.procesarError());

    this._seccionServicio.obtenerLookupSeccionesTipos().subscribe((data) => {
      Alertas.close();
      this.seccionesTipoLookup = data;
      console.log(data);
    }, this.procesarError());
  }

  actualizarGrid(onComplete?: Function): void {
    Alertas.load();
    this._seccionServicio.obtener().subscribe({
      next: (data) => {
        Alertas.close();
        this.secciones = data;
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

  validarFormulario(): boolean {
    let todoBien = true;

    const descripcion = this.formGroupSecciones.get("descripcion").value;

    if (helpers.isNotEmpty(descripcion)) {
      this.validacion.descripcion.error = false;
    } else {
      this.validacion.descripcion.error = true;
      this.validacion.descripcion.mensaje = "La descripción es inválida.";
      todoBien = false;
    }

    const titulo = this.formGroupSecciones.get("titulo").value;

    if (helpers.isNotEmpty(titulo)) {
      this.validacion.titulo.error = false;
    } else {
      this.validacion.titulo.error = true;
      this.validacion.titulo.mensaje = "El título es inválido.";
      todoBien = false;
    }

    const productoInformacionId = this.productoInformacionId;

    if (!productoInformacionId) {
      this.validacion.productoInformacionId.error = true;
      this.validacion.productoInformacionId.mensaje =
        "Seleccione la información para esta sección.";
      todoBien = false;
    } else {
      this.validacion.productoInformacionId.error = false;
    }

    const productoInformacionSeccionTipoId = this.seccionTipoId;

    if (!productoInformacionSeccionTipoId) {
      this.validacion.productoInformacionSeccionTipoId.error = true;
      this.validacion.productoInformacionSeccionTipoId.mensaje =
        "Seleccione el tipo de sección.";
      todoBien = false;
    } else {
      this.validacion.productoInformacionSeccionTipoId.error = false;
    }

    if (!todoBien && this.formGroupSecciones.valid) {
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

    console.log(this.formGroupSecciones.value);

    if (!(await this.validarFormulario())) {
      this.botonAgregarDeshabilitado = false;
      return;
    }
    Alertas.load();

    const dto: ProductoInformacionSeccion = <ProductoInformacionSeccion>{
      ...this.formGroupSecciones.value,
      productoInformacionId: this.productoInformacionId,
      productoInformacionSeccionTipoId: this.seccionTipoId,
      usuarioAgregaId: helpers.obtenerUsusarioIdInt(
        this._loginService.Usuario.id
      ),
    };

    this._seccionServicio.guardar(dto).subscribe(
      (res) => {
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

    const dto: ProductoInformacionSeccion = <ProductoInformacionSeccion>{
      ...this.formGroupSecciones.value,
      productoInformacionId: this.productoInformacionId,
      productoInformacionSeccionTipoId: this.seccionTipoId,
      usuarioModificaId: helpers.obtenerUsusarioIdInt(
        this._loginService.Usuario.id
      ),
    };

    this._seccionServicio.editar(dto).subscribe(
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

  limpiar() {
    this.formGroupSecciones.reset();
    this.formGroupSecciones.get("activo").setValue(true);
    this.formGroupSecciones.get("id").setValue(helpers.VALOR_POR_DEFECTO_ID);

    this.esEdicion = false;
    this.botonEditarDeshabilitado = false;
    this.botonAgregarDeshabilitado = false;
    this.submit = false;
    this._lookupProductoInformacion.value = helpers.VALOR_POR_DEFECTO_ID;
    this._lookupSeccionesTipos.value = helpers.VALOR_POR_DEFECTO_ID;
  }

  inactivar(id: number) {
    Alertas.question("", "¿Desea inactivar este registro?").then(() => {
      Alertas.load();
      this._seccionServicio.inactivar(id).subscribe(
        (seInactivo) => {
          if (seInactivo) {
            this.secciones = this.secciones.map((registro) => {
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

  activar(id: number) {
    Alertas.load();
    this._seccionServicio.activar(id).subscribe(
      (seInactivo) => {
        if (seInactivo) {
          this.secciones = this.secciones.map((registro) => {
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

  obtenerValoresParaActualizar(seccion: ProductoInformacionSeccion) {
    this.esEdicion = true;
    this.formGroupSecciones.get("activo").setValue(seccion.activo);
    this.formGroupSecciones.get("descripcion").setValue(seccion.descripcion);
    this.formGroupSecciones.get("titulo").setValue(seccion.titulo);

    this.formGroupSecciones.get("id").setValue(seccion.id);

    this.productoInformacionId = seccion.productoInformacionId;
    this.seccionTipoId = seccion.productoInformacionSeccionTipoId;
  }

  GetDisplayExprLookup(item: Lookup) {
    if (!item) {
      return "";
    }

    return item.descripcion;
  }
}
