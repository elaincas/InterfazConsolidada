import { ColoniaSad } from './../../models/coloniaSad.model';
import { Sucursal } from './../../models/sucursal.model';
import { Ciudad } from './../../models/ciudad.model';
import { ColoniaService } from './../../services/coloniaService.service';
import { Component, OnInit, Input, AfterContentInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { Colonia } from '../../models/colonia.model';
import { helpers } from '../../../../helpers/utils';
import { SwalPosition } from '../../../../helpers/notificaciones/SwalPosition';

@Component({
  selector: 'app-colonias-sad-agregar',
  templateUrl: './colonias-sad-agregar.component.html',
  styleUrls: ['./colonias-sad-agregar.component.css']
})
export class ColoniasSadAgregarComponent implements OnInit, AfterContentInit {
  _gridBoxValue: number[] = [];
  mostrarPopup: boolean;
  formGroupNueva: FormGroup;
  ciudades: Ciudad[];
  sucursales: Sucursal[];
  colonias: Colonia[];
  coloniaSad: ColoniaSad;
  constructor(private _coloniaService: ColoniaService, private _formBuilder: FormBuilder) { }


  ngAfterContentInit(): void {

  }

  ngOnInit() {
    this.cargarVariables();
  }

  cargarVariables(): void {
    this.formGroupNueva = this._formBuilder.group({
      selectCiudad: new FormControl('00'),
      selectColonia: new FormControl(),
      selectSucursal: new FormControl(0),
      horaAperturaLV: new FormControl(new Date(2020, 1, 1, 7, 0, 0)),
      horaCierreLV: new FormControl(new Date(2020, 1, 1, 19, 0, 0)),
      horaAperturaSabado: new FormControl(new Date(2020, 1, 1, 7, 0, 0)),
      horaCierreSabado: new FormControl(new Date(2020, 1, 1, 19, 0, 0)),
      horaAperturaDomingo: new FormControl(new Date(2020, 1, 1, 7, 0, 0)),
      horaCierreDomingo: new FormControl(new Date(2020, 1, 1, 19, 0, 0)),
      checkActivo: new FormControl(true)
    });
  }

  set gridBoxValueSelect(value: Colonia[]) {
    this._gridBoxValue = [];

    if (value != null) {
      value.forEach(data => {
        this._gridBoxValue.push(data.id);
      });
    }
  }

  get gridBoxValue(): number[] {
    return this._gridBoxValue;
  }

  limpiar(): void {
    this.cargarVariables();
    this.coloniaSad = new ColoniaSad();
  }

  obtenerCiudades(): void {
    Alertas.load();
    this._coloniaService.ObtenerCiudades().subscribe(data => {
      Alertas.close();
      this.ciudades = data;
      this.obtenerColoniasSad('00');
      this.obtenerSucursalesDeCiudad('00');
      this.formGroupNueva.get('selectCiudad').setValue('00');
    });
  }

  obtenerSucursalesDeCiudad(ciudadId: string): void {
    Alertas.load();
    this._coloniaService.ObtenerSucursalesSadDeCiudad(ciudadId).subscribe(data => {
      Alertas.close();
      this.sucursales = data;
      const sucursal = this.sucursales.find(x => x.id === 0);
      const index = this.sucursales.indexOf(sucursal);
      this.sucursales.splice(index, 1);
      this.formGroupNueva.get('selectSucursal').setValue(0);
    }, error => {
      Alertas.showHttpResponse(error);
    });
  }

  onShowing(e: any): void {
    this.limpiar();
    this.obtenerCiudades();
  }

  onValueChangedCiudad(e: any): void {
    this.obtenerSucursalesDeCiudad(e.value);
    this.obtenerColoniasSad(e.value);
  }

  obtenerColoniasSad(ciudadId: string): void {
    Alertas.load();
    this._coloniaService.ObtenerColoniasSAD(ciudadId).subscribe(data => {
      Alertas.close();
      this.colonias = data;
    }, error => {
      Alertas.showHttpResponse(error);
    });
  }

  sonDatosValidos(): boolean {
    const esCiudadInValida = helpers.isNullEmptyOrWhiteSpace(this.formGroupNueva.get('selectCiudad').value);

    if (esCiudadInValida) {
      Alertas.info('', 'La ciudad es requerida.');
      return false;
    }

    const esSucursalInvalida = helpers.isNullEmptyOrWhiteSpace(this.formGroupNueva.get('selectSucursal').value);
    if (esSucursalInvalida) {
      Alertas.info('', 'La sucursal es requerida.');
      return false;
    }

    const esColoniaInvalida = helpers.isNullEmptyOrWhiteSpace(this.formGroupNueva.get('selectColonia').value);
    if (esColoniaInvalida) {
      Alertas.info('', 'La colonia es requerida.');
      return false;
    }

    const respuestaLv = this.asignarHorario('horaAperturaLV', 'horaCierreLV', 'Lunes a Viernes');

    if (!respuestaLv) {
      return false;
    }

    const respuestaSabado = this.asignarHorario('horaAperturaSabado', 'horaCierreSabado', 'Sábado');

    if (!respuestaSabado) {
      return false;
    }

    const respuestaDomingos = this.asignarHorario('horaAperturaDomingo', 'horaCierreDomingo', 'Domingo');

    if (!respuestaDomingos) {
      return false;
    }
    return true;
  }

  registrarColonia(): void {
    Alertas.load();

    if (!this.sonDatosValidos()) {
      return;
    }

    this.coloniaSad.activo = true;
    this.coloniaSad.ciudadId = this.formGroupNueva.get('selectCiudad').value;
    this.coloniaSad.coloniaId = this._gridBoxValue[0];
    this.coloniaSad.sucursalId = this.formGroupNueva.get('selectSucursal').value;

    let _colonias = [];
    _colonias.push(this.coloniaSad);
    this._coloniaService.AgregarColoniasSad(_colonias).subscribe(data => {
      Alertas.ok('', 'Colonia creada exitosamente');
      this.mostrarPopup = false;
    }, error => {
      Alertas.showHttpResponse(error);
    });
  }


  asignarHorario(dateApertura: string, dateCierre: string, mensaje: string): boolean {
    const fechaApertura = this.formGroupNueva.get(dateApertura).value;
    const fechaCierre = this.formGroupNueva.get(dateCierre).value;

    if (fechaApertura === null || fechaApertura === undefined) {
      Alertas.info('', `La hora de apertura de ${mensaje} es requerida.`);
      return false;
    }

    if (fechaCierre === null || fechaCierre === undefined) {
      Alertas.info('', `La hora de cierre de  ${mensaje} es requerida.`);
      return false;
    }

    if (fechaCierre < fechaApertura) {
      Alertas.info('', `La hora de cierre de  ${mensaje} tiene que ser mayor a la hora de apertura.`);
      return false;
    }

    const horaApertura = helpers.obtenerHoraDeFecha(fechaApertura);
    const horaCierre = helpers.obtenerHoraDeFecha(fechaCierre);
    if (dateApertura.includes('LV')) {
      this.coloniaSad.horaAperturaLunesAviernes = horaApertura;
      this.coloniaSad.horaCierreLunesAviernes = horaCierre;
    }

    if (dateApertura.includes('Domingo')) {
      this.coloniaSad.horaAperturaDomingos = horaApertura;
      this.coloniaSad.horaCierreDomingos = horaCierre;
    }

    if (dateApertura.includes('Sabado')) {
      this.coloniaSad.horaAperturaSabados = horaApertura;
      this.coloniaSad.horaCierreSabados = horaCierre;
    }

    return true;
  }

  displayExprColonia(e: any): string {
    if (e === undefined) {
      return '';
    }
    
    return e.id + ' - ' + e.nombre;
  }

}
