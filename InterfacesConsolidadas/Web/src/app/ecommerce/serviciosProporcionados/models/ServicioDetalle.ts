export class ServicioDetalle {
    constructor(
        public id: number = 0,
        public nivelTexto: number = 0,
        public color: string = '#2E75B6',
        public agregarEnlace: boolean = false,
        public enlace: string = '',
        public colorFondoEnlace: string = '#ffffff',
        public mostrarSobreBanner: boolean = true
    ) {}
}