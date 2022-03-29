import { Component, OnInit } from "@angular/core";
import { Alertas } from "../../../../helpers/notificaciones/notificaciones";
import { BusquedaMetaOncologico } from "../../models/BusquedaMetaOncologico.model";
import { MetaOncologicoSucursal } from "../../models/MetaOncologicoSucursal.model";
import { MetaOncologicoZona } from "../../models/MetaOncologicoZona.model";
import { ReporteMetaOncologicosService } from "../../services/reporte-meta-oncologicos.service";

@Component({
  selector: "app-reporte-inicio",
  templateUrl: "./reporte-inicio.component.html",
  styleUrls: ["./reporte-inicio.component.css"],
})
export class ReporteInicioComponent implements OnInit {
  public mostrarReportePorZona: Boolean = false;
  public mostrarReportePorCiudad: boolean = false;
  public mostrarReportePorSucursal: Boolean = false;

  public metasOncologicosPorSucursal: MetaOncologicoSucursal[] = [];
  public metasOncologicosPorZona: MetaOncologicoZona[] = [];

  constructor(
    private reporteMetasOncologicosService: ReporteMetaOncologicosService
  ) {}

  ngOnInit() {}

  obtenerReporteMetasOncologico(
    busquedaMetaOncolgico: BusquedaMetaOncologico
  ): void {
    if (busquedaMetaOncolgico.tipoReporte == 1) {
      this.mostrarReportePorZona = true;
      this.mostrarReportePorCiudad = false;
      this.mostrarReportePorSucursal = false;

      this.obtenerReporteMetasOncologicosPorZona(busquedaMetaOncolgico);
    }

    if (busquedaMetaOncolgico.tipoReporte == 3) {
      this.mostrarReportePorZona = false;
      this.mostrarReportePorCiudad = false;
      this.mostrarReportePorSucursal = true;

      this.obtenerReporteMetasOncologicosPorSucursal(busquedaMetaOncolgico);
    }
  }

  obtenerReporteMetasOncologicosPorSucursal(
    busquedaMetaOncologico: BusquedaMetaOncologico
  ): void {
    this.metasOncologicosPorSucursal = []
    Alertas.load();
    this.reporteMetasOncologicosService
      .obtenerMetaOncologicosPorSucursal(
        busquedaMetaOncologico.anio,
        busquedaMetaOncologico.mes
      )
      .subscribe(
        (data) => {
          this.metasOncologicosPorSucursal = data;
          console.log(data);
          Alertas.ok(
            "Datos obtenidos",
            "Se han obtenido las metas de oncológicos satisfactoriamente."
          );
        },
        (error) => {
          Alertas.error(
            "Error",
            "Ha ocurrido un error al momento de obtener las metas."
          );
        }
      );
  }

  obtenerReporteMetasOncologicosPorZona(
    busquedaMetaOncologico: BusquedaMetaOncologico
  ): void {
    this.metasOncologicosPorZona = []
    Alertas.load();
    this.reporteMetasOncologicosService
      .obtenerMetaOncologicosPorZona(
        busquedaMetaOncologico.anio,
        busquedaMetaOncologico.mes
      )
      .subscribe(
        (data) => {
          this.metasOncologicosPorZona = data;
          console.log(data);
          Alertas.ok(
            "Datos obtenidos",
            "Se han obtenido las metas de oncológicos satisfactoriamente."
          );
        },
        (error) => {
          Alertas.error(
            "Error",
            "Ha ocurrido un error al momento de obtener las metas."
          );
        }
      );
  }
}
