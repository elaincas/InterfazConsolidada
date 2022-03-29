import { Component, OnInit } from '@angular/core';
import { FiltroComunicadoCredito } from '../models/filtroComunicadoCredito.model';
import { ClienteCredito } from '../models/clienteCredito.model';
import { EmpresaPorAseguradora } from '../models/empresa-por-aseguradora.model';
import { ComunicadoCreditoService } from '../comunicado-credito.service';
import { Alertas } from '../../desarrollo-productos/Inventario-Productos/helpers/notificaciones/notificacion';
import { ComunicadoCreditoDocumento } from '../models/comunicado-credito-documento.model';

@Component({
  selector: 'app-editar-comunicado',
  templateUrl: './editar-comunicado.component.html',
  styleUrls: ['./editar-comunicado.component.css']
})
export class EditarComunicadoComponent implements OnInit {
  filtro : FiltroComunicadoCredito
  clientes: ClienteCredito[] = [];
  polizas : EmpresaPorAseguradora[] = [];
  documento : ComunicadoCreditoDocumento[] = [];
  now : Date = new Date;
  constructor(private _comunicadoService : ComunicadoCreditoService) {
    this.filtro= new FiltroComunicadoCredito();
   }

  ngOnInit() {
    this.ObtenerPolizas();
    this.ObtenerClientes();
  }

  ObtenerPolizas() {
    this._comunicadoService.obtenerPolizas().subscribe(data => {
      this.polizas = data as EmpresaPorAseguradora[];
    })
  }
  ObtenerClientes() {
    this._comunicadoService.obtenerClientes().subscribe(data => {
      this.clientes = data as ClienteCredito[];
    })
  }

  DEsactivarDocumento(data){
    this._comunicadoService.DeshabilitarComunicadoDocumento(data).subscribe(data=>{
      Alertas.ok()
    })
  }
  BuscarComunicados(){
    debugger;
        this._comunicadoService.ObtenerComunicados(this.filtro).subscribe(data=>{
          this.documento = data as ComunicadoCreditoDocumento[];
          
        });
  }
  Limpiar(){
    this.filtro = new FiltroComunicadoCredito();
    this.documento = [];
  }
}
