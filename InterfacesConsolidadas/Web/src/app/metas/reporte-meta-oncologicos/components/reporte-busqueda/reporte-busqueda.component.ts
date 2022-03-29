import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Alertas } from "../../../../helpers/notificaciones/notificaciones";
import { BusquedaMetaOncologico } from "../../models/BusquedaMetaOncologico.model";
import { MesReporte } from "../../models/MesReporte.model";
import { TipoReporte } from "../../models/TipoReporte.model";
import { ReporteMetaOncologicosService } from "../../services/reporte-meta-oncologicos.service";

@Component({
  selector: "app-reporte-busqueda",
  templateUrl: "./reporte-busqueda.component.html",
  styleUrls: ["./reporte-busqueda.component.css"],
})
export class ReporteBusquedaComponent implements OnInit {
  public busquedaMetaOncologico: BusquedaMetaOncologico = {
    tipoReporte: null,
    anio: null,
    mes: null,
  };

  public tiposReporte: TipoReporte[] = [];
  public anios: number[] = [];
  public meses: MesReporte[] = [];

  @Output() obtenerBusquedaMetaOncologico =
    new EventEmitter<BusquedaMetaOncologico>();

  constructor(
    private repoteMetaOncologicosService: ReporteMetaOncologicosService
  ) {}

  ngOnInit() {
    this.obtenerTiposReporte();
    this.obtenerAnios();
    this.obtenerMeses();
  }

  mostrarReporte(e): void {
    if (this.esFormularioValido(e)) {
      this.obtenerBusquedaMetaOncologico.emit(this.busquedaMetaOncologico);      
    }
  }

  obtenerTiposReporte(): void {
    this.tiposReporte =
      this.repoteMetaOncologicosService.obtenerTiposReportes();
  }

  obtenerAnios(): void {
    this.repoteMetaOncologicosService.obtenerAniosReporte().subscribe(
      (data) => {
        this.anios = data;
      },
      (error) => {
        Alertas.error(
          "Error",
          "Ha ocurrido un error al momento de listar los años."
        );
      }
    );
  }

  obtenerMeses(): void {
    this.meses = this.repoteMetaOncologicosService.obtenerMesesReporte();
  }

  esFormularioValido(e): boolean {
    const validacion = e.validationGroup.validate();
    if (!validacion.isValid) {
      return false;
    }

    return true;
  }
}
