import { DatePipe } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import dataSource from 'devextreme/data/data_source';
import {IngresoReembolsoService} from '../../services/ingresosreembolsos/ingresoReembolsoService.service'
import {MaestrosServices} from '../../services/maestros/maestrosServices.service'
import customStorage from 'devextreme/data/custom_store';
import customStorareOptions from 'devextreme/data/custom_store';
import { helpers } from '../../.../../../../helpers/utils';
import { Alertas } from '.././../../../helpers/notificaciones/notificaciones';
import {Ciudades,ColaboradorVHUR,SupervisorSucursal} from '../../models/maestros.models'
import {Reembolso} from '../../models/reembolsos.models'
import { LoginService } from '../../../../login/services/login.service';
declare var $: any;
@Component({
  selector: 'app-ingreso-reembolso',
  templateUrl: './ingresoreembolso.component.html'  ,
  styleUrls: ['./ingresoreembolso.component.css'],

})
export class IngresoReembolsoComponent implements OnInit {
  dataSource: dataSource;
  sucursales:any[];
  supervisores:any[];
  ciudades:any[];
  colaboradores:any[];
  supervisor:SupervisorSucursal[];
  reembolso:Reembolso;
  colaborador:ColaboradorVHUR;
  fechaAReembolsar:Date=new Date();
  valorAPagar:number=0;
  iArchivo: string;
  bloquearBusqueda:boolean=true;
  fecha= new Date()
  now = new Date();
  constructor(private ingresoReembolsoService: IngresoReembolsoService,private maestrosService:MaestrosServices, private loginService: LoginService) {
    this.reembolso= new Reembolso();
    this.colaborador=new ColaboradorVHUR();
    this.supervisor=new Array<SupervisorSucursal>();
    this.ciudades= new Array<Ciudades>();
    this.obtenerSucursales();
    this.obtenerCiudades();

  }

   ngOnInit() {

  }

  CalcularFecha(){
    let suma3dias = 60*24*60*60*1000;// (días * 24 horas * 60 minutos * 60 segundos * 1000 milésimas de segundo)
    
    this.reembolso.fechaIngreso=this.colaborador.fechaIngreso;
    let calcularFechaReembolso = this.colaborador.fechaIngreso.getTime()+suma3dias;
    this.fecha = new Date(calcularFechaReembolso);
  }

  CalcularPago(){
    if(this.reembolso.diasViajados>99){
      Alertas.warning("Dias viajados ingresado no permitidos!");
      return;
    }
    this.valorAPagar=this.reembolso.diasViajados*this.reembolso.gastoDiario;


   }

  obtenerSucursales():void{
      this.maestrosService.obtenerSucursales().subscribe(data => {
        this.sucursales = data;
        this.reembolso;
        console.log(this.sucursales);
      },
    error=>{
      this.MostrarError("No se pueden obtener las sucursales","Advertencia")
    });
  }
    obtenerCiudades(){
      this.maestrosService.obtenerCiudades().subscribe(data => {
        this.ciudades = data;
        console.log(this.sucursales);
      },
    error=>{
      this.MostrarError("Ha ocurrido un error al obtener las ciudades","Advertencia!");
    });
  }
  obtenerSupervisores():void{
      this.maestrosService.obtenerSupervisores().subscribe(data=>{
          this.supervisores=data;
          console.log(this.supervisores);
      },error=>{
        this.MostrarError("Posiblemente no hay supervisores para mostrar","Advertencia");
      });

  }

  obtenerSupervisorSegunSucursal(dataSucursal){

    this.ingresoReembolsoService.obtenerSupervisorSegunSucursal(dataSucursal.value).subscribe(data=>{
      this.supervisor=data as any;
      if(this.supervisor.length==1){
        this.reembolso.usuarioSupervisorId=this.supervisor[0].usuarioSupervisorId;
      }
      console.log(this.reembolso);
    },error=>{
      console.log(error);
    });
  }


  ObtenerColaborador(){
        this.ingresoReembolsoService.obtenerColaboradorPorID(this.colaborador.colaboradorID).subscribe(data=>{
          this.colaborador=data as any;
          this.colaborador.fechaIngreso=new Date(this.colaborador.fechaIngreso);
          this.reembolso.colaboradorId=this.colaborador.colaboradorID;
          this.reembolso.colaboradorPuestoId=this.colaborador.puestoID;
          this.reembolso.fechaIngreso=this.colaborador.fechaIngreso;
          console.log(this.colaborador);
       },error=>{
         this.MostrarError(error,"Advertencia");
       })
    }

    DesbloquearBusqueda(dato){
      if(dato==0)
      {
          this.bloquearBusqueda=true;
      }
      else if(dato==undefined || dato==null){
        this.bloquearBusqueda=true;
      }
      else{
        this.bloquearBusqueda=false;
      }
    }
    MostrarError(error,titulo){
      Alertas.showHttpResponse(error, titulo);
    }

    LimpiarControles(){
      this.reembolso=new Reembolso();
      this.colaborador= new ColaboradorVHUR();
    }


  IngresoReembolsoClick(){

    console.log(this.reembolso);
      if(this.Validaciones(this.reembolso)){
        this.reembolso.usuarioId=this.loginService.Usuario.id;
        this.ingresoReembolsoService.agregarReembolso(this.reembolso).subscribe(data=>{
            console.log(data);
            let mensaje=data as any;
            this.LimpiarControles();
            Alertas.ok("Éxito");
        },error=>{

          this.MostrarError(error,"Advertencia");
        });
      }

  }

Validaciones(reembolso):boolean{
  console.log(reembolso);
  let fechaActual:Date=new Date;
  if(reembolso.sucursalId==0 || reembolso.sucursalId==undefined){
    Alertas.warning("","No puede ingresar un reembolso sin haber seleccionado una sucursal!");
    return false;
  }
  if(reembolso.usuarioSupervisorId==0 || reembolso.usuarioSupervisorId==undefined){
    Alertas.warning("","Asegure de ingresar un supervisor!");
    return false;
  }
  if(reembolso.colaboradorId==0 || reembolso.colaboradorId==null){
  console.log(reembolso.colaboradorId);
    Alertas.warning("","El colaborador es inválido");
    return false;
  }
  if(reembolso.colaboradorId!=this.colaborador.colaboradorID){
    Alertas.warning("","No concuerda el codigo del colaborador buscado al que actualemente está ingresando!")
    return false;
  }
  if(reembolso.ciudadOrigenId==0 || reembolso.ciudadOrigenId==undefined)
  {
    Alertas.warning("","Debe seleccionar la ciudad de origen!");
    return false;
  }
  if(reembolso.ciudadDestinoId==0 || reembolso.ciudadDestinoId==undefined)
  {
    Alertas.warning("","Debe seleccionar la ciudad  de destino!");
    return false;
  }
  if(reembolso.fechaIngreso==null)
  {
    Alertas.warning("","La fecha de ingreso es inválida!");
    return false;
  }
  if(reembolso.fechaIngreso>fechaActual){
    Alertas.warning("","No se puede ingresar una fecha mayor de hoy!")
    return false;
  }
  if(this.valorAPagar==0){
    Alertas.warning("","El valor a pagar no puede ser 0!");
    return false;
  }
  if(this.reembolso.rutaDocumentoCompromiso==null || this.reembolso.rutaDocumentoCompromiso.length==0)
  {
    Alertas.warning("","Asegurese de haber ingresado un archivo de compromiso!")
    return false;
  }
  return true;
}


}
