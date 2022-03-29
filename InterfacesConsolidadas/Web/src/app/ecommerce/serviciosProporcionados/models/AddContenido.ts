export class AddContenido {
    constructor(
        public id: number = 0,
        public contenido: string = '',
        public servicioProporcionadoColumnaId: number = 0,
        public enlace: string = '#'
    ) {}
}