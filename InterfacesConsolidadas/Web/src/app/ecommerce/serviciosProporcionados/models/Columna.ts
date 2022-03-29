
export class Columna{
    constructor(
        public id :number = 0,
        public titulo: string = '',
        public contenidoTipo: number = 0,
        public contenido: string = '',
        public contenidoLista: any[] = [],
        public enlace: string = '',
        public archivoContenido: any[] = [],
        public usuarioAgrega : number = 0,
        public urlContenido: string = '',
        public contenidoTipoId: number = 0
    ){}
}