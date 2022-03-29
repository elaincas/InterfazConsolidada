import { AddColumna } from "./AddColumna";

export class AddSeccion {
    constructor(
        public titulo: string = '',
        public iconoUrl: string = '',
        public servicioId: number = 0,
        public archivoSeccionIcono: any[] = [],
        public columnas: AddColumna[] = [],
        public usuarioAgrega: number = 0,
        public orden: number = 0
    ) { }
}