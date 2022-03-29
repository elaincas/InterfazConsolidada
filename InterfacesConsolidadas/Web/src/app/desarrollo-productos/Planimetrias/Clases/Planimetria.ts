import { Archivos, ArchivoExcelEImagenes } from "./Archivos";
import { Sucursales } from "./Sucursales";

export class Planimetria {
    constructor(
        public Descripcion: string = "",
        public FechaInicial: Date = new Date,
        public FechaFinal: Date = new Date,
        public Observacion: string = "",
        public TipoPlanimetriaID: number = 0,
        public Archivos: ArchivoExcelEImagenes[] = new Array<ArchivoExcelEImagenes>(),
        public Sucursales: Sucursales[] = new Array<Sucursales>(),
        public UsuarioCrea: number = 0,
        public SucursalID:number = 0,
        public mesAnio:string="",
        public EstadoID: boolean = false,
        public PlanimetriaID: number = 0,
        public ArchivoId:number =0
    ) {

    }
    toJson(): string {
        let objeto = {
            descripcion: this.Descripcion,
            FechaInicial: this.FechaInicial,
            FechaFinal: this.FechaFinal,
            Observacion: this.Observacion,
            TipoPlanimetriaID: this.TipoPlanimetriaID,
            Archivos: this.Archivos,
            Sucursales: this.Sucursales,
            UsuarioCrea: this.UsuarioCrea,
            SucursalID: this.SucursalID
        };

        return JSON.stringify(objeto);
    }
}