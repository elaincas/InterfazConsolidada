import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../login/services/login.service';
import { AsignarZonaService } from './asignar-zona.service';
import { Producto, ProductoPrestamos } from '../../Clases/Producto';
import { Zonas, ZonaEncargado } from '../../Clases/Zonas';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { Productos } from '../../../../desarrollo-productos/Inventario-Productos/_Clases/Productos';
import { _appIdRandomProviderFactory } from '../../../../../../node_modules/@angular/core/src/application_tokens';

declare var $: any;
@Component({
  selector: 'app-ingreso-producto',
  templateUrl: './asignar-zona.component.html',

})
export class AsignarZonaComponent implements OnInit {

  zonas: Array<Zonas>
  productoColaborador: ProductoPrestamos
  colaboradorID: number;
  zonaEncargado: ZonaEncargado
  constructor(private login: LoginService, private asignarZonaService: AsignarZonaService) {
    this.zonas = new Array<Zonas>();
    this.productoColaborador = new ProductoPrestamos();
    this.zonaEncargado = new ZonaEncargado();
    this.ObtenerZonas();
  }

  ngOnInit() {

  }

  ObtenerInformacionColaborador() {
    debugger;
    this.asignarZonaService.obtenerInformacionColaborador(this.zonaEncargado.UsuarioEncargadoID,false).subscribe(data => {
      this.productoColaborador.NombreColaborador = data.nombreColaborador;
    }, error => {
      this.LimpiarControles();
    })
  }
  GuardarInformacion() {
    if (this.ValidarDatos()) {
      this.zonaEncargado.ZonaID = Number(this.zonaEncargado.ZonaID)
      this.zonaEncargado.UsuarioId = this.login.Usuario.id;
      this.asignarZonaService.AgregarEncargadoZona(this.zonaEncargado).subscribe(data => {
        Alertas.ok("", "Éxito");
        this.LimpiarControles();
        this.ObtenerZonas();
        this.ObtenerInformacionColaborador();
      }, error => {
        Alertas.error("", error._body);
      });
    }
  }

  ValidarDatos(): Boolean {
    if (this.zonaEncargado.UsuarioEncargadoID == 0) {
      Alertas.warning("", "Usuario inválido.")
      return false;
    } if (this.zonaEncargado.ZonaID == 0) {
      Alertas.warning("", "La zona inválida.")
      return false;
    }
    return true;
  }
  LimpiarControles() {
    this.zonaEncargado = new ZonaEncargado();
  }
  ObtenerZonas() {
    this.asignarZonaService.ObtenerZonas().subscribe(data => {
      this.zonas = data;
    });
  }
}
