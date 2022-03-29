import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { PoliticaVencimientoService } from '../../services/politica-vencimiento.service';
import { PoliticasModalComponent } from '../politicas-modal/politicas-modal.component';
import { PoliticaProveedorDto, Distribuidores, DistribuidorPoliticaPorProveedorDto } from '../../models/politicaProveedor';

@Component({
  selector: 'app-politicas',
  templateUrl: './politicas.component.html',
  styleUrls: ['./politicas.component.css']
})
export class PoliticasComponent implements OnInit {

  @ViewChild('politicaModal') politicaModal: PoliticasModalComponent;
  
  Proveedores: PoliticaProveedorDto[];
  Distribuidores: Distribuidores[];

  constructor(private politicaVencimientoService: PoliticaVencimientoService, private route: Router)
  {
    this.Proveedores = new Array<PoliticaProveedorDto>();
    this.Distribuidores = new Array<Distribuidores>();
  }
  
  ngOnInit() {
    this.cargarProveedores();
    this.cargarDistribuidores();
  }

  cargarProveedores(): void {
    Alertas.load();
    this.politicaVencimientoService.obtenerProveedoresActivos().subscribe(response => {
      Alertas.close();
      this.Proveedores = response;
    }, error =>{
      Alertas.close();
      Alertas.error("Error","Error al obtener los laboratorios \n Estatus: "+error.status+" \n Mensaje: "+error.statusText);
    });
  }

  cargarDistribuidores(): void {
    this.politicaVencimientoService.obtenerDistribuidores().subscribe(response => {
      this.Distribuidores = response;
    });
  }

  nuevaPolitica(politicasDto: Array<DistribuidorPoliticaPorProveedorDto>, proveedorId: string){
    let Data = {
      PoliticaDto: null,
      PoliticasDto: politicasDto,
      Distribuidores: this.Distribuidores,
      ProveedorId: proveedorId,
      agregarNuevo: true
    };
    this.politicaModal.cargarPolitica(Data);
  }

  editar(politicaDto: DistribuidorPoliticaPorProveedorDto, politicasDto:Array<DistribuidorPoliticaPorProveedorDto> , proveedorId: string) {
    let Data = {
      PoliticaDto: politicaDto,
      PoliticasDto: politicasDto,
      Distribuidores: this.Distribuidores,
      ProveedorId: proveedorId,
      agregarNuevo: false
    };
    this.politicaModal.cargarPolitica(Data);
  }

  eliminar(politica: any, politicas:any) {

    Alertas.question("¿Está seguro que desea eliminar la política?").then(() => {
      this.politicaVencimientoService.eliminarPoliticaProveedorActivo(politica.identificador).subscribe();
      let index = politicas.indexOf(politica);
      politicas.splice(index, 1);
    });

  }

}
