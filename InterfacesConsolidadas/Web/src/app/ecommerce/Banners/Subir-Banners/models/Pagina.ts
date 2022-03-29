import {PaginaPosicion} from './PaginaPosicion';
import DateTimeFormat = Intl.DateTimeFormat;

export class Pagina {
  constructor (
     public paginaId: number = 0,
     public descripcion: string = '',
     public nombre: string = '',
     public paginasPosicion: any[] = [],
     public state: string = '',
     public activo: boolean = false,
     public fechaAgrega: Date = new Date
  ) {}
}
