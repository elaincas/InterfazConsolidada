import { Respuesta } from "../helpers/respuestav2";
import { Imagen } from "./imagen";
import { ImagenTipo } from "./imagenTipo";

export interface ImagenSubidaDto{
  imagen: Respuesta<Imagen>,
  imagenTipo: ImagenTipo
}
