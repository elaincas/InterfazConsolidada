import { ColumnaInformacionBasica } from "./columna-informacion-basica.model";

export interface TablaDto {
  pivot: string;
  columnas: ColumnaInformacionBasica[];
}
