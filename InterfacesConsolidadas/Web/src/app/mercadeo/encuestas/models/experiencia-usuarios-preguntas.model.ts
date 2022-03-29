import { BaseDto } from '../../models/base-dto.model';

export class ExperienciaUsuariosPreguntas extends BaseDto {
  public id: number;
  public descripcion: string;
  public imagenSatisfechoURL: string;
  public imagenInsatisfechoURL: string;
  public fechaAgrega: string;
  public activo: boolean;
  public pedidosTiposIds: any;
  public calificaciones: number;
}
