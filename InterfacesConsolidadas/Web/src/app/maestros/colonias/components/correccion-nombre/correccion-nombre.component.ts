import { DxDataGridComponent } from 'devextreme-angular';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, OnInit, AfterContentInit, ViewChild } from '@angular/core';
import { ColoniaService } from '../../services/coloniaService.service';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { Ciudad } from '../../models/ciudad.model';
import { Colonia } from '../../models/colonia.model';
import { helpers } from '../../../../helpers/utils';
import { ColoniaCorregir } from '../../models/coloniaCorregir.model';

@Component({
  selector: 'app-correccion-nombre',
  templateUrl: './correccion-nombre.component.html',
  styleUrls: ['./correccion-nombre.component.css']
})
export class CorreccionNombreComponent implements OnInit, AfterContentInit {

  ciudades: Ciudad[];
  colonias: Colonia[];
  formGroupColonias: FormGroup;
  gridBoxValue: number[];
  @ViewChild('gridColonias') private _gridColonias: DxDataGridComponent;

  constructor(private _coloniasService: ColoniaService, private _formBilder: FormBuilder) { }

  ngAfterContentInit(): void {

  }

  ngOnInit() {
    this.cargarVariables();
  }

  cargarVariables(): void {
    this.obtenerCiudades();
    this.formGroupColonias = this._formBilder.group({
      selectCiudad: new FormControl(),
    });
  }

  obtenerCiudades(): void {
    Alertas.load('', 'Cargando Ciudades ...');
    this._coloniasService.ObtenerCiudades().subscribe(data => {
      Alertas.close();
      this.ciudades = data;
    }, error => {
      Alertas.showHttpResponse(error);
    });
  }

  obtenerColoniasDeCiudad(): void {
    Alertas.load();
    this._coloniasService.ObtenerColoniasActivasDeCiudad(this.formGroupColonias.get('selectCiudad').value).subscribe(data => {
      Alertas.close();
      this.colonias = data;
    }, error => {
      Alertas.showHttpResponse(error);
    });
  }

  limpiarSeleccion(): void {
    if (this.colonias === null) { return; }

    this.colonias.forEach(colonia => {
      colonia.seleccionada = false;
      colonia.esCorrecta = false;
    });
  }

  actualizarColoniaCorrecta(): void {

    if (!this.sonDatosValidos()) {
      return;
    }

    Alertas.question('', '¿Desea actualizar las colonias seleccionadas?').then(data => {
      Alertas.load();
      const coloniasCorreccion = this.obtenerColoniasPorCorregir();
      this._coloniasService.ActualizarColoniaCorrecta(coloniasCorreccion).subscribe(data => {
        this.obtenerColoniasDeCiudad();
        this._gridColonias.instance.clearFilter();
        Alertas.ok('', 'Colonias actulizadas exitosamente');
      }, error => {
        Alertas.showHttpResponse(error);
      });
    });
  }

  obtenerColoniasPorCorregir(): ColoniaCorregir[] {
    let coloniasCorregir = [];

    this.colonias.forEach(colonia => {
      const colCorregir = new ColoniaCorregir();

      if (colonia.seleccionada) {
        colCorregir.esColoniaCorrecta = colonia.esCorrecta;
        colCorregir.id = colonia.id;
        coloniasCorregir.push(colCorregir);
      }
    });

    return coloniasCorregir;
  }

  sonDatosValidos(): boolean {
    const ciudadId = this.formGroupColonias.get('selectCiudad').value;

    if (helpers.isNullEmptyOrWhiteSpace(ciudadId)) {
      Alertas.info('', 'Debe de seleccionar una ciudad');
      return false;
    }

    if (this.colonias === null || this.colonias.length === 0) {
      Alertas.info('', 'La ciudad seleccionada no cuenta con colonias.');
      return false;
    }

    const cantidadSeleccionda = this.colonias.filter(x => x.seleccionada);
    if (cantidadSeleccionda.length < 1) {
      Alertas.info('', 'Debe de seleccionar las colonias a corregir');
      return false;
    }

    const existeCorrect = this.colonias.some(x => x.esCorrecta);
    if (!existeCorrect) {
      Alertas.info('', 'Del grupo de colonias seleccionads es necesario que seleccione una colonia correcta.');
      return false;
    }

    return true;
  }

  onValueChangedCiudad(e: any): void {
    this.obtenerColoniasDeCiudad();
  }

  onRowValidatingGrid(data: any): void {

    const esColoniCorrecta = data.newData.esCorrecta !== undefined;
    if (esColoniCorrecta) {
      data.oldData.seleccionada = true;
      this.actualizarColoniasCorrectas(data.newData.id);
    }
  }

  actualizarColoniasCorrectas(coloniaId: number): void {
    this.colonias.forEach(colonia => {
      if (colonia.id !== coloniaId) {
        colonia.esCorrecta = false;
      }
    });
  }

}
