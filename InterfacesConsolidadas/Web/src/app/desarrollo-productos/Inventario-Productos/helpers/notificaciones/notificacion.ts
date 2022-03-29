import { IRespuesta, RespuestaTipo } from "../respuestas/respuesta";
import { helpers } from "../utils";
declare var $ : any;

export module Alertas {
    declare var swal: any;

    export function ok(titulo: string = "", mensaje = ""): void {
        swal({
            type: "success",
            title: titulo,
            text: mensaje,
            buttonsStyling: false,
            confirmButtonClass: "btn btn-Azulsiman"
        });
    };

    export function info(titulo: string = "", mensaje = ""): void {
        swal({
            type: "info",
            title: titulo,
            text: mensaje,
            buttonsStyling: false,
            confirmButtonClass: "btn btn-success"
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

    export function showHttpResponse(error: any, titulo: string = "") {
        if (helpers.isNull(error)) {
            return;
        }

        if (helpers.isNull(error.status) || error.status == 0 || helpers.isNull(error._body)) {
            operacionNoCompletada();
            return;
        }

        if (error.status == 500) {
            errorEnServidor();
            return;
        }

        let body = JSON.parse(error._body);
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
    };

    export function question(titulo: string, mensaje = "", confirmButtonText = "sí", cancelButtonText = "No"): Promise<any> {
        const promesa = new Promise((resolve, reject) => {
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

            }).then(function () {
                resolve();
            }).catch(function () {
            });
        })

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