import { Component, OnInit, ViewChild } from '@angular/core';
import { Form } from '@angular/forms';
import { stringAc } from '../../../../analisis-clinico/analisis/helpers/stringFormat';
import { Forms } from '../../../../helpers/forms';
import { Alertas, Notificaciones } from '../../../../helpers/notificaciones/notificaciones';
import { RespuestaEstandar } from '../../../../helpers/respuestasGeneralesEstandar/respuesta.core.standar';
import { TipoRespuestaServidorEstandar } from '../../../../helpers/respuestasGeneralesEstandar/tipoRespuestaServidor.core.standar';
import { OperadoresEnum, OperadoresTipoProductoEnum } from '../../enums/operadores.enum';
import { RespuestaConfiguracionTipo } from '../../enums/respuestaConfiguracionTipo';
import { MensajesGenerales } from '../../mensajes/mensajesGenerales';
import { Operador, OperadorTipoProducto } from '../../models/operadores.model';
import { ProductoRecarga } from '../../models/productoRecarga.model';
import { ProductoRecargaConfigurado } from '../../models/productoRecargaConfigurado.model';
import { RespuestaConfiguracionRecarga, ResultadoValidacionRecarga } from '../../models/respuestaConfiguracionRecarga';
import { AdministracionRecargasService } from '../../services/administracionRecarga.service';

@Component({
  selector: 'app-administracion-recargas-telefonicas',
  templateUrl: './administracion-recargas-telefonicas.component.html',
  styleUrls: ['./administracion-recargas-telefonicas.component.css']
})
export class AdministracionRecargasTelefonicasComponent implements OnInit {
  _gridBoxProductoRecargaValue: string;
  productosRecarga: ProductoRecarga[];
  operadores: Operador[];
  operadorTipoProducto: OperadorTipoProducto[] = [];
  productoRecargaConfigurado: ProductoRecargaConfigurado;
  mostrarConfiguracion: boolean;
  colSpanMonto: number = 2;
  colSpanSelector: number = 1;
  esOperadorTigo: boolean = false;
  esOperadorClaro: boolean = false;
  esPaquete: boolean = false;
  msjGenerales: any = MensajesGenerales;
  recargasConfiguradas: ProductoRecargaConfigurado[];
  respuestaServidor: RespuestaEstandar<RespuestaConfiguracionRecarga>;
  showModalInfo: boolean = false;
  deshabilitarSeleccionarOperador: boolean = false;
  deshabilitarSeleccionarTipoProducto: boolean = false;

  operadorValue: number;
  tipoRecargaOperadorValue: number;
  modo: Forms.Modo

  constructor(private adminRecargasService: AdministracionRecargasService) {

  }

  ngOnInit() {
    this.ObtenerProductosRecarga();
    this.adminRecargasService.ObtenerOperadores().subscribe(data => {
      this.operadores = data;
    });
    this.adminRecargasService.ObtenerOperadoresTipoProducto().subscribe(data => {
      this.operadorTipoProducto = data;
    });
    this.productoRecargaConfigurado = new ProductoRecargaConfigurado;
    this.ObtenerRecargasConfiguradas();
  }

  ObtenerProductosRecarga() {
    Alertas.load();
    this.adminRecargasService.ObtenerTodosProductosRecarga().subscribe(data => {
      this.productosRecarga = data as ProductoRecarga[];
      Alertas.close();
    }, error => {
      Alertas.close();
      Alertas.errorEnServidor();
    });
  }

  ObtenerRecargasConfiguradas() {
    Alertas.load();
    this.adminRecargasService.ObtenerRecargasConfiguradas().subscribe(data => {
      this.recargasConfiguradas = data as ProductoRecargaConfigurado[];
      Alertas.close();
    }, error => {
      Alertas.close();
      Alertas.errorEnServidor();
    });
  }

  set gridBoxProductoRecargaValueSelect(value: any) {
    this._gridBoxProductoRecargaValue = "";

    if (value != null) {
      this._gridBoxProductoRecargaValue = value[0].id;
    }
  }
  set gridBoxProductoRecargaValue(value: string) {
    this._gridBoxProductoRecargaValue = value || "";
  }
  get gridBoxProductoRecargaValue(): string {
    return this._gridBoxProductoRecargaValue;
  }

  Configurar() {
    this.ResetConfiguracion();
    if (this._gridBoxProductoRecargaValue == undefined || this._gridBoxProductoRecargaValue == "") {
      Notificaciones.error(stringAc.Format(MensajesGenerales.datoNoSeleccionado, "la recarga"));
      return;
    }
    let producto = this.productosRecarga.find(x => x.id == this._gridBoxProductoRecargaValue);
    this.productoRecargaConfigurado.proveedorId = producto.proveedorId;
    this.productoRecargaConfigurado.monto = producto.precioPublico;
    this.productoRecargaConfigurado.id = this._gridBoxProductoRecargaValue;
    //this.operadorValue = producto.operadorId;
    this.mostrarConfiguracion = true;
    this.modo = Forms.Modo.Agregar;
    this.deshabilitarSeleccionarTipoProducto = false;
    this.deshabilitarSeleccionarOperador = false;

    if (producto.operadorId == OperadoresEnum.Tigo) {
      this.esOperadorTigo = true;
      this.colSpanMonto = 1;
      this.colSpanSelector = 1;
    }

    if (producto.operadorId == OperadoresEnum.Claro) {
      this.esOperadorClaro = true;
    }

  }

  GuardarConfiguracion() {
    if (this.EsConfiguracionValida() == false) {
      return;
    }
    if (this._gridBoxProductoRecargaValue != this.productoRecargaConfigurado.id) {
      Notificaciones.error(stringAc.Format(MensajesGenerales.productosIdDistintos));
    }

    if (this.modo == Forms.Modo.Agregar) {
      Alertas.question("Guardar Configuración", MensajesGenerales.confirmacionGuardarConfiguracion, "Guardar", "Volver a Revisar").then(response => {
        this.Guardar();
      });

    } else {
      this.Editar()
    }

  }

  Guardar() {
    Alertas.load();
    this.adminRecargasService.RegistrarRecargaConfigurada(this.productoRecargaConfigurado).subscribe(respuesta => {
      Alertas.close();
      if (respuesta.respuestaTipo == TipoRespuestaServidorEstandar.Ok) {
        this.respuestaServidor = respuesta;
        if (respuesta.data.respuestaTipo == RespuestaConfiguracionTipo.Tipo.RecargaConfiguradaCorrectamente) {
          this.recargasConfiguradas.push(respuesta.data.dataRecarga);
        }
        this.showModalInfo = true;
      }
      if (respuesta.respuestaTipo == TipoRespuestaServidorEstandar.Error) {
        Alertas.error(MensajesGenerales.tituloError, respuesta.mensaje)
      }
      if (respuesta.respuestaTipo == TipoRespuestaServidorEstandar.Validacion) {
        Alertas.info(MensajesGenerales.tituloErrorValidacion, respuesta.mensaje)
      }
      this.ResetConfiguracion();
    }, error => {
      Alertas.errorEnServidor();
    });
  }

  Editar() {
    Alertas.load();
    this.adminRecargasService.EditarRecargaConfigurada(this.productoRecargaConfigurado).subscribe(respuesta => {
      Alertas.close();
      if (respuesta.respuestaTipo == TipoRespuestaServidorEstandar.Ok) {
        this.respuestaServidor = respuesta;
        if (respuesta.data.respuestaTipo == RespuestaConfiguracionTipo.Tipo.RecargaConfiguradaCorrectamente) {
          this.recargasConfiguradas.push(respuesta.data.dataRecarga);
        }
        this.showModalInfo = true;
      }
      if (respuesta.respuestaTipo == TipoRespuestaServidorEstandar.Error) {
        Alertas.error(MensajesGenerales.tituloError, respuesta.mensaje)
      }
      if (respuesta.respuestaTipo == TipoRespuestaServidorEstandar.Validacion) {
        Alertas.info(MensajesGenerales.tituloErrorValidacion, respuesta.mensaje)
      }
      this.ResetConfiguracion();
    }, error => {
      Alertas.errorEnServidor();
    });
  }

  EsConfiguracionValida(): boolean {
    if (this._gridBoxProductoRecargaValue == undefined || this._gridBoxProductoRecargaValue == "") {
      Notificaciones.error(stringAc.Format(MensajesGenerales.datoNoSeleccionado, "la recarga"));
      return false;
    }
    if (this.productoRecargaConfigurado.operadorId == undefined || this.productoRecargaConfigurado.operadorId <= 0) {
      Notificaciones.error(stringAc.Format(MensajesGenerales.datoNoSeleccionado, "el operador"));
      return false;
    }
    if (this.productoRecargaConfigurado.operadorTipoProductoId == undefined || this.productoRecargaConfigurado.operadorTipoProductoId <= 0) {
      Notificaciones.error(stringAc.Format(MensajesGenerales.datoNoSeleccionado, "el tipo de producto"));
      return false;
    }

    if ((this.productoRecargaConfigurado.tipo == undefined || this.productoRecargaConfigurado.tipo == "")
      && this.productoRecargaConfigurado.operadorId == OperadoresEnum.Tigo) {
      Notificaciones.error(MensajesGenerales.datoRequerido);
      return false;
    }

    if (this.productoRecargaConfigurado.selector == undefined && this.productoRecargaConfigurado.operadorId == OperadoresEnum.Tigo) {
      Notificaciones.error(MensajesGenerales.datoRequerido);
      return false;
    }

    if ((this.productoRecargaConfigurado.codigoExternoRecarga == undefined || this.productoRecargaConfigurado.codigoExternoRecarga == "")
      && this.productoRecargaConfigurado.operadorId == OperadoresEnum.Claro && this.productoRecargaConfigurado.operadorTipoProductoId == OperadoresTipoProductoEnum.Paquete) {
      Notificaciones.error(MensajesGenerales.datoRequerido);
      return false;
    }

    return true;
  }

  col(operadorId: any): number {
    if (operadorId == OperadoresEnum.Tigo) {
      return 1
    }
    return 2;
  }

  OperadorChange(e) {
    this.esOperadorTigo = false;
    this.esOperadorClaro = false;

    let operador = e.value as number;
    if (operador == OperadoresEnum.Tigo) {
      this.esOperadorTigo = true;
      this.colSpanMonto = 1;
      this.colSpanSelector = 1;
    }
    if (operador == OperadoresEnum.Claro) {
      this.esOperadorClaro = true;
    }
    this.productoRecargaConfigurado.operadorId = operador;
  }

  TipoProductoChange(e) {
    this.esPaquete = false;
    let tipo = e.value as number;
    if (tipo == OperadoresTipoProductoEnum.Paquete && this.productoRecargaConfigurado.operadorId == OperadoresEnum.Tigo) {
      this.productoRecargaConfigurado.tipo = "PVASEXTRFREQ"
    }
    if (tipo == OperadoresTipoProductoEnum.Recarga && this.productoRecargaConfigurado.operadorId == OperadoresEnum.Tigo) {
      this.productoRecargaConfigurado.tipo = "EXRCTRFREQ"
    }

    if (tipo == OperadoresTipoProductoEnum.Paquete) {
      this.esPaquete = true;
    }

    this.productoRecargaConfigurado.operadorTipoProductoId = tipo;
  }

  ResetConfiguracion() {
    this.productoRecargaConfigurado = new ProductoRecargaConfigurado;
    this.mostrarConfiguracion = false;
    this.esOperadorTigo = false;
    this.esOperadorClaro = false;
    this.colSpanMonto = 2;
    this.operadorValue = 0;
    this.tipoRecargaOperadorValue = 0;
  }

  EditarRecarga(recarga: ProductoRecargaConfigurado) {
    this.deshabilitarSeleccionarOperador = true;
    this.deshabilitarSeleccionarTipoProducto = true;
    this._gridBoxProductoRecargaValue = recarga.id;
    this.productoRecargaConfigurado = recarga;
    this.operadorValue = recarga.operadorId;
    this.tipoRecargaOperadorValue = recarga.operadorTipoProductoId;
    this.modo = Forms.Modo.Actualizar;
    this.mostrarConfiguracion = true;
  }

  DesactivarProductoRecarga(recargaProductoId: string) {
    Alertas.question(MensajesGenerales.confirmarDesactivarRegistro).then(response => {
      Alertas.load();
    this.adminRecargasService.DesactivarRecargaConfigurada(recargaProductoId).subscribe(respuesta => {
      Alertas.close();
      if (respuesta.respuestaTipo == TipoRespuestaServidorEstandar.Ok) {
        this.recargasConfiguradas.find(x => x.id == recargaProductoId).activo = false;
        Alertas.ok(MensajesGenerales.registroDesactivado)
      }
      if (respuesta.respuestaTipo == TipoRespuestaServidorEstandar.Error) {
        Alertas.operacionNoCompletada()
      }
      if (respuesta.respuestaTipo == TipoRespuestaServidorEstandar.Validacion) {
        Alertas.error(respuesta.mensaje)
      }
    }, error => {
      Alertas.errorEnServidor();
    });
    });
  }
  ActivarProductoRecarga(recargaProductoId: string) {
    Alertas.load();
    this.adminRecargasService.ActivarRecargaConfigurada(recargaProductoId).subscribe(respuesta => {
      Alertas.close();
      if (respuesta.respuestaTipo == TipoRespuestaServidorEstandar.Ok) {
        this.recargasConfiguradas.find(x => x.id == recargaProductoId).activo = true;
        Alertas.ok(MensajesGenerales.registroActivado)
      }
      if (respuesta.respuestaTipo == TipoRespuestaServidorEstandar.Error) {
        Alertas.operacionNoCompletada()
      }
      if (respuesta.respuestaTipo == TipoRespuestaServidorEstandar.Validacion) {
        Alertas.error(respuesta.mensaje)
      }
    }, error => {
      Alertas.errorEnServidor();
    });
  }
  EsOperadorTigo(operadorId: number): boolean {
    if (operadorId == OperadoresEnum.Tigo) {
      return true;
    }
    return false;
  }

  public get respuestaConfiguracionTipo(): typeof RespuestaConfiguracionTipo.Tipo {
    return RespuestaConfiguracionTipo.Tipo;
  }
  public get mensajesConfiguracion(): typeof MensajesGenerales {
    return MensajesGenerales;
  }

  public get ModoFormulario(): typeof Forms.Modo {
    return Forms.Modo;
  }

}
