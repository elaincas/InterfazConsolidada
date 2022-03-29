

export class Archivos {
    /**
     *
     */
    constructor(
        public UrlArchivo: string = "",
        public FileName: string = "",
        public File : File,
        public UsuarioCrea: number = 0,
        public Observaciones: string = "",
        public ArchivoId:number = 0
    ) {
    }
}