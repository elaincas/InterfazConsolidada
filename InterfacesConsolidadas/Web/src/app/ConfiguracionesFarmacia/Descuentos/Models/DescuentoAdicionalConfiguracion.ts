export class DescuentoAdicionalConfiguracion {
    constructor(
        public id: number = 0,
        public descuento: number = 1,
        public configuracion: string = '',
        public usuarioAgrega: number = 0,
        public esParaTerceraEdad: boolean = true,
        public usuarioModifica: number = 0
    ){}
}

export class DescuentoAdicionalConfiguracionConsulta {
    constructor(
        public id: number = 0,
        public descuento: number = 0,
        public configuracion: string = '',
        public usuarioModifica: number = 0,
        public esParaTerceraEdad: boolean = true,
        public usuarioNombre: string = '',
        public fechaAgrega: Date = new Date()
    ){}
}