import { Component, OnInit } from "@angular/core";
import { forEach } from "@angular/router/src/utils/collection";
import { Console } from "console";
import { element } from "protractor";
import { Alertas } from "../../../../helpers/notificaciones/notificaciones";
import { Monitoreotransacciones } from "../../models/Monitoreotransacciones.model";
import { Pipe, PipeTransform } from '@angular/core';
import { MonitoreotransaccionesService } from "../../services/monitoreotransacciones.service";

@Component({
  selector: "app-monitoreo-transacciones",
  templateUrl: "./monitoreo-transacciones.component.html",
  styleUrls: ["./monitoreo-transacciones.component.css"],
})
export class MonitoreotransaccionesComponent implements OnInit {
  public monitoreotransacciones: Monitoreotransacciones[] = [];
  public esModoEditar: boolean = false;
  fechaFinal:Date = new Date();
  fechaInicial:Date = new Date();
  public ValorMaximo:number = 0;
  public CantidadTotal: number  = 0;
  valorMaximoString: string = '';
  bloquearBusqueda: boolean = true;
  PaisID : number = parseInt(localStorage.getItem("PaisId"))

  constructor(
    private _monitoreotransaccionesService: MonitoreotransaccionesService
  ) {}

  ngOnInit() {
    this.obtenerLimite();
  }
  validarBoton(){
        
    if(this.validarCamposVacios() || 
        this.validarFechaInicialMenor() || 
        this.validarFormato()
        ){
        this.bloquearBusqueda = true
        return
    }
    this.bloquearBusqueda = false;
}

CantidadTexto(value) {
  return 'Porcentaje: ' + parseFloat((value * 100 ).toString() ).toFixed(2) + '%';
}

customizeTotal(data) {
  return "Total: " + Intl.NumberFormat('en-US').format(data.value);
}

customizeNumeros(data){
  console.log(data);
  return Intl.NumberFormat('en-US').format(data);
}

validarCamposVacios(){
    if( !this.fechaInicial || !this.fechaFinal){
        return true
    }
    
    return false;
}
  validarFechaInicialMenor(){
      if( this.fechaInicial > this.fechaFinal){
          Alertas.error("La fecha inicial tiene que ser menor o igual")
          this.resetearFechas();
          return true
      }
      return false
  }

  validarFormato(){
      var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/; //Declare Regex
      if( !this.fechaInicial.toLocaleDateString().match(rxDatePattern) ||
          !this.fechaFinal.toLocaleDateString().match(rxDatePattern) 
      ){
          Alertas.error("Formato de fecha Incorrecto")
          this.resetearFechas();
          return true
      }
      return false
  }
  resetearFechas(){
    this.fechaFinal = new Date()
    this.fechaInicial = new Date();
  }
  obtenerReporte() {
    
    this.obtenerMonitoreotransacciones();
   
  }

  obtenerLimite():void {
    this._monitoreotransaccionesService.obtenerLimite().subscribe(
      (data) => {
        this.ValorMaximo = data;
        this.valorMaximoString = this.customizeNumeros(data)
         Alertas.close()
       },
      (error) => {
        Alertas.close()
        Alertas.error(
          "Error",
          "No se pudo obtener limite "
        );
         
      }
    );
   
  }

  obtenerMonitoreotransacciones(): void {
    Alertas.load("Espere un momento por favor");
    this._monitoreotransaccionesService.obtenerMonitoreotransacciones(this.fechaInicial,this.fechaFinal).subscribe(
      (data) => {
        this.monitoreotransacciones = data as Monitoreotransacciones[];
         this.monitoreotransacciones.forEach(element => {
          this.CantidadTotal += element.cantidad;
         })
         Alertas.close()
       },
      (error) => {
        Alertas.close()
        Alertas.error(
          "Error",
          "No se pudo obtener Reporte de Monitoreo de Limite de transacciones "
        );
         
      }
    );
   
  }

  
}


@Pipe({
  name: 'NumberPipe'
})

export class NumberPipe implements PipeTransform {
  transform(value: number): string {
    return  Intl.NumberFormat('en-US').format(value);
  }
}