import { AddColumna } from "./AddColumna";

export class Seccion {
    constructor(
        public id: number = 0,
        public titulo: string = '',
        public iconoUrl :string = '',
        public servicioProporcionadoId: number = 0,
        public archivoSeccionIcono: any[] = [],
        public columnas: AddColumna[] = [],
        public orden: number = 0
    ) {}
}