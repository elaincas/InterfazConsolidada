import { TiposArchivos } from "./EnumArchivo";

export class Archivos {
    /**
     *
     */
    constructor(
        public PlanimetriaID: number = 0,
        public UrlArchivo: string = "",
        public TipoArchivoID: number = 0,
        public FileName: string = "",
        public File : File,
        public UsuarioCrea: number = 0,
        public Observaciones: string = "",
        public ArchivoId:number = 0,
        public OrdenId: number = 0,
        public Alt: string = ""
    ) {
    }
}


export class ArchivoExcelEImagenes{
    /**
     *
     */
    constructor(
        public ArchivoImagen:Archivos = null,
        public ArchivoExcel:Archivos = null,
        public UsuarioCrea: number = 0,
        public Observaciones: string = " ",
        public ArchivoVideo:Archivos = null,
        public OrdenId: number = 0,
        public Alt: string = ""
    
        ) {
    }

}
        export class DevolverArchivo{

            constructor(       
                public  NombreImagen: string = null,
                public  Imagen: Blob,
                public Observaciones: string = "",
                public archivos: Array<DevolverArchivo> = null,
                public archivoId:number = 0 ) {
                    
            }
        }