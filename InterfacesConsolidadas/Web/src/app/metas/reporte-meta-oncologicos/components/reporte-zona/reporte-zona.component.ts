import { Component, Input, OnInit } from "@angular/core";
import { MetaOncologicoZona } from "../../models/MetaOncologicoZona.model";

@Component({
  selector: "app-reporte-zona",
  templateUrl: "./reporte-zona.component.html",
  styleUrls: ["./reporte-zona.component.css"],
})
export class ReporteZonaComponent implements OnInit {
  
  @Input() metasOncologicosPorZona: MetaOncologicoZona[];

  constructor() {}

  ngOnInit() {}
}
