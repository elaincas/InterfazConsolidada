import { Component, OnInit } from '@angular/core';
import { ProductoMalEstadoPerdidosService } from './productos-malestadoperdidos.service';
import { LoginService } from '../../../../../login/services/login.service';
import { ProductoPrestamos } from '../../../Clases/Producto';
import { Alertas } from "../../../helpers/notificaciones/notificacion";


declare var $: any;
@Component({
  selector: 'app-ingreso-producto',
  templateUrl: './productos-malestadoperdidos.component.html',
  styleUrls: ['./productos-malestadoperdidos.component.css'],

})
export class ProductosMalEstadosPerdidosComponent implements OnInit {
    ngOnInit(): void {
    }

    productos : ProductoPrestamos;

    constructor(private service: ProductoMalEstadoPerdidosService, private loginService:LoginService) {
        this.productos= new ProductoPrestamos();    
        this.ObtenerProductosMalEstadosPerdidos();
    }
    ObtenerProductosMalEstadosPerdidos(){
        this.service.ObtenerProductosMalEstadosPerdidos().subscribe(data=>{
            this.productos.listaProductos = data.listaProductos as any[];
        })
    }
    onEditorPreparing(e: any): void {
        if (e.parentType == "dataRow" && e.dataField != "valeId") {
            e.editorOptions.readOnly = true;
            e.editorOptions.maxLength = 255;
        }

    }
    ActualizarDatoValeColaborador(dataEvent){
        dataEvent.key.usuarioId = this.loginService.Usuario.id;
        Alertas.question("Actualizar Vale","Desea actualizar el vale del colaborador: "+dataEvent.key.nombreColaborador+" ?").then(data=>{
            this.service.ActualizarValeProductoColaborador(dataEvent.key).subscribe(data=>{
                Alertas.ok("","Éxito");
            },error=>{
                Alertas.warning("",error._body);
            this.ObtenerProductosMalEstadosPerdidos();
            });
        }).catch(data=>{
            this.ObtenerProductosMalEstadosPerdidos();
        });
    }
}