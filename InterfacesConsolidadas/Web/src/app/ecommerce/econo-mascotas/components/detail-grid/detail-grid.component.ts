import { AfterViewInit } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { EconoMascotasService } from '../../econo-mascotas.service';

@Component({
  selector: 'app-detail-grid',
  templateUrl: './detail-grid.component.html',
  styleUrls: ['./detail-grid.component.css']
})
export class DetailGridComponent implements OnInit, AfterViewInit {
  _productosAtributosGrid: any;
  @Input() key: string;
  constructor(public econoMascotasService: EconoMascotasService,) { }

  ngOnInit() {
  }
  cargarDetalle(): void {
    this.econoMascotasService.GetAtributosProductosDetalleValor(this.key).subscribe(d => { this._productosAtributosGrid = d; })

  }
  ngAfterViewInit() {
    this.cargarDetalle();
  }
  delete(e: any): void {
    Alertas.question("Alerta", "¿Esta seguro que desea eliminar el atributo?").then(d => {
      this.econoMascotasService.DeleteProductoAtributoDetalle(e.id).subscribe(d => {
        this.cargarDetalle();
      });
    });
  }
}
