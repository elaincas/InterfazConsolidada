export class Colaborador {
    /**
     *
     */
    constructor(
            public colaboradorID : number = 0,
            public nombre : string = "",
            public listaColaboradores : Array<Colaborador> = new Array<Colaborador>(),
    ) {

    }

}
