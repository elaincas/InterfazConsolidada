import { Component, OnInit } from '@angular/core';
import { DistribuidorExterno } from '../models/distribuidor-externo';
import { DistribuidorExternoCategorias } from '../models/distribuidor-externo-categoria';
import { DistribuidoresExternosService } from '../distribuidores-externos.service';
import { Alertas } from '../../../helpers/notificaciones/notificaciones';
import { LoginService } from '../../../login/services/login.service';

@Component({
  selector: 'app-administrar-categorias',
  templateUrl: './administrar-categorias.component.html',
  styleUrls: ['./administrar-categorias.component.css']
})
export class AdministrarCategoriasComponent implements OnInit {
  distribuidores: DistribuidorExterno[];
  distribuidoresCategorias: DistribuidorExternoCategorias[];
  distribuidorCategoria: DistribuidorExternoCategorias;
  distribuidor: DistribuidorExterno;
  distribuidorEdicion: DistribuidorExternoCategorias;
  _mostrarPopup: boolean = false;
  esAgregarDistribuidor: boolean;

  constructor(private _distribuidorExternoService: DistribuidoresExternosService,
    private _loginService: LoginService) {
    this.distribuidor = new DistribuidorExterno();
    this.distribuidorEdicion = new DistribuidorExternoCategorias();
    this.distribuidorCategoria = new DistribuidorExternoCategorias();
    this.distribuidores = new Array<DistribuidorExterno>();
    this.distribuidoresCategorias = new Array<DistribuidorExternoCategorias>();
  }

  ngOnInit() {
    this.ObtenerCategorias();
    this.ObtenerDistribuidores();
  }
  ObtenerDistribuidores() {
    this._distribuidorExternoService.ObtenerDistribuidores().subscribe(data => {
      this.distribuidores = data as DistribuidorExterno[];
    }, error => {
      Alertas.error("Advertencia", error.error.message);
    });
  }
  ObtenerCategorias() {
    this._distribuidorExternoService.ObtenerCategorias().subscribe(data => {
      this.distribuidoresCategorias = data as DistribuidorExternoCategorias[];
    }, error => {
      Alertas.error("Advertencia", error.error.message);
    });
  }
  AgregarDistribuidor() {
    if (this.ValidarDistribuidor()) {
      this.distribuidor.usuarioId = this._loginService.Usuario.id;
      this._distribuidorExternoService.AgregarDistribuidor(this.distribuidor).subscribe(data => {
        this.distribuidor = new DistribuidorExterno();
        this.ObtenerDistribuidores();
        Alertas.ok("Información guardada exitosamente!");
      }, error => {
        Alertas.error("Advertencia", error.error.message);
      })
    }
  }
  AgregarCategoria() {
    if (this.ValidarCategoria(this.distribuidorCategoria)) {
      this.distribuidorCategoria.usuarioId = this._loginService.Usuario.id;
      this._distribuidorExternoService.AgregarCategoria(this.distribuidorCategoria).subscribe(data => {
        this.distribuidorCategoria = new DistribuidorExternoCategorias();
        this.ObtenerCategorias();
        Alertas.ok("Información guardada exitosamente!");
        this._distribuidorExternoService.ActulizarProductosHugo().subscribe(d => { });
      }, error => {
        debugger;
        Alertas.error("Advertencia", error.error.message);
      })
    }
  }

  ValidarDistribuidor(): boolean {
    if (this.distribuidor.nombre === undefined || this.distribuidor.nombre === "") {
      Alertas.warning("Advertencia", "Ingrese un nombre correcto!");
      return false;
    }
    return true;
  }
  ValidarCategoria(data): boolean {
    if (data.distribuidorExternoId === undefined || data.distribuidorExternoId === 0) {
      Alertas.warning("Advertencia", "Seleccione un distribuidor!");
      return false;
    }
    if (data.nombre === undefined || data.nombre === "") {
      Alertas.warning("Advertencia", "Ingrese un nombre correcto!");
      return false;
    }
    return true;
  }
  MostrarPopup(habilitarPopup: boolean = true, esAgregarDistribuidor: boolean = true) {
    if (habilitarPopup == false) {
      this._mostrarPopup = false;
      return;
    }
    this.esAgregarDistribuidor = esAgregarDistribuidor;
    this._mostrarPopup = true;

  }
  ActualizarCategoria(data) {
    this.esAgregarDistribuidor = false;
    data.usuarioId = this._loginService.Usuario.id;
    this.MostrarPopup(true, false)
    debugger;
    this.distribuidorEdicion = data;

  }
  Actualizar() {
    if (this.ValidarCategoria(this.distribuidorEdicion)) {
      this._distribuidorExternoService.ActualizarCategoria(this.distribuidorEdicion).subscribe(data => {
        Alertas.ok("Información guardada con éxito!");
        this.distribuidorEdicion = new DistribuidorExternoCategorias();
        this.ObtenerCategorias();
      }, error => {
        Alertas.error(error._body.message);
      })
    }
  }

}
