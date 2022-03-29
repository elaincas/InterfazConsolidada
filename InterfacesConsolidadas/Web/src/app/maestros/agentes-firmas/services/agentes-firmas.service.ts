import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { HttpAuthService } from "../../../helpers/http/http-auth.service";
import { AgenteFirma } from "../models/agente-firma.model";
import { Agente } from "../models/agente.model";

@Injectable()
export class AgentesFirmasService {
  private _controller = "api/AgentesFirmas";
  private _url = `${environment.ecommerceApi}/${this._controller}`;
  constructor(private _httpAuthService: HttpAuthService) {}

  obtenerAgentes(): Observable<Agente[]> {
    return this._httpAuthService.get(`${this._url}/Agentes`).map((r)=> r.json());
  }

  obtenerAgentesFirmas(): Observable<AgenteFirma[]> {
    return this._httpAuthService.get(`${this._url}`).map((r) => r.json());
  }

  agregarAgenteFirma(
    agenteFirma: AgenteFirma
  ): Observable<AgenteFirma> {
    const formData = new FormData();
    formData.append("agenteFirmaDto", JSON.stringify(agenteFirma));
    formData.append("AgentesFirmas", agenteFirma.archivoImagen[0]);
    const url = `${environment.ecommerceApi}/${this._controller}`;
    return this._httpAuthService.post(url, formData).map((r) => r.json());
  }

  editarAgenteFirma(
    agenteFirma: AgenteFirma
  ): Observable<AgenteFirma> {
    const formData = new FormData();
    formData.append("agenteFirmaDto", JSON.stringify(agenteFirma));
    formData.append("AgentesFirmas", agenteFirma.archivoImagen[0]);
    const url = `${environment.ecommerceApi}/${this._controller}`;
    return this._httpAuthService.put(url, formData).map((r) => r.json());
  }

  obtenerCantidadesFirmasPorAgenteId(agenteId: string): Observable<number> {
    const url = `${environment.ecommerceApi}/${this._controller}/CantidadFirmas/${agenteId}`;
    return this._httpAuthService.get(url).map((r)=> r.json());
  }

}
