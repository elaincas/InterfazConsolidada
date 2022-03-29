import { parse } from "querystring";
import { Alertas, Notificaciones } from "./notificaciones/notificaciones";
import { RespuestaTipo } from "../maestros/stickers/helpers/respuestav2";

declare var $: any;

export module helpers {
  export const cargando = 'Cargando...';
  export function isNull(objeto: any): boolean {
    return objeto == null || objeto == undefined;
  }

  export function isNullEmptyOrWhiteSpace(texto: string): boolean {
    if (isNull(texto)) {
      return true;
    }
    return texto == "" || texto == " ";
  }

  export function setFocus(control: any, timeOut: number = 0): void {
    if (control == undefined) {
      return;
    }

    if (control.instance == undefined) {
      return;
    }

    setTimeout(() => {
      control.instance.focus();
    }, timeOut);
  }

  export function esFechaValida(fecha) {
    return fecha instanceof Date && !isNaN(fecha.getTime());
  }

  export function obtenerHoraDeFecha(fecha: Date): string {
    let hours = fecha.getHours();
    let minutes = fecha.getMinutes() + "";

    if (minutes === "0") {
      minutes = "00";
    }

    let mid = " am";
    if (hours === 0) {
      hours = 12;
    }

    if (hours > 12) {
      hours = hours % 12;
      mid = " pm";
    }

    return hours + ":" + minutes + mid;
  }

  export interface IFileInput {
    id: string;
    allowedFileExtensions?: string[];
    maxFileSize?: number;
    maxImageWidth?: number;
    maxFilesNum?: number;
    showPreview?: boolean;
  }

  export function inicializarInputFile(info: IFileInput) {
    setTimeout(function () {
      const input = $($("#" + info.id)[0]);
      input.fileinput({
        maxFilesNum: info.maxFilesNum,
        showUpload: false,
        showUploadedThumbs: false,
        language: "es",
        maxFileSize: info.maxFileSize,
        maxImageWidth: info.maxImageWidth,
        allowedFileExtensions: info.allowedFileExtensions,
        showPreview: false,
      });
    }, 50);

    setTimeout(function () {
      $(".fileinput-remove-button").addClass("btn-danger");
      $(".btn-file").addClass("btn-Azulsiman");
    }, 55);
  }

  export function AgregarArchivoInputFile(id: string, file: File): void {
    if (helpers.isNullEmptyOrWhiteSpace(id) || helpers.isNull(file)) {
      return;
    }
    $("#" + id).fileinput("addToStack", file);
  }
  export function ObtenerArchivosInputFile(id: string): File {
    if (helpers.isNull(id)) {
      return null;
    }

    let archivos = $("#" + id)[0].files as File[];
    if (archivos == null) {
      return null;
    }
    return archivos[0];
  }

  export function LimpiarInputFile(id: string) {
    $("#" + id).fileinput("clear");
  }
  export function random(rango: number): number {
    return Math.floor(Math.random() * rango + 1);
  }

  export function procesarError(error) {
    switch (error.status) {
      case 400:
        try {
          Alertas.close();
          let errorJSON: any = JSON.parse(error._body);
          if (errorJSON.mensaje === null) {
            let errores = "";
            errorJSON.mensajes.forEach((mensaje) => {
              errores += mensaje + "\n";
            });
            Alertas.warning(errores);
          } else {
            Alertas.warning(errorJSON.mensaje);
          }
        } catch (err) {
          Alertas.showValidationMessage(error);
        }
        break;
      case 500:
        Alertas.errorEnServidor("Hubo un error en el servidor.", error._body);
        break;
      default:
        Alertas.showHttpResponse(error);
        break;
    }
  }

  export function isNotEmpty(value: any): boolean {
    return value !== undefined && value !== null && value !== "";
  }

  export function obtenerUsusarioIdInt(value: any): number {
    return typeof value === "string" ? parseInt(value) : value;
  }

  export function convertirAInt(value: any): number {
    return typeof value === "string" ? parseInt(value) : value;
  }

  export function mostrarMensajeSegunRespuesta(respuestaTipo: RespuestaTipo, mensaje: string) {
    switch (respuestaTipo) {
      case RespuestaTipo.Error:
        Notificaciones.error(mensaje);
      break;
      case RespuestaTipo.Validacion:
        Notificaciones.show(mensaje, 'warning', 500);
        break;
      default:
        break;
    }
  }

  export const VALOR_POR_DEFECTO_ID: number = 0;
}
