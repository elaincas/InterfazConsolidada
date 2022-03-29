import swal from 'sweetalert2';
import { isNull } from 'util';
import { IRespuesta, RespuestaTipo } from "../respuestas/respuesta";
import { helpers } from "../utils";
import { SwalPosition } from "./SwalPosition";

export module Alertas {


  export async function inputModal(titulo: string = '', mensaje = ''): Promise<any> {
    Alertas.close();
    const { value: text } = await swal({
      input: 'textarea',
      title: titulo,
      showCancelButton: false,
      buttonsStyling: false,
      confirmButtonClass: 'mat-raised-button mat-accent',
      cancelButtonClass: 'mat-raised-button mat-warn',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      allowOutsideClick: false,
    });

    return text;
  }

  export function okAsinc(titulo: string = "", mensaje = "", toast: boolean = false, position: SwalPosition = SwalPosition.center): Promise<any> {

    const promesa = new Promise((resolve, reject) => {
      swal({
        type: "success",
        title: titulo,
        text: mensaje,
        buttonsStyling: true,
        confirmButtonClass: "mat-raised-button mat-accent",
        toast: toast,
        position: position,
      }).then(data => {
        resolve()
      }).catch(data => {
        resolve();
      });
    });

    return promesa;
  }

  export function ok(titulo: string = "", mensaje = "", toast: boolean = false, position: SwalPosition = SwalPosition.center): void {
    Alertas.close();
    setTimeout(() => {
      swal({
        type: "success",
        title: titulo,
        text: mensaje,
        buttonsStyling: false,
        confirmButtonClass: "btn btn-success",
        toast: toast,
        position: position
      });
    }, 50);
  }

  export function info(titulo: string = "", mensaje = "", toast: boolean = false, position: SwalPosition = SwalPosition.center): void {
    Alertas.close();
    swal({
      type: "info",
      title: titulo,
      text: mensaje,
      buttonsStyling: false,
      confirmButtonClass: "btn btn-success",
      toast: toast,
      position: position
    });
  };

  export function warning(titulo: string = "", mensaje = ""): void {
    swal({
      type: "warning",
      title: titulo,
      text: mensaje,
      buttonsStyling: false,
      confirmButtonClass: "btn btn-success"
    });
  };

  export function error(titulo: string = "", mensaje = ""): void {
    swal({
      type: "error",
      title: titulo,
      text: mensaje,
      buttonsStyling: false,
      confirmButtonClass: "btn btn-success"
    });
  };

  export function operacionNoCompletada(
    titulo: string = "",
    mensaje = "No se pudo completar la petición, Por favor intente nuevamente o contacte a soporte técnico") {
    Alertas.warning(titulo, mensaje);
  }

  export function noTienePermisoParaAcceder(
    titulo: string = "",
    mensaje = "Su perfil no tiene permiso para acceder a esta pantalla,  si los requiere debe comunicarse con el departamento de TI.") {
    Alertas.warning(titulo, mensaje);
  }

  export function errorEnServidor(
    titulo: string = "",
    mensaje = "Ocurrió un error en el servidor, Por favor intente nuevamente o contacte a soporte técnico") {
    Alertas.error(titulo, mensaje);
  }

  export function datosModificados(
    titulo: string = "",
    mensaje = "Los datos fueron modificados correctamente") {
    Alertas.ok(titulo, mensaje);
  }

  export function show(respuesta: IRespuesta) {
    if (respuesta.Tipo == RespuestaTipo.Ok) {
      ok(respuesta.Titulo, respuesta.Mensaje)
    }

    if (respuesta.Tipo == RespuestaTipo.Validacion) {
      info(respuesta.Titulo, respuesta.Mensaje)
    }

    if (respuesta.Tipo == RespuestaTipo.ValidacionMenor) {
      warning(respuesta.Titulo, respuesta.Mensaje)
    }
  }

  export function close() {
    swal.close();
  }

  export function showValidationMessage(error: any, titulo: string = ""){
    swal.close();

    if(helpers.isNull(error) && helpers.isNull(error._body)){
      return;
    }

    if(error.status === 400){
      warning(titulo, error._body)
    }
  }

  export function showHttpResponse(error: any, titulo: string = "", esGaraphql = false) {
    swal.close();

    if (helpers.isNull(error)) {
      return;
    }

    if (helpers.isNull(error.status) || error.status == 0 || helpers.isNull(error._body)) {
      operacionNoCompletada();
      return;
    }

    if (error.status === 500) {
      errorEnServidor();
      return;
    }

    let body = JSON.parse(error._body);

    if (esGaraphql) {
      warning(titulo, body[0].Message);
      return;
    }

    if (helpers.isNull(body.message)) {
      warning(titulo, body);
      return;
    }
    warning(titulo, body.message);
  }

  export function load(titulo: string = "Espere un momento por favor", mensaje = ""): void {
    swal({
      title: titulo,
      text: mensaje,
      showConfirmButton: false,
      allowOutsideClick: false,
      onOpen: function () {
        swal.showLoading();
        $(".swal2-spacer").css({ "margin": "10px 0" });
      }
    });
  }

  export function question(
    titulo: string,
    mensaje = "",
    confirmButtonText = "Sí",
    cancelButtonText = "No"
  ): Promise<any> {

    const promesa = new Promise((resolve, reject) => {
      Alertas.close();
      setTimeout(() => {
        swal({
          title: titulo,
          text: mensaje,
          type: 'question',
          showCancelButton: true,
          confirmButtonClass: 'btn btn-Azulsiman',
          cancelButtonClass: 'btn btn-danger',
          confirmButtonText: confirmButtonText,
          cancelButtonText: cancelButtonText,
          allowOutsideClick: false,
          buttonsStyling: false,
        }).then((result) => {

          if (result.value === undefined) {
            reject();
          }

          if (result.value !== true) {
            reject();
          }
          resolve();
        })

          .catch(function () {
            reject();
          });
      }, 50);

    });

    return promesa;
  }
}

export module Notificaciones {
  declare var $: any;


  export function success(mensaje: string) {
    show(mensaje, 'success', 500);
  }

  export function error(mensaje: string) {
    show(mensaje, 'danger', 500);
  }


  export function show(mensaje: string, type: string, tiempo: number) {
    $.notify({
      icon: "notifications",
      message: mensaje
    }, {
      type: type,
      timer: tiempo,
      z_index: 99999,
      placement: {
        from: "top",
        align: "right"
      }
    });
  }

}

