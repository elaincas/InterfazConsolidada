import { dashCaseToCamelCase } from "@angular/compiler/src/util";

export class ConsultorioMedico
{
    Id : number = 0;
    ConsultorioId : number = 0;
    Activo : boolean = false;
    FechaAgrega : Date = new Date;
    UsuarioAgregaId : string = "";
    MedicoId: number = 0;
}