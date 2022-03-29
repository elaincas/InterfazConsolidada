import { Component, OnInit } from '@angular/core';
import { ProductoDisponibleService } from './productos-disponibles.service';
import { LoginService } from '../../../../../login/services/login.service';

declare var $: any;
@Component({
  selector: 'app-ingreso-producto',
  templateUrl: './productos-disponibles.component.html',
  styleUrls: ['./productos-disponibles.component.css'],

})
export class ProductoDisponiblesComponent implements OnInit {
    ngOnInit(): void {
    }

    productosDisponibles : any[];

    constructor(private service: ProductoDisponibleService, private loginService:LoginService) {
            this.ObtenerProductosdisponibles();
    }
    ObtenerProductosdisponibles(){
        this.service.ObtenerProductosDisponibles(this.loginService.Usuario.id).subscribe(data=>{
            this.productosDisponibles = data as any[];
        })
    }
}