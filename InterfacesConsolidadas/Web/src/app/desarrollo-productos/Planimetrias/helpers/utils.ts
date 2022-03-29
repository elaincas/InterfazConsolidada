declare var $: any;

export module helpers {
  export function isNull(objeto: any): boolean {
    return objeto == null || objeto == undefined;
  }

  export function isNullEmptyOrWhiteSpace(texto: string): boolean {
    if (isNull(texto)) {
      return true;
    }
    return texto == "" || texto == " ";
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
        language: 'es',
        maxFileSize: info.maxFileSize,
        maxImageWidth: info.maxImageWidth,
        allowedFileExtensions: info.allowedFileExtensions,
        showPreview: false
      });
    }, 50);

    setTimeout(function () {
      $(".fileinput-remove-button").addClass("btn-danger")
      $(".btn-file").addClass("btn-Azulsiman")
    }, 55);
  }

  export function AgregarArchivoInputFile(id: string, file: File): void {
    if (helpers.isNullEmptyOrWhiteSpace(id) || helpers.isNull(file)) {
      return;
    }
    $('#' + id).fileinput('addToStack', file);
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
    $("#" + id).fileinput('clear');
  }
  export function random(rango: number): number {
    return Math.floor((Math.random() * rango) + 1)
  }
}
