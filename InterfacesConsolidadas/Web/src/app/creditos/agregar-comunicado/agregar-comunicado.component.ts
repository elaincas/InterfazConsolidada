import { Component, OnInit, ViewChild } from '@angular/core';
import { ComunicadoCredito } from '../models/comunicado-credito.model';
import { TipoConfiguracion } from '../models/tipoConfiguracion.model';
import { ComunicadoCreditoService } from '../comunicado-credito.service';
import { Alertas } from '../../entrenamiento/administracion-productos/helpers/notificaciones/notificacion';
import { ClienteCredito } from '../models/clienteCredito.model';
import { EmpresaPorAseguradora } from '../models/empresa-por-aseguradora.model';
import { ComunicadoCreditoConfiguracion } from '../models/comunicado-credito-configuracion.model';
import { LoginService } from '../../login/services/login.service';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-agregar-comunicado',
  templateUrl: './agregar-comunicado.component.html',
  styleUrls: ['./agregar-comunicado.component.css']
})

export class AgregarComunicadoComponent implements OnInit {
  @ViewChild("gridCliente")
  private gridCliente: DxDataGridComponent;
  @ViewChild("gridPolizas")
  private gridPolizas: DxDataGridComponent;
  comunicadoCredito: ComunicadoCredito;
  tipoConfiguraciones: TipoConfiguracion[]
  value: any[] = [];
  now = new Date();
  clientes: ClienteCredito[];
  polizas: EmpresaPorAseguradora[];
  _mostrarPopup: boolean = false;
  comunicadoCreditoConfiguracion: ComunicadoCreditoConfiguracion[]

  constructor(private _comunicadoService: ComunicadoCreditoService,
    private _loginService: LoginService) {

    this.comunicadoCredito = new ComunicadoCredito();
    this.clientes = new Array<ClienteCredito>();
    this.polizas = new Array<EmpresaPorAseguradora>();
    this.tipoConfiguraciones = this._comunicadoService.obtenerConfiguracionComunicados();
    this.comunicadoCreditoConfiguracion = new Array<ComunicadoCreditoConfiguracion>();
    this.ObtenerClientes();
    this.ObtenerPolizas();
  }

  ngOnInit() {
  }
  cargarArchivo(data) {
    if (data.value[0]) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.comunicadoCredito.pathArchivo = event.target.result;
      };
      reader.readAsDataURL(data.value[0]);
    }
  }

  AgregarComunicado( ) {
    this.ObtenerInformacionGrid();
    if (!this.ValidarDatosComunicado()) {
      return;
    }
    debugger;
    this._comunicadoService.agregarComunicadoAsync(this.comunicadoCredito).subscribe(data => {
      Alertas.ok("Exito");
      this.Limpiar();
    }
      , error => {
        Alertas.error("Error");
      })
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
  ValidarDatosComunicado(): boolean {
    if (this.comunicadoCredito.titulo == "" || this.comunicadoCredito.titulo == undefined) {
      Alertas.warning("Ingrese el nombre");
      return false
    }
    if (this.comunicadoCredito.descripcion == "" || this.comunicadoCredito.descripcion == undefined) {
      Alertas.warning("Ingrese la Descripción");
      return false
    }
    if (this.comunicadoCredito.desde == undefined) {
      Alertas.warning("Ingrese una fecha");
      return false
    }
    if (this.comunicadoCredito.hasta == undefined) {
      Alertas.warning("Ingrese la fecha");
      return false
    }
    if (this.comunicadoCredito.comunicadosCreditosConfiguracion == undefined || this.comunicadoCredito.comunicadosCreditosConfiguracion.length == 0) {
      Alertas.warning("Seleccione un tipo de configuración");
      return false
    }
    if (this.comunicadoCredito.imagen == undefined) {
      Alertas.warning("Ingrese la imagen");
      return false
    }
    return true
  }
  ObtenerInformacionGrid() {
    debugger;
    let infoGridClientes = (this.gridCliente.instance.getSelectedRowsData());
    if (infoGridClientes != undefined && infoGridClientes.length > 0) {
      this.comunicadoCreditoConfiguracion = [];
      infoGridClientes.forEach(element => {
        debugger;
        let configuracion = new ComunicadoCreditoConfiguracion();
        configuracion.clienteId = element.clienteID,
          configuracion.activo = true,
          configuracion.fechaAgrega = new Date,
          configuracion.usuarioAgregaId = this._loginService.Usuario.id

        this.comunicadoCreditoConfiguracion.push(configuracion)
      });
      this.comunicadoCredito.comunicadosCreditosConfiguracion = this.comunicadoCreditoConfiguracion;
      return;
    }
    let infoGridPolizas = (this.gridPolizas.instance.getSelectedRowsData());
    if (infoGridPolizas != undefined && infoGridPolizas.length > 0) {
      this.comunicadoCreditoConfiguracion = [];
      infoGridPolizas.forEach(element => {
        debugger;
        let configuracion = new ComunicadoCreditoConfiguracion();
        configuracion.clienteId = element.clienteID,
          configuracion.noPoliza = element.noPoliza,
          configuracion.activo = true,
          configuracion.fechaAgrega = new Date,
          configuracion.usuarioAgregaId = this._loginService.Usuario.id
        this.comunicadoCreditoConfiguracion.push(configuracion)
      });
      this.comunicadoCredito.comunicadosCreditosConfiguracion = this.comunicadoCreditoConfiguracion;
      return;
    }
   
  }
  Limpiar(){
    this.comunicadoCredito =  new ComunicadoCredito();
    this.comunicadoCreditoConfiguracion = [];

  }
}
