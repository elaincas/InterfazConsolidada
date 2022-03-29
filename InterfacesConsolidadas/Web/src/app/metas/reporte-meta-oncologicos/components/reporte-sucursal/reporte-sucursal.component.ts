import { Component, Input, OnInit } from "@angular/core";
import { Alertas } from "../../../../helpers/notificaciones/notificaciones";
import { MetaOncologicoSucursal } from "../../models/MetaOncologicoSucursal.model";
import { ReporteMetaOncologicosService } from "../../services/reporte-meta-oncologicos.service";

@Component({
  selector: "app-reporte-sucursal",
  templateUrl: "./reporte-sucursal.component.html",
  styleUrls: ["./reporte-sucursal.component.css"],
})
export class ReporteSucursalComponent implements OnInit {
  @Input() metasOncologicosPorSucursal: MetaOncologicoSucursal[];

  constructor(
    private reporteMetaOncologicosService: ReporteMetaOncologicosService
  ) {}

  ngOnInit() {
  }
}
