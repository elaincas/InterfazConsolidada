export class LoadGridOptions {
    public Page: number;
    public PageSize: number;
    public ColumnFilter: string;
    public FilterValue: string;
    public Sorts: ColumnaOrdenar[];
    public FechaInicio: Date;
    public FechaFin: Date;
    /**
     *
     */
    constructor() {
         
       
        this.FechaFin = new Date();
        let hoy = new Date();
        let dieciseisDias = 1000 * 60 * 60 * 24 * 30;
        let resta = hoy.getTime() - dieciseisDias;
        this.FechaInicio = new Date(resta);
    }
}
export class ColumnaOrdenar {

    ColumnaNombre: string;
    Desc: boolean;
}