export class Zonas{
    constructor (
        public ZonaID:string = "",
        public Zona :string = ""
    ){

    }
}

export class ZonaEncargado{
    constructor(
        public ZonaEncargadoID: number = 0,
        public Descripcion: string = "",
        public ZonaID: number = 0,
        public UsuarioEncargadoID: number = null,
        public UsuarioId: number = 0,
   ){

    }
  
}
