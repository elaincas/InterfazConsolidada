import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginService } from '../../../login/services/login.service';
import { DistribuidoresExternosService } from '../distribuidores-externos.service';
import { DistribuidorExterno } from '../models/distribuidor-externo';
import { Alertas } from '../../../helpers/notificaciones/notificaciones';
import CustomStore from 'devextreme/data/custom_store';
import { LoadGridOptions, ColumnaOrdenar } from '../models/LoadGridOptions';
import { isArray } from 'util';
import { SucursalHabilitadaDistribuidor } from '../models/SucursalHabilitadaDistribuidor';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-administrar-sucursales-habilitadas',
  templateUrl: './administrar-sucursales-habilitadas.component.html',
  styleUrls: ['./administrar-sucursales-habilitadas.component.css']
})
export class AdministrarSucursalesHabilitadasComponent implements OnInit {
  distribuidores: DistribuidorExterno[];
  sucursales: any[];
  dataSource: any = {};
  estaEditando = false;
  sucusarEditar: SucursalHabilitadaDistribuidor = new SucursalHabilitadaDistribuidor();
  @ViewChild('gridListado') gridListado: DxDataGridComponent;
  constructor(private _distribuidorExternoService: DistribuidoresExternosService,
    private _loginService: LoginService) {

    this.CargarGrid(_distribuidorExternoService);
  }

  ngOnInit() {
    this.ObtenerDistribuidores();
    this.ObtenerSucursales();
  }
  CargarGrid(service: DistribuidoresExternosService): void {
    this.dataSource.store = new CustomStore({
      load: function (loadOptions: any) {
        const option: LoadGridOptions = new LoadGridOptions();

        if ((loadOptions.filter === undefined) === false && (loadOptions.filter === null) === false) {
          if (isArray(loadOptions.filter[0])) {
            const Valor = loadOptions.filter[0];
            option.ColumnFilter = Valor[0];
            option.FilterValue = Valor[2];
          } else {
            option.ColumnFilter = loadOptions.filter[0];
            option.FilterValue = loadOptions.filter[2];
          }


        }
        option.Sorts = [];
        if ((loadOptions.sort === undefined || loadOptions.sort === null) === false) {
          if (loadOptions.sort.length > 0) {
            loadOptions.sort.forEach(element => {
              const c: ColumnaOrdenar = new ColumnaOrdenar();
              c.ColumnaNombre = element.selector;
              c.Desc = element.desc;
              option.Sorts.push(c);
            });

          }

        }

        option.Page = loadOptions.skip || 0;
        option.PageSize = loadOptions.take || 3;
        return service.ObtenerSucursalesHabilitadas(option).toPromise().then(data => {

          return {
            data: data.data.items,
            totalCount: data.data.totalItems
          };
        });
      }
    });

  }
  ObtenerDistribuidores() {
    this._distribuidorExternoService.ObtenerDistribuidores().subscribe(data => {
      this.distribuidores = data as DistribuidorExterno[];
    }, error => {
      Alertas.error("Advertencia", error.error.message);
    });
  }
  ObtenerSucursales() {
    this._distribuidorExternoService.ObtenerSucursales().subscribe(data => {
      this.sucursales = data.data as any[];
    }, error => {
      Alertas.error("Advertencia", error.error.message);
    });
  }
  ActualizarSucursal(sucursal: SucursalHabilitadaDistribuidor): void {
    this.estaEditando = true;
    sucursal.usuarioId = this._loginService.Usuario.id;
    this.sucusarEditar = sucursal;
  }
  DesactivarSucursal(sucursal: SucursalHabilitadaDistribuidor): void {
    sucursal.activo = false;
    sucursal.usuarioId = this._loginService.Usuario.id;
    this._distribuidorExternoService.ActualiazarSucursalHabilitadaExterna(sucursal).subscribe(data => {
      Alertas.ok("Eliminada correctamente!");
      this.gridListado.instance.refresh();
    }, error => {
      Alertas.error("Ocurrió un error!");
    });
  }
  Texto(): string {
    if (this.estaEditando) {
      return 'Actualizar';
    } else {
      return 'Guardar';
    }
  }
  GuardarCambios(): void {
    this.sucusarEditar.usuarioId = this._loginService.Usuario.id;
    if (this.estaEditando) {
      this._distribuidorExternoService.ActualiazarSucursalHabilitadaExterna(this.sucusarEditar).subscribe(data => {
        Alertas.ok("Actualizada correctamente!" );
        this.Limpiar();
      }, error => {
        Alertas.error("Ocurrió un error!");
      });
    } else {
      this._distribuidorExternoService.GuardarSucursalHabilitadaExterna(this.sucusarEditar).subscribe(data => {
        Alertas.ok("Agregada correctamente!");
        this.Limpiar();
      }, error => {
        Alertas.error("Ocurrió un error!");
      });
    }
  }
  Limpiar(): void {
    this.estaEditando = false;
    this.sucusarEditar = new SucursalHabilitadaDistribuidor();
    this.gridListado.instance.refresh();
  }
}
