import { AddSeccion } from "./AddSeccion";
import { ServicioDetalle } from "./ServicioDetalle";

export class addServicio{
    constructor(
        public descripcion: string = '',
        public subtitulo1: string = '',
        public subtitulo2: string = '',
        public tieneFechaDeFinalizacion: boolean = false,
        public fechaInicio: Date = new Date(),
        public fechaFinalizacion: Date = new Date(),
        public archivoIconoApp: any[] = [],
        public archivoIconoWeb: any[] = [],
        public archivoBannerWeb: any[] = [],
        public archivoBannerMovil: any[] = [],
        public secciones: AddSeccion[] = [],
        public detalles: ServicioDetalle[] = [],
        public paginaWebLink: string = ''
    ){}
}