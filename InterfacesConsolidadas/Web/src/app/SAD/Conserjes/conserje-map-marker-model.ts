import { Conserje } from "./Administrar-Conserjes/models/Conserje";

export class ConserjeMapMarker {
  constructor(
    public conserje: Conserje = new Conserje(),
    public marker: google.maps.Marker
  ) {
  }
}