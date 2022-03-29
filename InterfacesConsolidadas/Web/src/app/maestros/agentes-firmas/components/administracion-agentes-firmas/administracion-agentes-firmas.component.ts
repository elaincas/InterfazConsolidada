import { Component, OnInit } from "@angular/core";
import { Alertas } from "../../../../helpers/notificaciones/notificaciones";
import { AccionPopupEnum } from "../../../sucursales-sellos/enums/accionPopup.enum";
import { AgenteFirma } from "../../models/agente-firma.model";
import { AgentesFirmasService } from "../../services/agentes-firmas.service";

@Component({
  selector: "app-administracion-agentes-firmas",
  templateUrl: "./administracion-agentes-firmas.component.html",
  styleUrls: ["./administracion-agentes-firmas.component.css"],
})
export class AdministracionAgentesFirmasComponent implements OnInit {
  public agentesFirmas: AgenteFirma[] = [];
  public esPopupAgentesFirmasVisible: boolean = false;
  public accionPopup: AccionPopupEnum;
  public agenteFirmaPopup: AgenteFirma;
  public esModoEditar: boolean = false;

  public gridBoxValueAgenteId: string[] = [];

  constructor(
    private _agentesFirmasService: AgentesFirmasService
  ) {}

  ngOnInit() {
    this.obtenerAgentesFirmas();
  }

  obtenerAgentesFirmas(): void {
    this._agentesFirmasService.obtenerAgentesFirmas().subscribe(
      (data) => {
        this.agentesFirmas = data;
      },
      (error) => {
        Alertas.error(
          "Error",
          "No se pudo obtener el listado de firmas de agentes."
        );
      }
    );
  }

  mostrarPopupFirmasAgentesAgregar(): void {
    this.accionPopup = AccionPopupEnum.agregar;
    this.agenteFirmaPopup = {};
    this.gridBoxValueAgenteId = [];
    this.esPopupAgentesFirmasVisible = true;
  }

  mostrarPopupConsulta(agenteFirma: AgenteFirma): void {
    agenteFirma.rutaImagenFirma = `${agenteFirma.rutaImagenFirma}?${
      Math.floor(Math.random() * 100) + 1
    }`;
    this.esModoEditar = true;
    this.agenteFirmaPopup = agenteFirma;
    this.gridBoxValueAgenteId = [];
    this.gridBoxValueAgenteId.push(agenteFirma.agenteId);
    this.accionPopup = AccionPopupEnum.modificar;
    this.esPopupAgentesFirmasVisible = !this.esPopupAgentesFirmasVisible;
  }

  onCerrarPopup(): void {
    this.esPopupAgentesFirmasVisible = false;
    this.esModoEditar = false;
  }

  abrirImagenNuevaVentana(enlace: string): void {
    window.open(enlace);
  }
}
