import { Component, OnInit, ViewChild } from '@angular/core';
import { Conserje } from '../../models/Conserje';
import { AdministrarConserjesService } from '../../services/administrar.conserjes.service';
import { Alertas } from '../../../../../helpers/notificaciones/notificaciones';
import { isUndefined, log } from 'util';
import { LoginService } from '../../../../../login/services/login.service';
import { Router } from '@angular/router';
import { DxFormComponent } from 'devextreme-angular';

@Component({
  selector: 'app-registrar-conserje',
  templateUrl: './registrar-conserje.component.html',
  providers: [AdministrarConserjesService, LoginService]
})
export class RegistrarConserjeComponent implements OnInit {

  @ViewChild(DxFormComponent) form:DxFormComponent

  constructor(private service: AdministrarConserjesService,
              private loginService: LoginService,
              private router: Router) {

    this.ConserjeARegistrar = new Conserje();
    this.fotografiasGaleria = [];
  }

  fotografiasGaleria: string[];
  imagenSeleccionada: any;
  ConserjeARegistrar: Conserje;
  phoneRules: any = {
      X: /[02-9]/
  }
  namePattern: any = /^[^0-9]+$/;
  inputCodigoVhurOptions: any = {
    onValueChanged: (e) => {
        this.ObtenerNombreUsuarioPorCodigoVhur();
    }
  }

  ngOnInit() {

  }

  ObtenerNombreUsuarioPorCodigoVhur() {
    this.service.ObtenerNombreUsuarioPorCodigoVhur(this.ConserjeARegistrar.codigoVhur)
      .subscribe(r => {
        this.ConserjeARegistrar.nombreUsuarioSeguridadCorporativa = r;
      });
  }

  GuardarConserje() {
    if (this.form.instance.validate().isValid && this.ValidarFotografiaConserje()) {
      Alertas.load();
      this.service.AgregarConserje(this.ConserjeARegistrar, this.imagenSeleccionada)
        .subscribe(r => {
          Alertas.close();
          this.ConserjeARegistrar = r;
          this.Limpiar();
          Alertas.ok('¡Correcto!', 'Los datos han sido guardados correctamente');
        }, error => {
          Alertas.close();
          Alertas.error('¡ERROR!', error._body);
        });
    }
  }

  ValidarFotografiaConserje(): boolean {
    try {
      if (isUndefined(this.imagenSeleccionada) || this.imagenSeleccionada == "" || this.imagenSeleccionada === null) {
        Alertas.error("¡Error!", "La ruta de la fotografía es inválida.");
        return false;
      }
    } catch (e) {
      Alertas.error('ERROR', e);
      return false;
    }
    return true;
  }

  Limpiar() {
    this.QuitarFotografia();
    this.ConserjeARegistrar.nombre= "";
    this.ConserjeARegistrar.celular = "";
    this.ConserjeARegistrar.codigoVhur = "";
    this.ConserjeARegistrar.rutaFotografia = "";
    this.ConserjeARegistrar.nombreUsuarioSeguridadCorporativa = "";
  }

  QuitarFotografia() {
    this.fotografiasGaleria = [];
    this.ConserjeARegistrar.rutaFotografia = '';
  }

  ObtenerFotografiaDxFileUploader(event: any) {

    if (event.value[0] && event.element.id === 'fuplFotografia') {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.fotografiasGaleria.push(event.target.result);
        this.imagenSeleccionada = event.target.result;
      };
      reader.readAsDataURL(event.value[0]);
    }
    else {
      this.fotografiasGaleria = [];
    }
  }

  VolverAlListado() {
    this.router.navigate(['sad/conserjes']);
  }
}