import { PedidosRecompraService } from './../../_services/pedidos-recompra.service';
import DataSource from 'devextreme/data/data_source';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import notify from 'devextreme/ui/notify';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { ProductoAgregarPedido } from '../../_models/ProductoAgregarPedido';
import { environment } from '../../../../../environments/environment';
import { Empresas } from '../../../../shared/Empresas/enum-empresas';

enum TipoPedidoEnum {
  EnSucursal = 1,
  ADomicilio = 2,
}

@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.component.html',
  styles: []
})
export class AgregarProductoComponent implements OnInit {
  _cliente: any;
  get cliente() {
    return this._cliente;
  }
  @Input() empresaId: any;
  @Input() set cliente(value: any) {
    this.limpiar();
    this._cliente = value;
    if (value.pedido.tipoPedido === TipoPedidoEnum.ADomicilio) {
      this.pedidosRecompraService.ObtenerSucursalIdAsignadaAColonia(value.pedido.lugarEntregaId).subscribe(
        response => this.sucursalId = response
      );
    } else {
      this.sucursalId = value.pedido.lugarEntregaId;
    }
    this.fechaSeleccionadaParaRealizarPedido = new Date(value.pedido.productos[0].fechaDebeRealizarsePedido);
  }

  @Output() onAgregarProducto = new EventEmitter();

  productosBusquedaDataSource: DataSource;
  loadingVisible = false;
  sucursalId = 5;
  productoSeleccionadoId: string;
  incluirInventarioCiudad: boolean;
  productoRecompraSeleccionado: any;
  cantidadProductoSeleccionada = 1;
  fechaSeleccionadaParaRealizarPedido: Date;
  periodicidadSeleccionada: number;

  precioSeleccionado: { text: string, value: number };
  preciosLista: { text: string, value: number }[];

  constructor(private pedidosRecompraService: PedidosRecompraService) { }

  ngOnInit() {
    this.productosBusquedaDataSource = this.obtenerDataSourceDeProductosBusqueda();
  }

  obtenerDataSourceDeProductosBusqueda(): DataSource {
    return new DataSource({
      store: new CustomStore({
        key: 'productoId',
        load: async (loadOptions) => {
          return await this.pedidosRecompraService.BuscarProductos(loadOptions.searchValue, this.empresaId).toPromise();
        }
      })
    });
  }

  comprobarRecompraDeProducto() {
    if (!this.productoSeleccionadoId || !this.sucursalId) {
      return;
    }
    this.loadingVisible = true;
    this.pedidosRecompraService.ObtenerDetalleDeProducto(this.productoSeleccionadoId,
      this.sucursalId, this.incluirInventarioCiudad).subscribe(
        response => {
          if (!response.recompra || !response.recompra.recompra) {
            notify('Este producto no esta habilitado para la recompra', 'error', 3000);
            this.productoRecompraSeleccionado = undefined;
          } else {
            this.productoRecompraSeleccionado = response;
            this.preciosLista = this.obtenerPrecios(response.precios);

            if (!response.presentacion || !response.presentacion.cantidad) {
              this.periodicidadSeleccionada = 30;
            } else {
              this.periodicidadSeleccionada = response.presentacion.cantidad;
            }
          }
        }, error => {
          Alertas.showHttpResponse(error, '¡Error!', false);
        }, () => this.loadingVisible = false
      );
  }

  obtenerPrecios(precios: any) {
    const preciosList = Object.keys(precios).map(key => {
      let nombre = key.replace(/([a-z])([A-Z])/g, '$1 $2');
      let final = nombre.charAt(0).toUpperCase() + nombre.slice(1) + `: L. ${precios[key]}`;
      return {
        text: final,
        value: precios[key]
      };
    });

    this.precioSeleccionado = preciosList[preciosList.length - 1];
    return preciosList;
  }

  obtenerUrlImagenProducto() {
    if (!this.productoRecompraSeleccionado) {
      return '';
    }
    return environment.ApiProductosImagenes + this.productoRecompraSeleccionado.imagenes[0].url;

  }

  guardarAgregarProducto() {
    Alertas.question('', '¿Desea suscribir este producto?', 'Sí', 'No').then(() => {
      Alertas.load();

      const productoAgregarPedido = new ProductoAgregarPedido(
        this.cliente.clienteId,
        this.productoSeleccionadoId,
        this.precioSeleccionado.value,
        this.cantidadProductoSeleccionada,
        this.periodicidadSeleccionada,
        this.cliente.pedido.tipoPedido === TipoPedidoEnum.ADomicilio ? this.cliente.pedido.lugarEntregaId : undefined,
        this.cliente.pedido.tipoPedido === TipoPedidoEnum.EnSucursal ? this.cliente.pedido.lugarEntregaId : undefined,
        this.cliente.pedido.productos[0].tipoDePago,
        this.cliente.pedido.productos[0].tarjetaId,
        this.productoRecompraSeleccionado.recompra.recompraId,
        this.cliente.pedido.empresaId || Empresas.Farmacia
      );

      this.pedidosRecompraService.AgregarPedido(productoAgregarPedido, this.cliente.clienteId, this.fechaSeleccionadaParaRealizarPedido)
        .subscribe(r => {
          Alertas.okAsinc('¡Exito!', r.mensaje)
          .then(value => this.onAgregarProducto.emit())
          .catch(value => this.onAgregarProducto.emit());
        }, error => {
          Alertas.close();
          Alertas.showHttpResponse(error, '¡Error!', false);
        });
    });
  }

  limpiar() {
    this.incluirInventarioCiudad = true;
    this.productoSeleccionadoId = undefined;
    this.productoRecompraSeleccionado = undefined;
    this.cantidadProductoSeleccionada = 1;
  }
}
