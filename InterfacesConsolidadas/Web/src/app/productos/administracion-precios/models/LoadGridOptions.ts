export class LoadGridOptions {
    public Page: number;
    public PageSize: number;
    public ColumnFilter: string;
    public FilterValue: string;
    public Sorts: ColumnaOrdenar[];
    public FechaInicio: Date;
    public FechaFin: Date;
}
export class ColumnaOrdenar {

    ColumnaNombre: string;
    Desc: boolean;
}