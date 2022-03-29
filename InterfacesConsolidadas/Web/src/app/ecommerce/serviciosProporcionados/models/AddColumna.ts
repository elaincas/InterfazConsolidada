
export class AddColumna{
    constructor(
        public titulo: string = '',
        public contenidoTipo: number = 0,
        public contenido: string = '',
        public contenidoLista: any[] = [],
        public enlace: string = '#',
        public archivoContenido: any[] = [],
        public usuarioAgrega : number = 0,
        public urlContenido: string = ''
    ){}
}