export class DistribuidorExternoCategorias {
    constructor(
        public id: number = 0,
        public nombre: string = '',
        public distribuidorExternoId: number = 0,
        public idExterno: string = '',
        public activo: boolean = true,
        public usuarioId: number = 0,
        public fechaAgrega: Date = new Date
    ) { }
 }