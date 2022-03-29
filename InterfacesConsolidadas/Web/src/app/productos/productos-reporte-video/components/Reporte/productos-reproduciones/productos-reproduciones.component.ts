import { Component, OnInit } from '@angular/core';
import {ProductosReproducionesService} from '../../../services/productos-reproduciones.service';
import {ProductoReproducionesListado} from '../../../models/producto-reproduciones-listado.model';
import { Alertas } from '../../../../../helpers/notificaciones/notificaciones';

@Component({
  selector: 'productos-reproducciones',
  templateUrl: './productos-reproduciones.component.html',
  styleUrls: ['./productos-reproduciones.component.css'],
  providers: [ProductosReproducionesService]
})
export class ReporteReporducionDeVideoComponent implements OnInit {

  constructor( private reproducionesService: ProductosReproducionesService) { }

  listadoProductosReproduciones: ProductoReproducionesListado[] = [];
  fechaFinal:Date = new Date();
  fechaInicial:Date = new Date();
  bloquearBusqueda: boolean = true;
  ngOnInit() {
 
  }

  ObtenerListadoProductosConAtributos() {
    this.reproducionesService.obtenerReproducionesDeVideo(this.fechaInicial,this.fechaFinal).subscribe( r => {
      this.listadoProductosReproduciones = r;
    });
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

 
  customizeTotal(data) {
    return "Reproducciones: " + data.value;
  }

  customizePorcentaje(data) {
    return "Porcentaje: " + Number(data.value).toFixed(2);
  }
}
