import {AfterViewInit, Component, OnInit, Renderer2, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, FormControl} from '@angular/forms';
import { InventarioProductosService} from './listado-productos-ingresados-inventario.service';
import {promise} from 'selenium-webdriver';
import {InventarioProductosUbicacion, TipoTransaccion} from '../../_Clases/InventarioProductosUbicacion';
import { IfObservable } from 'rxjs/observable/IfObservable';
import { Finalidades } from '../../_Clases/Finalidades';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';

@Component({
  selector: 'app-ingreso-productos',
  templateUrl: './listado-productos-ingresados-inventario.component.html',
  styleUrls: ['./listado-productos-ingresados-inventario.component.css'],
  providers: [InventarioProductosService]
})
export class InventarioProductoUbicacionComponent implements OnInit {

    dataInventario: InventarioProductosUbicacion[];
    busquedaInventario: InventarioProductosUbicacion;
    transaccion: Finalidades[];
    now:Date = new Date();
    constructor(private service: InventarioProductosService) {

        this.dataInventario =new Array<InventarioProductosUbicacion>();
        this.busquedaInventario = new InventarioProductosUbicacion();

        this.service.ObtenerTransacciones().subscribe(data=>{
            this.transaccion = data as Finalidades[];
            this.transaccion = new Array<Finalidades>();
            //FinalidadInventarioDescripcion,FinalidadInventarioId
            this.transaccion.push(new Finalidades(1,"Ingreso"));
            this.transaccion.push(new Finalidades(2,"Traslado"));
        });
    }

  ngOnInit() {

  }

  ObtenerDataInventario(){

    if(this.ValidarBusqueda()){
        this.service.ObtenerInventario(this.busquedaInventario).subscribe(data=>{
            this.dataInventario = data as InventarioProductosUbicacion[];
        },error=>{
            Alertas.error(error);
            this.dataInventario = new Array<InventarioProductosUbicacion>();
        })
    }
  }

  ValidarBusqueda():Boolean{
    if (this.busquedaInventario.FechaFinal == null || this.busquedaInventario.FechaFinal == undefined)
    {
        Alertas.warning("Ingrese una fecha final");
        return false
    }
    if (this.busquedaInventario.FechaInicial == null || this.busquedaInventario.FechaInicial == undefined)
    {
        Alertas.warning("Ingrese una fecha inicial");
        return false
    }
    if (this.busquedaInventario.TipoTransaccion == null || this.busquedaInventario.TipoTransaccion == undefined)
    {
        Alertas.warning("Ingrese un tipo de transacción");
        return false
    }
    return true
  }
 }
