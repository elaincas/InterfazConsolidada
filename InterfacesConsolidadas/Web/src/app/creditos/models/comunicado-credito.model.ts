import { FormDataFileDto } from "./FormDataFileDto.model";
import { ComunicadoCreditoConfiguracion } from "./comunicado-credito-configuracion.model";

export class ComunicadoCredito{

    constructor(
        public  id : number =0,
        public  desde : Date = new Date,
        public  hasta :Date = new Date,
        public  titulo : string = "",
        public  descripcion :  string = "",
        public  clienteComunicadoTipoId : number = 0,
        public  fechaAgrega : Date = new Date,
        public  usuarioAgregaId : number = 0,
        public  fechaModifica : Date = new Date,
        public  usuarioModificaId :number = 0,
        public  activo : boolean = true,
        public  pathArchivo : string = "",
        public  imagen : any [] = [] ,
        public  formDataFileDto : FormDataFileDto = new FormDataFileDto(),
        public  comunicadosCreditosConfiguracion: ComunicadoCreditoConfiguracion[] = []
    ) {
        

    }
}