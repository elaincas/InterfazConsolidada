import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { DxFileUploaderComponent } from "devextreme-angular";
import { Alertas } from "../../../../helpers/notificaciones/notificaciones";
import { LoginService } from "../../../../login/services/login.service";
import { AccionPopupEnum } from "../../../sucursales-sellos/enums/accionPopup.enum";
import { AgenteFirma } from "../../models/agente-firma.model";
import { Agente } from "../../models/agente.model";
import { AgentesFirmasService } from "../../services/agentes-firmas.service";

@Component({
  selector: "app-agentes-firmas-popup",
  templateUrl: "./agentes-firmas-popup.component.html",
  styleUrls: ["./agentes-firmas-popup.component.css"],
})
export class AgentesFirmasPopupComponent implements OnInit {
  public agentes: Agente[] = [];

  @Input() gridBoxValue: string[];
  @Input() esModoEditar: boolean;
  @Input() agenteFirma: AgenteFirma;
  @Input() accionPopup: AccionPopupEnum;
  @Input() esPopupAgentesFirmasVisible: boolean;
  @Output() onCerrarPopup = new EventEmitter();
  @Output() obtenerAgentesFirmas = new EventEmitter();

  @ViewChild("fuImagenFirma") fuImagenFirma: DxFileUploaderComponent;

  constructor(
    private _agentesFirmasService: AgentesFirmasService,
    private _loginService: LoginService
  ) {}

  ngOnInit() {
    this.obtenerAgentes();
  }

  set gridBoxValueSelect(value) {
    this.gridBoxValue = [];

    if (value != null) {
      value.forEach((data) => {
        this.gridBoxValue.push(data.agente_ID);
        this.agenteFirma.agenteId = data.agente_ID;
      });
    }
  }

  GetDisplayExpr(item: Agente) {
    if (!item) {
      return "";
    }

    return item && item.agente_ID + "-" + item.agente_Nombre;
  }

  obtenerImagenSeleccionada(e: any) {
    if (e.value[0]) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.agenteFirma.rutaImagenFirma = event.target.result;
        this.agenteFirma.archivoImagen = e.value;
        this.obtenerDimensionesImagenSeleccionada();
      };
      reader.readAsDataURL(e.value[0]);
    }
  }

  obtenerDimensionesImagenSeleccionada(): void {
    const img = new Image();
    img.onload = () => {
      // console.log(img.width);
      // console.log(img.height);
    };
    img.src = this.agenteFirma.rutaImagenFirma;
  }

  onHidingPopup(e): void {
    this.onCerrarPopup.emit();
    this.fuImagenFirma.instance.reset();
  }

  obtenerAgentes(): void {
    this._agentesFirmasService.obtenerAgentes().subscribe(
      (data) => {
        this.agentes = data;
      },
      (error) => {
        Alertas.error(
          "Error",
          "Hubo un error al momento de obtener los agentes."
        );
      }
    );
  }

  guardarAgenteFirma(): void {
    if (this.accionPopup == AccionPopupEnum.agregar) {
      this.agregarAgenteFirma();
    } else {
      this.editarAgenteFirma();
    }
  }

  agregarAgenteFirma(): void {
    Alertas.load();
    this.agenteFirma.usuarioAgrega = this._loginService.Usuario.id;
    this._agentesFirmasService.agregarAgenteFirma(this.agenteFirma).subscribe(
      (data) => {
        this.obtenerAgentesFirmas.emit();
        Alertas.ok(
          "Datos Guardados",
          "Los datos se han guardado satisfactoriamente."
        );
        this.esPopupAgentesFirmasVisible = false;
      },
      (error) => {
        Alertas.error(
          "Error",
          "Ocurrio un error al momento de guardar la firma."
        );
      }
    );
  }

  editarAgenteFirma(): void {
    Alertas.load();
    this.agenteFirma.usuarioModifica = this._loginService.Usuario.id;
    if (this.agenteFirma.archivoImagen == null) {
      this.agenteFirma.archivoImagen = [];
    }
    this._agentesFirmasService.editarAgenteFirma(this.agenteFirma).subscribe(
      (data) => {
        this.obtenerAgentesFirmas.emit();
        Alertas.ok(
          "Datos Guardados",
          "Los datos se han guardado satisfactoriamente."
        );
        this.esPopupAgentesFirmasVisible = false;
      },
      (error) => {
        Alertas.error(
          "Error",
          "Ocurrio un error al momento de guardar la firma."
        );
      }
    );
  }

  esFormularioValido(): boolean {
    if (this.agenteFirma.agenteId == null) {
      Alertas.warning("Advertencia", "Debe ingresar un agente.");
      return false;
    }

    if (this.accionPopup == AccionPopupEnum.agregar) {
      if (this.agenteFirma.archivoImagen == null) {
        Alertas.warning("Advertencia", "Debe seleccionar una imagen.");
        return false;
      }
    }

    if (this.agenteFirma.archivoImagen) {
      const type = this.agenteFirma.archivoImagen[0].type;
      const formato = type
        .substring(type.indexOf("/") + 1, type.length)
        .toUpperCase();
      if (formato != "PNG" && formato != "JPG" && formato != "JPEG") {
        Alertas.warning(
          "Advertencia",
          "La imagen debe estar en los siguientes formatos: png, jpg o jpeg."
        );
        return false;
      }
    }

    return true;
  }

  obtenerCantidadFirmasPorAgenteId(): void {
    this._agentesFirmasService
      .obtenerCantidadesFirmasPorAgenteId(this.agenteFirma.agenteId)
      .subscribe(
        (data) => {
          if (data == 1 && this.accionPopup == AccionPopupEnum.agregar) {
            Alertas.warning(
              "Advertencia",
              "El agente seleccionado ya cuenta con una firma registrada."
            );
          } else if (
            data == 0 ||
            this.accionPopup == AccionPopupEnum.modificar
          ) {
            this.guardarAgenteFirma();
          }
        },
        (error) => {
          Alertas.error(
            "Error",
            "No se pudo verificar si el agente cuenta con firma registrada. Intente de nuevo."
          );
        }
      );
  }

  onClickGuardarAgenteFirma(): void {
    if (this.esFormularioValido()) {
      this.obtenerCantidadFirmasPorAgenteId();
    }
  }
}
