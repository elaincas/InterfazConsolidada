import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ColoniaService } from '../services/coloniaService.service';
import { Colonia } from '../models/colonia.model';
import { Alertas } from '../../../helpers/notificaciones/notificaciones';
import { Ciudad } from '../models/ciudad.model';

@Component({
  selector: 'lista-colonias',
  templateUrl: './lista-colonias.component.html',
  styleUrls: ['./lista-colonias.component.css']
})
export class ListaColoniasComponent implements OnInit {

  agregandoColonia: boolean;
  colonias: Colonia[];
  ciudades: Ciudad[];

  limpiarControles: EventEmitter<any> = new EventEmitter();
  addPreviousProducts: EventEmitter<any> = new EventEmitter();
  productosAgregar: any[] = [];

  formGroupColonia: FormGroup;

  constructor(private coloniaService: ColoniaService, private route: Router,
    private _formBuilder: FormBuilder,
  ) {
    this.colonias = new Array<Colonia>();
  }


  ngOnInit() {
    this.obtenerCiudades();

    this.formGroupColonia = this._formBuilder.group({
      ciudad: new FormControl(),
      nombre: new FormControl(),
      esSad: new FormControl(),
    });
  }

  nuevaColonia() {
    this.agregandoColonia = true;
  }
  cancelarNuevaColonia(): void {
    this.agregandoColonia = false;
    this.formGroupColonia.reset();
  }

  modeloEsValido(): boolean {
    if (!this.formGroupColonia.get('nombre').value) {
      return false;
    }
    if (!this.formGroupColonia.get('ciudad').value) {
      return false;
    }
    return true;
  }

  cargarColoniasDeCiudad(): void {
    Alertas.load();
    var ciudadId = this.formGroupColonia.get('ciudad').value;
    this.coloniaService.ObtenerColoniasDeCiudad(ciudadId).subscribe(response => {
      Alertas.close();
      this.colonias = response;
    }, error => {
      Alertas.close();
      Alertas.error("Error", "Error al obtener las listas \n Estatus: " + error.status + " \n Mensaje: " + error.statusText);
    });
  }

  obtenerCiudades(): void {
    Alertas.load();
    this.coloniaService.ObtenerCiudades().subscribe(data => {
      Alertas.close();
      this.ciudades = data;
    });
  }

  limpiarListasForm() {
    this.formGroupColonia.reset();
  }

  guardarColonia() {

    Alertas.load();
    if (!this.modeloEsValido()) {
      Alertas.warning("Advertencia", "Ingrese toda la información del formulario.");
      return;
    }

    let colonia = new Colonia();

    colonia.nombre = this.formGroupColonia.get('nombre').value;
    colonia.sad = this.formGroupColonia.get('esSad').value;
    colonia.ciudadId = this.formGroupColonia.get('ciudad').value;

    this.coloniaService.RegistrarColonia(colonia)
      .subscribe(data => {
        Alertas.ok("", "Registro completo");
        this.cargarColoniasDeCiudad();
        this.limpiarListasForm();
      }, error => {
        console.log(error);
        Alertas.errorEnServidor();
      });
  }

  onColoniaRowUpdated(e: any): void {
    Alertas.question("", "¿Desea actualizar esta colonia?")
      .then(resp => {
        const colonia = this.colonias.filter(x => x.id == e.key.id)[0];
        colonia.descontinuado = colonia.activa == true ? 'N': 'S';
        this.coloniaService.ActualizarColonia(colonia)
          .subscribe(data => {
            Alertas.ok("", "Colonia actualizada exitosamente.");
          }, error => {
            console.log(error);
            Alertas.errorEnServidor();
          });
      });
  }

}
