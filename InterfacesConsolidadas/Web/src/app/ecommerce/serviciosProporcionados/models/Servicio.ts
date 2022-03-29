import { Seccion } from "./Seccion";
import { AddSeccion } from "./AddSeccion";
import { ServicioDetalle } from "./ServicioDetalle";

export class Servicio{
    constructor(
        public servicioId: number = 0,
        public descripcion: string = '',
        public iconoWebUrl: string = '',
        public iconoMovilUrl: string = '',
        public paginaId: number = 0,
        public orden: number = 0,
        public subtitulo1: string = '',
        public subtitulo2: string = '',
        public tieneFechaDeFinalizacion: boolean = false,
        public fechaInicio: Date = new Date(Date.now()),
        public fechaFinalizacion: Date = new Date(Date.now()),
        public usuarioAgrega: number = 0,
        public fechaAgrega: Date = new Date(),
        public usuarioModifica: number = 0,
        public fechaModifica: Date = new Date(),
        public archivoIconoApp: any[] = [],
        public archivoIconoWeb: any[] = [],
        public secciones: AddSeccion[] = [],
        public detalles: ServicioDetalle[] = [],
        public paginaWebLink: string = '',
        public paginaWebVisible: boolean = false,
        public deshabilitadoPorFechaDeFinalizacion: boolean = false
    ){}
}