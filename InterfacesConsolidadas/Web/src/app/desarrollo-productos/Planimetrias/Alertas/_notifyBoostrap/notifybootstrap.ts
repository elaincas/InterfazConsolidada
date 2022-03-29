import {Injectable} from "@angular/core";
import {TiposNotificacion} from "./tipos-notificacion.enum";
declare var $:any;
@Injectable()
export  class notificacionBoostrap{
  showNotification(from,mensaje, align,tipo:number){
    var type = ['warning','success','info','danger',''];



    $.notify({
      icon: "notifications",
      message: mensaje

    },{
      type: type[tipo],
      timer: 3000,
      placement: {
        from: from,
        align: align
      }
    });
  }

}
