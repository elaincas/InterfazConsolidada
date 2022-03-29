import { Categoria } from './categorias.model';
import { AnalisisRequisito } from './analisisRequisito.model';
import { TimeInterval, Timestamp } from 'rxjs';
import { AnalisisLaboratorios } from './analisisLaboratorio.model';
import { MuestraTipo } from './muestraTipo.model';
import { AnalisisInsumo } from './analisisInsumo.model';
import { AnalisisParametro } from './analisisParametro.model';

export class Analisis {
    public  prodId: string;
    public  activo: boolean;
    public  fechaAgrega: Date;
    public  descripcion: string;
    public  nombre: string;
    public  sinonimo: string;
    public  categoriaId: number;
    public  categoria: Categoria;
    public  tiempoDeEntrega: string;
    public  precioPublico: number;
    public  analisisRequisitos: AnalisisRequisito[];
    public  analisisLaboratorios: AnalisisLaboratorios[];
    public  muestraTipoId: number;
    public  muestra: MuestraTipo;
    public  analisisInsumos: AnalisisInsumo[];
    public  analisisParametros: AnalisisParametro[];
    public totalMilisegundos: number;
    constructor(){
      this.activo = true;
      this.fechaAgrega = new Date();
    }
}
