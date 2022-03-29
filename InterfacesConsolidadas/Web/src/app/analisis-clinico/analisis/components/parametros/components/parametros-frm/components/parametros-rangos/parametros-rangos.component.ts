import { Component, EventEmitter, OnInit } from '@angular/core';
import { Forms } from '../../../../../../../../helpers/forms';
import { Alertas, Notificaciones } from '../../../../../../../../helpers/notificaciones/notificaciones';
import { AnalisisClinicoService } from '../../../../../../../analisis-clinico.service';
import { MensajesGenericosAC } from '../../../../../../helpers/mensajes';
import { stringAc } from '../../../../../../helpers/stringFormat';
import { NivelResultado } from '../../../../../../models/nivelResultado.model';
import { ParametroGrupo } from '../../../../../../models/parametroGrupo.model';
import { ParametroRango } from '../../../../../../models/parametroRango.model';
import { NivelResultadoService } from '../../../../../../services/nivelResultadoService';
import { ParametrosGrupoService } from '../../../../../../services/parametrosGrupoService';

@Component({
  selector: 'app-parametros-rangos',
  templateUrl: './parametros-rangos.component.html',
  styleUrls: ['./parametros-rangos.component.css'],
  inputs: ['modo', 'parametrosRangos', 'parametroId'],
  outputs: ['parametrosRangosChange']
})
export class ParametrosRangosComponent implements OnInit {

  modo: Forms.Modo;
  parametroId: number;
  parametroRango:ParametroRango;
  parametrosRangos: ParametroRango[];
  parametrosRangosChange: EventEmitter<ParametroRango[]> = new EventEmitter();
  nivelesResultado: NivelResultado[];
  grupos: ParametroGrupo[];
  editarParametroRango: boolean = false;
  constructor(private nivelesResultadoService: NivelResultadoService, private parametrosGrupoService: ParametrosGrupoService) { }

  ngOnInit() {
    this.CargarGrupos();
    this.CargarNivelesResultado();
    this.parametroRango = new ParametroRango;
    if (this.parametrosRangos == undefined) {
      this.parametrosRangos = [];
    }
  }

  CargarGrupos(): void {
    this.parametrosGrupoService.ObtenerParametrosGrupos().subscribe(data => {
      this.grupos = data.filter(x=>x.activo == true) as ParametroGrupo[];
    }, error =>{
      Alertas.errorEnServidor();
    });
  }

  CargarNivelesResultado() {
    this.nivelesResultadoService.ObtenerNivelesResultado().subscribe(data => {
      this.nivelesResultado = data.filter(x=>x.activo ==true) as NivelResultado[];
    }, error =>{
      Alertas.errorEnServidor();
    });
  }

  Validar(): void {
    let rango = this.parametroRango;

    if(rango.edadMaxima < rango.edadMinima){
      Notificaciones.error("La edad máxima no puede ser menor que la edad mínima");
      return;
    }

    if(rango.valorMaximo < rango.valorMinimo){
      Notificaciones.error("El valor máximo no puede ser menor que el valor mínimo");
      return;
    }

    if(rango.grupoId == undefined || rango.grupoId <= 0){
      Notificaciones.error("Seleccione el grupo");
      return;
    }

    if(rango.nivelResultadoId == undefined || rango.nivelResultadoId <= 0){
      Notificaciones.error("Seleccione el nivel de resultado");
      return;
    }

    if(rango.descripcion == undefined || rango.descripcion == ""){
      Notificaciones.error("La descripción es un dato requerido");
      return;
    }

    if(this.parametrosRangos.find(
      x => x.grupoId == rango.grupoId &&
           x.nivelResultadoId == rango.nivelResultadoId &&
           x.descripcion == rango.descripcion &&
           x.edadMaxima == rango.edadMaxima && x.edadMinima == rango.edadMinima &&
           x.valorMaximo == rango.valorMaximo && x.valorMinimo == rango.valorMinimo
      ) != undefined){
        Notificaciones.error("Ya existe un rango con los mismos datos");
      return;
    }

    rango.parametroGrupo = this.grupos.find(x => x.id == rango.grupoId);
    rango.nivelResultado = this.nivelesResultado.find(x => x.id == rango.nivelResultadoId);
    rango.parametroId = this.parametroId;
    this.AgregarRango(rango);
  }

  compararEdadMaxima =() =>{
    return this.parametroRango.edadMinima;
  }

  compararEdadMinima =() =>{
    return this.parametroRango.edadMaxima;
  }

  compararValorMaximo =() =>{
    return this.parametroRango.valorMinimo;
  }

  compararValorMinimo =() =>{
    return this.parametroRango.valorMaximo;
  }


  AgregarRango(rango: ParametroRango) {
    this.parametrosRangos.push(rango);
    this.parametrosRangosChange.emit(this.parametrosRangos);
  }

  EliminarRango(rango: ParametroRango) {
    if (this.parametrosRangos == undefined || this.parametrosRangos.length == 0) {
      Notificaciones.error("No hay rangos que eliminar");
      return;
    }
    const index = this.parametrosRangos.indexOf(rango);
    if (index === -1) {
      return;
    }
    if (this.modo == Forms.Modo.Actualizar) {
      let msgDelete = MensajesGenericosAC.eliminar;
      Alertas.question(msgDelete).then(response => {
        this.parametrosRangos.splice(index, 1);
        this.parametrosRangosChange.emit(this.parametrosRangos);
      });
    } else {
      this.parametrosRangos.splice(index, 1);
      this.parametrosRangosChange.emit(this.parametrosRangos);
    }
  }

  EditarRango(e) {

    if (this.modo == Forms.Modo.Actualizar) {
      if (this.editarParametroRango == false) {
        this.editarParametroRango = true
        return;
      }
      if (this.editarParametroRango == true) {
        this.editarParametroRango = false;
        return;
      }
    }
  }
  edit(e){
    if(e.data != undefined){
      var rangoEditadoId = e.key.id;
      this.parametrosRangos.find(x => x.id == rangoEditadoId).editado = true;
    }
  }

}
