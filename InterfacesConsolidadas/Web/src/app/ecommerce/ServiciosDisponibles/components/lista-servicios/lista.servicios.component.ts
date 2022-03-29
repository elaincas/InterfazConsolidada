import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../../app/login/services/login.service';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { isUndefined } from 'util';
import { ListaServiciosService } from '../../services/lista.servicios.service';
import { Servicios } from '../../models/Servicios';

@Component({
  styleUrls: ['./lista.servicios.component.css'],
  selector: 'app-lista-servicios',
  templateUrl: './lista.servicios.component.html',
  providers: [ListaServiciosService, LoginService]
})
export class ListaServiciosDisponibles implements OnInit {
  constructor(private service: ListaServiciosService,
              private loginService: LoginService) { }

  // Variables
  ListaServicios: any[] = [];
  mostrarPopUpServicio: boolean = false;

  // modelos
  ServicioEditar: Servicios;

  ngOnInit() {   
    Alertas.load();
    this.ObtenerLista();
    Alertas.close();
  }

  ObtenerLista() {    
    this.service.ObtenerListaServicios()
      .subscribe(r => {    
        this.ListaServicios = r;        
      });
  }

actualizarEstadoVisibleEnPaginaWeb(servicioId, Activo, servicio){
    this.service.ActualizarEstadoVisibleEnPaginaWeb(servicioId, !Activo, 
      this.loginService.Usuario.id)
    .subscribe(r => {
        this.ObtenerLista();
        servicio.activo = !Activo;  
        if(r)
        {
          Alertas.ok('¡Correcto!', `Servicio ${(servicio.activo) ? 'Habilitado.' : 'Deshabilitado.'}`);
        }   
        else
        {
          Alertas.ok('¡ERROR!', `Ha ocurrido un error mientras actualizabamos el servicio.`);
        }
          
    });
}

colorearFila = function (e) {
    if (e.rowType == "data"){
        let rowElement = e.rowElement;
        if (e.data.activo == true)
            rowElement.style.background = '#7cd88157';        
    }
}

EditarServicio(servicio) {
  setTimeout(() => {
      this.mostrarPopUpServicio = !this.mostrarPopUpServicio;
      this.ServicioEditar = new Servicios(servicio.id,servicio.descripcion,servicio.activo);
  },100)
}


OnEditarServicio(){
  if(isUndefined(this.ServicioEditar.Descripcion) || this.ServicioEditar.Descripcion == "")
  {
    Alertas.error('¡ERROR!', `El campo descripción es requerido.`);
  }
  this.service.ActualizarServicio(this.ServicioEditar.Id, this.ServicioEditar.Descripcion, 
    this.loginService.Usuario.id)
  .subscribe(r => {
      this.mostrarPopUpServicio = !this.mostrarPopUpServicio;
      this.ObtenerLista(); 
      if(r)
      {
        Alertas.ok('¡Correcto!', `Servicio actualizado correctamente.`);
      }
      else
      {
        Alertas.ok('¡ERROR!', `Ha ocurrido un error mientras actualizabamos el servicio.`);
      }
  });
}

}
