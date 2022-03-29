import { ColoniasSadAgregarComponent } from './../colonias-sad-agregar/colonias-sad-agregar.component';
import { DxDataGridComponent } from 'devextreme-angular';
import { SwalPosition } from './../../../../helpers/notificaciones/SwalPosition';
import { Sucursal } from './../../models/sucursal.model';
import { Ciudad } from './../../models/ciudad.model';
import { ColoniaSad } from './../../models/coloniaSad.model';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ColoniaService } from './../../services/coloniaService.service';
import { Component, OnInit, AfterContentInit, ViewChild } from '@angular/core';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { helpers } from '../../../../helpers/utils';

@Component({
  selector: 'app-colonias-sad-editar',
  templateUrl: './colonias-sad-editar.component.html',
  styleUrls: ['./colonias-sad-editar.component.css']
})
export class ColoniasSadEditarComponent implements OnInit, AfterContentInit {

  @ViewChild('appColoniasAdd') private _appColoniasAdd: ColoniasSadAgregarComponent;
  @ViewChild('gridColonias') private _gridColonias: DxDataGridComponent;
  formGroupColonia: FormGroup;
  formGroupEditar: FormGroup;

  coloniasSad: ColoniaSad[];
  coloniasSadEditar: ColoniaSad[];
  ciudades: Ciudad[];
  sucursales: Sucursal[];
  sucursalesEdit: Sucursal[];
  _mostrarPopup: boolean;
  minDate: Date = new Date(2020, 1, 1, 4, 0, 0);
  maxDate: Date = new Date(2020, 1, 1, 24, 0, 0);
  fechaApertura: Date;
  fechaCierre: Date;
  _mostrarPopupAdd: boolean;
  seTrabajaDomingo: boolean;

  constructor(private _coloniaService: ColoniaService,
    private _formBuilder: FormBuilder) { }

  ngAfterContentInit(): void {

  }

  ngOnInit() {
    this.cargarVariables();
    this.obtenerCiudades();
  }

  cargarVariables(): void {
    this.formGroupColonia = this._formBuilder.group({
      selectCiudad: new FormControl(),
      selectSucursal: new FormControl()
    });

    this.coloniasSad = [];
    this.cargarFormGroupEditar();
  }

  cargarFormGroupEditar(): void {
    this.formGroupEditar = this._formBuilder.group({
      selectSucursal: new FormControl(),
      horaAperturaLV: new FormControl(new Date(2020, 1, 1, 7, 0, 0)),
      horaCierreLV: new FormControl(new Date(2020, 1, 1, 19, 0, 0)),
      horaAperturaSabado: new FormControl(new Date(2020, 1, 1, 7, 0, 0)),
      horaCierreSabado: new FormControl(new Date(2020, 1, 1, 19, 0, 0)),
      horaAperturaDomingo: new FormControl(new Date(2020, 1, 1, 7, 0, 0)),
      horaCierreDomingo: new FormControl(new Date(2020, 1, 1, 19, 0, 0)),
      checkActivo: new FormControl(true),
      trabajaDomingos: new FormControl(false)
    });
  }

  limpiar(): void {
    this.coloniasSad = [];
  }

  obtenerCiudades(): void {
    Alertas.load();
    this._coloniaService.ObtenerCiudades().subscribe(data => {
      Alertas.close();
      this.ciudades = data;
      this.formGroupColonia.get('selectCiudad').setValue('00');
    });
  }

  onValueChangedCiudad(e: any): void {
    Alertas.load();
    this._coloniaService.ObtenerSucursalesSadDeCiudad(e.value).subscribe(data => {
      Alertas.close();
      this.sucursales = data;
      this.formGroupColonia.get('selectSucursal').setValue(0);
    }, error => {
      Alertas.showHttpResponse(error);
    });
  }

  onValueChangedSucursal(e: any): void {


  }

  cargarColoniasSADdeSucursal(): void {
    Alertas.load();
    this._coloniaService.ObtenerColoniasSadDeSucursal
      (this.formGroupColonia.get('selectCiudad').value,
        this.formGroupColonia.get('selectSucursal').value)
      .subscribe(data => {
        Alertas.close();
        console.log(data);

        this.coloniasSad = data;
      }, error => {
        Alertas.showHttpResponse(error);
      });
  }


  onRowDblClickColonia(e: any): void {
    console.log(e);
  }
  cargarColoniasPorEditar(): void {
    this.coloniasSadEditar = this.coloniasSad.filter(x => x.seleccionada === true);
  }

  cargarSucursales(): void {
    this._coloniaService.ObtenerSucursalesSadDeCiudad('00')
      .subscribe(data => {
        this.sucursalesEdit = data;
        const sucursal = this.sucursalesEdit.find(x => x.id === 0);
        const index = this.sucursalesEdit.indexOf(sucursal);
        this.sucursalesEdit.splice(index, 1);
      });
  }

  mostrarPopupEditar(): void {
    this.cargarSucursales();
    this.cargarColoniasPorEditar();

    if (this.coloniasSadEditar.length === 0) {
      Alertas.info('', 'Debe de seleccionar por lo menos una colonia.');
      return;
    }

    this._mostrarPopup = true;
  }

  actualizarSucursalDeColonias(): void {

    const esSucursalInValida = helpers.isNullEmptyOrWhiteSpace(this.formGroupEditar.get('selectSucursal').value);
    if (esSucursalInValida) {
      return;
    }

    this.coloniasSadEditar.forEach(colonia => {
      colonia.sucursalId = this.formGroupEditar.get('selectSucursal').value;
    });

    Alertas.load();
    this._coloniaService.ActualizarColoniasSad(this.coloniasSadEditar)
      .subscribe(data => {
        Alertas.close();
        Alertas.ok('', 'Colonias Actualizadas');
        this.limpiarPopup();
        this.cargarColoniasSADdeSucursal();
      }, error => {
        Alertas.showHttpResponse(error);
      });
  }

  limpiarPopup(): void {
    this._mostrarPopup = false;
    this.formGroupEditar.get('selectSucursal').setValue(0);
    this.cargarFormGroupEditar();
  }

  onRowPrepared(e: any): void {
    if (e.rowType === 'data') {
      if (e.data.seleccionada === true) {
        e.rowElement.style.backgroundColor = '#3498db';
      }
    }
  }

  onKeyDownGrid(e: any): void {
    if (e.event.key === 'Delete') {
      // const rowKey = this._gridColonias.focu;

    }
  }



  actualizarHorarioLunesViernes(dateApertura: string, dateCierre: string): void {
    this.fechaApertura = this.formGroupEditar.get(dateApertura).value;
    this.fechaCierre = this.formGroupEditar.get(dateCierre).value;

    let seTrabajaDomingo = false;

    if (this.formGroupEditar.get('trabajaDomingos').value)
      seTrabajaDomingo = true;

    const validarHoras = !(dateApertura.includes('Domingo') && !seTrabajaDomingo);

    if (validarHoras) {

      if (this.fechaApertura === null || this.fechaApertura === undefined) {
        Alertas.info('', 'La hora de apertura es requerida.', true, SwalPosition.topright);
        return;
      }

      if (this.fechaCierre === null || this.fechaCierre === undefined) {
        Alertas.info('', 'La hora de cierre es requerida.', true, SwalPosition.topright);
        return;
      }

      if (this.fechaCierre < this.fechaApertura) {
        Alertas.info('', 'La hora de cierre tiene que ser mayor a la hora de apertura.');
        return;
      }

    }

    const horaApertura = helpers.obtenerHoraDeFecha(this.fechaApertura);
    const horaCierre = helpers.obtenerHoraDeFecha(this.fechaCierre);

    this.coloniasSadEditar.forEach(colonia => {
      if (dateApertura.includes('LV')) {
        colonia.horaAperturaLunesAviernes = horaApertura;
        colonia.horaCierreLunesAviernes = horaCierre;
      }

      if (dateApertura.includes('Domingo')) {
        colonia.horaAperturaDomingos = seTrabajaDomingo ? horaApertura : '';
        colonia.horaCierreDomingos = seTrabajaDomingo ? horaCierre : '';
      }

      if (dateApertura.includes('Sabado')) {
        colonia.horaAperturaSabados = horaApertura;
        colonia.horaCierreSabados = horaCierre;
      }
    });

    Alertas.load();
    this._coloniaService.ActualizarColoniasSad(this.coloniasSadEditar).subscribe(data => {
      Alertas.ok('', 'Colonias actualizadas exitosamente');
      this.cargarColoniasSADdeSucursal();
    }, error => {
      Alertas.showHttpResponse(error);
    });
  }


  actualizarEstadoDeColoniasSad(): void {

    this.coloniasSadEditar.forEach(colonia => {
      colonia.activo = this.formGroupEditar.get('checkActivo').value;
    });

    Alertas.load();
    this._coloniaService.ActualizarColoniasSad(this.coloniasSadEditar).subscribe(data => {
      Alertas.ok('', 'Colonias actualizadas exitosamente.');
      this.cargarColoniasSADdeSucursal();
    }, error => {
      Alertas.showHttpResponse(error);
    });
  }

  mostrarPopupAgregarColoniaSAD(): void {
    this._appColoniasAdd.mostrarPopup = true;
  }

}
