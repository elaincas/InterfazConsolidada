import { Component, OnInit, ViewChild } from '@angular/core';
import { Conserje } from '../../models/Conserje';
import { AdministrarConserjesService } from '../../services/administrar.conserjes.service';
import { Alertas } from '../../../../../helpers/notificaciones/notificaciones';
import { isUndefined, log } from 'util';
import { LoginService } from '../../../../../login/services/login.service';
import { DxFormComponent } from 'devextreme-angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editar-conserje',
  templateUrl: './editar-conserje.component.html',
  providers: [AdministrarConserjesService]
})
export class EditarConserjeComponent implements OnInit {

  @ViewChild(DxFormComponent) form: DxFormComponent

  constructor(private service: AdministrarConserjesService,
    private router: Router,
    private route: ActivatedRoute) {

    this.ConserjeAEditar = new Conserje();
    this.fotografiasGaleria = [];
  }

  fotografiasGaleria: string[];
  imagenSeleccionada: any;
  ConserjeAEditar: Conserje;
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
    this.CargarConserje();
  }

  CargarConserje() {
    Alertas.load("Cargando la información del conserje");

    this.route.params.subscribe(params => {
      const conserjeId = params.conserjeId as number;

      this.service.ObtenerConserjeAEditar(conserjeId).subscribe(r => {
        this.ConserjeAEditar = r;

        if (this.ConserjeAEditar.rutaFotografia != "" && this.ConserjeAEditar.rutaFotografia != null)
          this.fotografiasGaleria.push(this.ConserjeAEditar.rutaFotografia);

        Alertas.close();
      })
    });
  }

  ObtenerNombreUsuarioPorCodigoVhur() {
    this.service.ObtenerNombreUsuarioPorCodigoVhur(this.ConserjeAEditar.codigoVhur)
      .subscribe(r => {
        this.ConserjeAEditar.nombreUsuarioSeguridadCorporativa = r;
      })
  }

  GuardarConserje() {
    if (this.form.instance.validate().isValid) {

      Alertas.load();

      this.service.EditarConserje(this.ConserjeAEditar, this.imagenSeleccionada)
        .subscribe(r => {
          Alertas.close();

          Alertas.question('¡Correcto!', 'Los datos del conserje han sido actualizados correctamente. ¿Desea volver a la lista de conserjes?')
            .then(() => {
              this.VolverAlListado();
            })
        }, error => {
          Alertas.close();
          Alertas.error('¡ERROR!', error._body);
        });
    }
  }

  Limpiar() {
    this.QuitarFotografia();
    this.ConserjeAEditar.nombre = "";
    this.ConserjeAEditar.celular = "";
    this.ConserjeAEditar.codigoVhur = "";
    this.ConserjeAEditar.rutaFotografia = "";
    this.ConserjeAEditar.nombreUsuarioSeguridadCorporativa = "";
  }

  QuitarFotografia() {
    this.fotografiasGaleria = [];
    this.ConserjeAEditar.rutaFotografia = '';
  }

  ObtenerFotografiaDxFileUploader(event: any) {

    this.fotografiasGaleria = [];

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