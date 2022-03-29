import file_uploader from "devextreme/ui/file_uploader";
import { ArchivoExcelEImagenes } from "../../../desarrollo-productos/Planimetrias/Clases/Archivos";


export class ProductoArchivo {
    constructor(
        public ProductoId: string = "",
        public Archivos: ArchivoExcelEImagenes[] = [],
        public EsVideo: boolean = false,
        public UsuarioCrea : number = 0,
        public TagId : number = 0
        
    ) {

    }
    toJson(): string {
        let objeto = {
            Archivos: this.Archivos,
            ProductoId: this.ProductoId,
            EsVideo : this.EsVideo,
            UsuarioCrea: this.UsuarioCrea,
            TagId: this.TagId,
            
        };

        return JSON.stringify(objeto);
    }
}